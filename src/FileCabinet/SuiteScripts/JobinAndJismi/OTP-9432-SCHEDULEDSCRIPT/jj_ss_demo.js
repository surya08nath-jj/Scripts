/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/log'], function(log) {

    function execute(context) {
        // Simple log message
        log.debug({
            title: 'Scheduled Script Execution',
            details: 'Hello! This scheduled script ran successfully.'
        });
    }

    return {
        execute: execute
    };
});
