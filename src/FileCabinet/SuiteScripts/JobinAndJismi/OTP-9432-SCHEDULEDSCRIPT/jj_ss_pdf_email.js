/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/search','N/render','N/email','N/record','N/log'], (search, render, email, record, log) => {
  const ADMIN_ID = -5;
 
  function execute(context) {
    try {
      const soSearch = search.create({
        type: search.Type.SALES_ORDER,
        filters: [['trandate','onorafter','today'],'AND',['trandate','onorbefore','today']],
        columns: [
          search.createColumn({ name: 'internalid' }),
          search.createColumn({ name: 'tranid' }),
          search.createColumn({ name: 'entity' })
        ]
      });
 
      const paged = soSearch.runPaged({ pageSize: 1000 });
      paged.pageRanges.forEach(pageRange => {
        const page = paged.fetch({ index: pageRange.index });
        page.data.forEach(row => {
          const soId = Number(row.id || row.getValue({ name: 'internalid' }));
          if (!soId) return;
 
          const tranId = row.getValue({ name: 'tranid' }) || soId;
          const custRef = row.getValue({ name: 'entity' });
          const custId = custRef ? Number(custRef) : null;
          if (!custId) {
            log.audit('No Customer', `SO ${tranId} (${soId}) has no customer ref`);
            return;
          }
 
          // Get customer email (from SO or customer)
          let custEmail = null;
          try {
            const soRec = record.load({ type: record.Type.SALES_ORDER, id: soId, isDynamic: false });
            custEmail = soRec.getValue({ fieldId: 'email' }) || null;
          } catch (e) {
            log.error('LoadSO', `SO ${soId} load failed: ${e && e.message || e}`);
            return;
          }
 
          if (!custEmail) {
            try {
              const custRec = record.load({ type: record.Type.CUSTOMER, id: custId });
              // common customer email fields: email or custentity_email (custom)
              custEmail = custRec.getValue({ fieldId: 'email' }) || custRec.getValue({ fieldId: 'custentity_email' }) || null;
            } catch (e) {
              log.error('LoadCustomer', `Customer ${custId} load failed: ${e && e.message || e}`);
            }
          }
 
          if (!custEmail) {
            log.audit('No Email', `SO ${tranId} (${soId}) - no email found`);
            return;
          }
 
          try {
            const pdfFile = render.transaction({
              entityId: soId,
              recordType: record.Type.SALES_ORDER,
              printMode: render.PrintMode.PDF
            });
            pdfFile.name = `SalesOrder_${tranId}.pdf`;
            pdfFile.isOnline = false;
 
            // Send using customer internal id as recipient and set relatedRecords
            email.send({
              author: ADMIN_ID,
              recipients: custId, // pass internal id to associate with customer
              subject: `Sales Order ${tranId}`,
              body: `Hello,\n\nPlease find attached your Sales Order ${tranId}.\n\nRegards.`,
              attachments: [pdfFile],
              relatedRecords: {
                transactionId: soId,
                entityId: custId
              }
            });
 
            log.audit('Email Sent', `SO ${tranId} (${soId}) sent to ${custEmail} (custId ${custId})`);
          } catch (err) {
            log.error('Email Send Error', `SO ${tranId} (${soId}) to ${custEmail} failed: ${err && err.message || err}`);
          }
        });
      });
    } catch (err) {
      log.error('Script Error', err && err.message || err);
    }
  }
 
  return { execute };
});
 
 