/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/log', 'N/record'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
       
        const each = (params) => {
            const invoiceId = params.id;
            const invoiceRecord = record.load({
                type: record.Type.INVOICE,
                id: invoiceId
            });
            const dueDate = invoiceRecord.getValue({
                fieldId: 'duedate'
            });
            const today = new Date();
            const pastDueDate = new Date(dueDate);
            pastDueDate.setDate(pastDueDate.getDate() + 7);

            if (today > pastDueDate) {
                const newDueDate = new Date();
                newDueDate.setDate(today.getDate() + 7);
                invoiceRecord.setValue({
                    fieldId: 'duedate',
                    value: newDueDate
                });
                invoiceRecord.save();
                log.debug('Invoice Updated', 'Invoice ID: ' + invoiceId + ' Due Date updated to ' + newDueDate.toDateString());
            }
        };  

        return { each }

    });
