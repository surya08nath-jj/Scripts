/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/log', 'N/record', 'N/search'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (log, record, search) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            const salesOrderId = params.id;
            const salesOrder = record.load({
                type: record.Type.SALES_ORDER,
                id: salesOrderId
            });
            salesOrder.setValue({
                fieldId: 'memo',
                value: 'Memo updated'
            });
            salesOrder.save();
            log.debug('Sales Order Updated', 'Sales Order ID: ' + salesOrderId + ' has been updated with new memo.');
        };


        return { each }

    });