/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/log', 'N/redirect'], (record, log, redirect) => {
  const onAction = (context) => {
    try {
      const taskRecord = context.newRecord;
      const taskId = taskRecord.id;
      log.debug('Task ID', taskId);
 
      const customRec = record.create({
        type: 'customrecord_jj_custom_record',
        isDynamic: true
      });
 
      // Set required name field
      customRec.setValue({
        fieldId: 'custrecord_name',
        value: `Created from Task ${taskId}`
      });
 
      customRec.setValue({
        fieldId: 'custrecord_test',
        value: `Success`
      });
 
      const customRecId = customRec.save();
      log.debug('Custom Record Created', `ID: ${customRecId}`);
 
      record.submitFields({
        type: record.Type.TASK,
        id: taskId,
        values: {
          custevent_created_record_id: customRecId
        }
      });
 
      log.debug('Task Updated', `Stored custom record ID: ${customRecId}`);
 
      // Redirect to the created custom record
      redirect.toRecord({
        type: 'customrecord_jj_custom_record',
        id: customRecId
      });
 
    } catch (error) {
      log.error('Error in Workflow Action Script', error);
      throw error;
    }
  };
 
  return { onAction };
});
 
 
 