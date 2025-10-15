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
            updateClass(params);

        }
        function updateClass(params) {
            try {
                const objRecord = record.load({
                    type: params.type,
                    id: params.id
                })
                const studentClass = objRecord.getText('custrecord_jj_class')
                log.debug('Student Class', 'Current class: ' + studentClass);
                if (parseInt(studentClass) === 10) {
                    objRecord.setValue({
                        fieldId: 'custrecord_jj_class',
                        value: 'Completed'
                    })
                }
                else if(parseInt(studentClass)>0 && parseInt(studentClass)<10 ) {
                    objRecord.setValue({
                        fieldId: 'custrecord_jj_class',
                        value: parseInt(studentClass) + 1
                    })
                }
                else{
                    log.debug('Info', 'Class is not a valid number to update.');
                }
                objRecord.save()

            } catch (error) {
                log.error('Error', 'Error updating class: ' + error.message);

            }


        }

        return { each }

    });
