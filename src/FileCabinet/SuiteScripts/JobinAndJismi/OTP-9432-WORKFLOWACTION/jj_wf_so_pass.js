/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/log'],
    /**
 * @param{log} log
 */
    (log) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {
            passFail(scriptContext);


        }
        function passFail(scriptContext) {
            try {
                const salesOrderRecord = scriptContext.newRecord;
                const number = salesOrderRecord.getValue({ fieldId: 'custbody_jj_number' });
                if (number >= 100) {
                    salesOrderRecord.setValue({ fieldId: 'custbody_jj_result', value: 'Passed' });
                } else {
                    salesOrderRecord.setValue({ fieldId: 'custbody_jj_result', value: 'Failed' });
                }

                
            } catch (error) {
                log.error('Error', 'Error in workflow action script: ' + error.message);
                throw error;
                
            }
        }

        return {onAction};
    });
