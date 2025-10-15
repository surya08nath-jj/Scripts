/* Create 3 custom fields “length", "breadth "and “height” in the item record. 
Add a field “container box” in the sublist line of the sales order. The value of 
the container box must be ‘length*breadth*height’. The amount must
 be ‘rate*container box’. Add the line only if the amount is equal to ‘rate*container box’.    */


/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/record'],
/**
 * @param{log} log
 * @param{record} record
 */
function(log, record) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {

    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {

    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {
        try { 
            const currentRecord = scriptContext.currentRecord;
            const sublistId = scriptContext.sublistId;

            if (sublistId === 'item') {
                const itemId = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item'
                });

                if (!itemId) {
                    alert('Please select an item first.');
                    return false;
                }

                const itemRecord = record.load({
                    type: record.Type.INVENTORY_ITEM,
                    id: itemId
                });

                const length = parseFloat(itemRecord.getValue({ fieldId: 'custitem_jj_length' })) || 0;
                const breadth = parseFloat(itemRecord.getValue({ fieldId: 'custitem_jj_breadth' })) || 0;
                const height = parseFloat(itemRecord.getValue({ fieldId: 'custitem_jj_height' })) || 0;

                const containerBox = length * breadth * height;

                currentRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_jj_container_box',
                    value: containerBox,
                    ignoreFieldChange: true
                });

                const rate = parseFloat(currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate'
                })) || 0;

                const expectedAmount = rate * containerBox;

                const amount = parseFloat(currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount'
                })) || 0;

                if (amount !== expectedAmount) {
                    alert('Amount must be equal to Rate * Container Box ');
                    return false;
                }
            }

            return true; // Always return a value
            
        } catch (error) {
            alert('Error in validateInsert: ' + error.message);
            return false;
            
        }

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {

    }

    return {
        // pageInit: pageInit,
        // fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        validateInsert: validateInsert,
        // validateDelete: validateDelete,
        // saveRecord: saveRecord
    };
    
});
