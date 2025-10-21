/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/ui/serverWidget'],
    /**
 * @param{log} log
 * @param{serverWidget} serverWidget
 */
    (log, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            const serverRequest = scriptContext.request;

            const newForm = serverWidget.createForm({
                title: 'Registration Form'
            });

            newForm.addResetButton({
                label: 'Reset'
            })
            newForm.addSubmitButton({
                label: 'Save'
            })

            newForm.addFieldGroup({
                id: 'custpage_jj_user_details',
                label: 'User Details'
            });

            newForm.addField({
                id: 'custpage_jj_name',
                label: 'Name',
                type: serverWidget.FieldType.TEXT,
                container: 'custpage_jj_user_details'
            });
            
            newForm.addField({
                id: 'custpage_jj_age',
                label: 'Age',
                type: serverWidget.FieldType.INTEGER,
                container: 'custpage_jj_user_details'
            });
            
            newForm.addField({
                id: 'custpage_jj_phone',
                label: 'Phone Number',
                type: serverWidget.FieldType.PHONE,
                container: 'custpage_jj_user_details'
            });
            
            newForm.addField({
                id: 'custpage_jj_email',
                label: 'Email',
                type: serverWidget.FieldType.EMAIL,
                container: 'custpage_jj_user_details'
            });
            
            newForm.addField({
                id: 'custpage_jj_father_name',
                label: 'Father\'s Name',
                type: serverWidget.FieldType.TEXT,
                container: 'custpage_jj_user_details'
            });
            
            newForm.addField({
                id: 'custpage_jj_address',
                label: 'Address',
                type: serverWidget.FieldType.TEXTAREA,
                container: 'custpage_jj_user_details'
            });

            scriptContext.response.writePage({
                pageObject: newForm
            });
        }

        return {onRequest}

    });
