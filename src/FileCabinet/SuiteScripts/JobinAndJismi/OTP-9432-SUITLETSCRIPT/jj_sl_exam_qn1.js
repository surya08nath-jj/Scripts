/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/record', 'N/ui/serverWidget'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{serverWidget} serverWidget
 */
    (log, record, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        
        const onRequest = (scriptContext) => {
            registrationForm(scriptContext);
        }
        function registrationForm(scriptContext) {
            try {
                const serverRequest = scriptContext.request;
                const serverResponse = scriptContext.response;

                if (serverRequest.method === 'GET') {
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
                        label: "Father's Name",
                        type: serverWidget.FieldType.TEXT,
                        container: 'custpage_jj_user_details'
                    });

                    newForm.addField({
                        id: 'custpage_jj_address',
                        label: 'Address',
                        type: serverWidget.FieldType.TEXTAREA,
                        container: 'custpage_jj_user_details'
                    });

                    serverResponse.writePage(newForm);
                } else {
                    const name = serverRequest.parameters.custpage_jj_name;
                    const age = serverRequest.parameters.custpage_jj_age;
                    const phone = serverRequest.parameters.custpage_jj_phone;
                    const email = serverRequest.parameters.custpage_jj_email;
                    const fatherName = serverRequest.parameters.custpage_jj_father_name;
                    const address = serverRequest.parameters.custpage_jj_address;

                    
                    serverResponse.write(`You have entered:\n Name: ${name}\n Age: ${age}\n Phone: ${phone}\n Email: ${email}\n Father's Name: ${fatherName}\n Address: ${address}`);

                    const customRecord = record.create({
                        type: 'customrecord_jj_registration' 
                    });

                    customRecord.setValue({
                        fieldId: 'custrecord_jj_names',
                        value: name
                    });
                    customRecord.setValue({
                        fieldId: 'custrecord_jj_age',
                        value: age
                    });
                    customRecord.setValue({
                        fieldId: 'custrecord_jj_phone',
                        value: phone
                    });
                    customRecord.setValue({
                        fieldId: 'custrecord_jj_email',
                        value: email
                    });
                    customRecord.setValue({
                        fieldId: 'custrecord_jj_father_name',
                        value: fatherName
                    });
                    customRecord.setValue({
                        fieldId: 'custrecord_jj_address',
                        value: address
                    });

                    const recordId = customRecord.save();
                    log.audit('Custom Record Created', `Record ID: ${recordId}`);
                }

                
            } catch (error) {
                log.error('Error', 'Error in registration form: ' + error.message);
                throw error;
                
            }
        }

        

        return {onRequest}

    });
