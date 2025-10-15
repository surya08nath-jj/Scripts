/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/log', 'N/search','N/email','N/runtime'],
    /**
 * @param{log} log
 */
    (log, search, email, runtime) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            sendEmail();
            log.debug('Scheduled Script', 'Script executed successfully.');

        }
        function sendEmail() {
            const searchId = 'customsearch_jj_open_invoicessss'; 
            const invoice = search.load({ id: searchId });
            const results = invoice.run();
            results.each(result => {
                const customerName = result.getText({ name: 'entity' });
                const docNumber = result.getValue({ name: 'tranid' });
                log.debug('Email Sent', 'Email sent to customers with open invoices.');
                const recipientID = -5; 
                const body = 'Inoice Details:\n' + 'Customer Name: ' + customerName + '\n' + 'Document Number: ' + docNumber;
                const subject = 'Open Invoice Details';
                const authorId = -5; 
                try {
                    email.send({ author: authorId , recipients: recipientID, subject: subject, body: body });
                    log.debug('Email Sent', 'Email sent to admin with open invoices.');
                    
                } catch (error) {
                    log.error('Email Error', 'Error sending email: ' + error.message);
                    
                }
                return true; 
            
                
            });

        }

        return { execute }

    });