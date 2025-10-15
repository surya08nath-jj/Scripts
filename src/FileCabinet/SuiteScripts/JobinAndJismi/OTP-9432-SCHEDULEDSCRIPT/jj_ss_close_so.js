/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/log', 'N/record', 'N/search'],
    /**
 * @param{log} log
 */
    (log,record,search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        /*Close sales orders in NetSuite that were created over 4 days ago, 
        but only if they contain an item named 'KITKAT'. */
        const execute = (scriptContext) => {
            closeSO(scriptContext);

        }
        function closeSO(scriptContext) {
            const customSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: [
                    ["type", "anyof", "SalesOrd"],
                    "AND",
                    ["status", "anyof", "SalesOrd:B"],
                    "AND",
                    ["trandate", "before", "fourdaysago"],
                    "AND",
                    ["mainline", "is", "F"]
                ],
                columns: [
                    search.createColumn({ name: "tranid", label: "Document Number" }),
                    search.createColumn({ name: "item", label: "Item" })
                ]
            });
            const searchResultCount = customSearch.runPaged().count;
            log.debug("customSearch result count", searchResultCount);
            customSearch.run().each(function (result) {
                const itemName = result.getText({ name: 'item' });
                if (itemName === 'KITKAT') {
                    const salesOrderId = result.id;
                    const salesOrderRecord = record.load({
                        type: record.Type.SALES_ORDER,
                        id: salesOrderId,
                        isDynamic: true,
                    });
                    const lineCount = salesOrderRecord.getLineCount({ sublistId: 'item' });
                    for (let i = 0; i < lineCount; i++) {
                        salesOrderRecord.selectLine({ sublistId: 'item', line: i });
                        salesOrderRecord.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'isclosed',
                            value: true
                        });
                        salesOrderRecord.commitLine({ sublistId: 'item' });
                    }
                    const salesOrderIdUpdated = salesOrderRecord.save();
                    log.debug('Sales Order Updated', 'Sales Order ID ' + salesOrderIdUpdated + ' has been closed.');

                }
                else {
                    log.debug('Item Check', 'Sales Order does not contain KITKAT, skipping closure.');  
                }   

                return true; // Continue to next result
            });

            log.debug('Close SO', 'Closing Sales Order');

        }



        return { execute }

    });
