/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([], function () {
    function validateLine(context) {
        try {
            const currentRecord = context.currentRecord;
            const sublistId = context.sublistId;

            if (sublistId === 'item') {
                const amount = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount'
                });

                if (amount <= 200) {
                    alert('Amount must be greater than 200');
                    return false;
                }
            }

            return true; // Always return a value


        } catch (error) {
            alert('Error in validateLine: ' + error.message);
            return false;

        }
    }


    return {
        validateLine: validateLine
    };
});

