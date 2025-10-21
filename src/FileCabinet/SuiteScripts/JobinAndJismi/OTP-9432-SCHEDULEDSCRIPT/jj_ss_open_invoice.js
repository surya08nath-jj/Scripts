/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/log', 'N/record', 'N/search'],
    /**
 * @param{email} email
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (email, log, record, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            openInvoice();
            log.debug('Scheduled Script', 'Script executed successfully.');

        }
        function openInvoice() {
            try {
                const invoiceSearch = search.create({
                    type: search.Type.INVOICE,
                    filters:
                        [
                            ["type", "anyof", "CustInvc"],
                            "AND",
                            ["status", "anyof", "CustInvc:A"],
                            "AND",
                            ["mainline", "is", "T"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "entity", label: "Name" }),
                            search.createColumn({ name: "tranid", label: "Document Number" })
                        ]
                });
                const searchResultCount = invoiceSearch.runPaged().count;
                log.debug("invoiceSearch result count", searchResultCount);
                invoiceSearch.run().each(function (result) {
                    const customerName = result.getValue({ name: 'entity' });
                    const documentNumber = result.getValue({ name: 'tranid' });
                    log.debug('Customer Name: ' + customerName + ', Document Number: ' + documentNumber);
                    const recipientId = -5; 
                    const subject = 'Open Invoice Details';
                    const body = 'Dear Admin\nThis is the details of all open invoices \nCustomer Name: ' + customerName + '\n' + 'Document Number: ' + documentNumber+'\n\nRegards,\nNVDSME';
                    const authorId = -5; 
                    try {
                        email.send({ author: authorId, recipients: recipientId, subject: subject, body: body });
                        log.debug('Email Sent', 'Email sent to admin with open invoices.');
                    } catch (error) {
                        log.error('Email Error', 'Error sending email: ' + error.message);
                    }

                    return true;
                });
                
            


            } catch (error) {

            }
        }

            return { execute };
        
        });
