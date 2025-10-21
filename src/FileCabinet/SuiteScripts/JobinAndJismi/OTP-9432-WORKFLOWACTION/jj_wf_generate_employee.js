/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/log', 'N/record', 'N/redirect'],
    /**
 * @param{log} log
 * @param{record} record
 */
    (log, record, redirect) => {
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
            genEmployee(scriptContext);

        }
        function genEmployee(scriptContext) {
            try {
                const taskRecord = scriptContext.newRecord;
                
                const assignedEmployeeId = taskRecord.getValue({ fieldId: 'assigned' });
                if (!assignedEmployeeId) {
                    log.error('No Assigned Employee, The task does not have an assigned employee.');
                    return;
                }


                const employeeRecord = record.load({ type: record.Type.EMPLOYEE, id: assignedEmployeeId });
                const employeeName = employeeRecord.getValue({ fieldId: 'entityid' });

                const newEmployeeRecord = record.create({ type: 'customrecord_jj_custom_employee_record' });
                newEmployeeRecord.setValue({ fieldId: 'custrecord_jj_name', value: employeeName });

                const newEmployeeId = newEmployeeRecord.save();
                taskRecord.submitField({
                    fieldId: 'custevent_empid',
                    value: newEmployeeId
                });

                log.audit('Employee Created', `New employee record created with ID: ${newEmployeeId}`);

                // redirect.toRecord({
                //     type: 'customrecord_jj_custom_employee_record',
                //     id: newEmployeeId,
                //     isEditMode: true
                // });


            } catch (error) {
                log.error('Error', 'Error in generating employee record: ' + error.message);
                throw error;
            }
        }


        return { onAction };
    });
