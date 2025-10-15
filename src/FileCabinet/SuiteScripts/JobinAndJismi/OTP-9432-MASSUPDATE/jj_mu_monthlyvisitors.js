/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
 
            const objRecord=record.load({
                type: params.type,
                id: params.id
            })
            const martialStatus= objRecord.getText('custrecordjj_martial_status')
 
            if(martialStatus === 'unmarried')
               
            objRecord.setText({
                fieldId: 'custrecordjj_martial_status',
                text: 'Married'
            })
 
            objRecord.save()
        }
 
        return {each}
 
    });
 
 