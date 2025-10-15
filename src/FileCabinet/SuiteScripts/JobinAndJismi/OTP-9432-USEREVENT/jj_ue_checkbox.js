/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/record'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record) => {
        // /**
        //  * Defines the function definition that is executed before record is loaded.
        //  * @param {Object} scriptContext
        //  * @param {Record} scriptContext.newRecord - New record
        //  * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
        //  * @param {Form} scriptContext.form - Current form
        //  * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
        //  * @since 2015.2
        //  */
        // const beforeLoad = (scriptContext) => {

        // }

        // /**
        //  * Defines the function definition that is executed before record is submitted.
        //  * @param {Object} scriptContext
        //  * @param {Record} scriptContext.newRecord - New record
        //  * @param {Record} scriptContext.oldRecord - Old record
        //  * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
        //  * @since 2015.2
        //  */
        // const beforeSubmit = (scriptContext) => {

        // }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        function afterSubmit(scriptContext) {
            try {
                log.debug('Script Triggered', 'Type: ' + scriptContext.type);

                if (scriptContext.type !== 'create') {
                    log.debug('Skipped', 'Not a create event');
                    return;
                }

                const newRec = scriptContext.newRecord;
                const recType = newRec.type;
                const entityId = newRec.getValue('entity');

                log.debug('Record Info', `recType=${recType}, entityId=${entityId}`);

                if (!entityId) {
                    log.debug('No entity', 'Skipping');
                    return;
                }

                const fieldId = 'custentityjj_sopo_checkbox'; // your exact ID

                if (recType === 'salesorder') {
                    log.debug('Action', 'Updating Customer');
                    record.submitFields({
                        type: record.Type.CUSTOMER,
                        id: entityId,
                        values: { [fieldId]: true },
                        options: { enableSourcing: false, ignoreMandatoryFields: true }
                    });
                    log.debug('Done', 'Customer updated');
                } 
                else if (recType === 'purchaseorder') {
                    log.debug('Action', 'Updating Vendor');
                    record.submitFields({
                        type: record.Type.VENDOR,
                        id: entityId,
                        values: { [fieldId]: true },
                        options: { enableSourcing: false, ignoreMandatoryFields: true }
                    });
                    log.debug('Done', 'Vendor updated');
                } 
                else {
                    log.debug('Not Handled Type', recType);
                }

            } catch (e) {
                log.error('Error', e);
            }
        }

        return {
            afterSubmit: afterSubmit
        };

    });
