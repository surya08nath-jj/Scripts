/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/search', 'N/ui/serverWidget', 'N/url', 'N/runtime'],
    /**
     * @param{log} log
     * @param{search} search
     * @param{serverWidget} serverWidget
     * @param{url} url
     * @param{runtime} runtime
     */
    (log, search, serverWidget, url, runtime) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            const request = scriptContext.request;
            const response = scriptContext.response;
            
            // Create the form
            const form = serverWidget.createForm({title: 'Sales Orders by Status'});

            // Attach client script (file must be deployed to File Cabinet at this path)
            form.clientScriptModulePath = 'SuiteScripts/JobinAndJismi/OTP-9616-TASKS/jj_cs_so_filters.js';
            
            // Status filter
            const statusField = form.addField({
                id: 'custpage_status_filter',
                type: serverWidget.FieldType.SELECT,
                label: 'Status',
                source: 'salesorderstatus'
            });
            statusField.addSelectOption({value: '', text: ''});
            statusField.addSelectOption({value: 'SalesOrd:B', text: 'Pending Fulfillment'});
            statusField.addSelectOption({value: 'SalesOrd:F', text: 'Pending Billing'});

            const customerField = form.addField({
                id: 'custpage_jj_customer_filter',
                type: serverWidget.FieldType.SELECT,
                label: 'Customer',
                source: 'customer'
            });
            
            const subsidiaryField = form.addField({
                id: 'custpage_jj_subsidiary_filter',
                type: serverWidget.FieldType.SELECT,
                label: 'Subsidiary',
                source: 'subsidiary'
            });
            
            const departmentField = form.addField({
                id: 'custpage_jj_department_filter',
                type: serverWidget.FieldType.SELECT,
                label: 'Department',
                source: 'department'
            });

            // Preselect filter values if passed in querystring
            if (request.parameters.custpage_status_filter) {
                try { statusField.defaultValue = request.parameters.custpage_status_filter; } catch (e) { /* ignore */ }
            }
            if (request.parameters.custpage_customer_filter) {
                try { customerField.defaultValue = request.parameters.custpage_customer_filter; } catch (e) { /* ignore */ }
            }
            if (request.parameters.custpage_subsidiary_filter) {
                try { subsidiaryField.defaultValue = request.parameters.custpage_subsidiary_filter; } catch (e) { /* ignore */ }
            }
            if (request.parameters.custpage_department_filter) {
                try { departmentField.defaultValue = request.parameters.custpage_department_filter; } catch (e) { /* ignore */ }
            }

            const salesorderSublist = form.addSublist({
                id: 'custpage_jj_salesorder_sublist',
                type: serverWidget.SublistType.LIST,
                label: 'Sales Orders'
            });
            
            // Define sublist fields
            salesorderSublist.addField({
                id: 'custpage_jj_so_internalid',
                type: serverWidget.FieldType.TEXT,
                label: 'Internal ID'
            });
            salesorderSublist.addField({
                id: 'custpage_jj_so_tranid',
                type: serverWidget.FieldType.TEXT,
                label: 'Document Name'
            });
            salesorderSublist.addField({
                id: 'custpage_jj_so_date',
                type: serverWidget.FieldType.DATE,
                label: 'Date'
            });
            salesorderSublist.addField({
                id: 'custpage_jj_so_status',
                type: serverWidget.FieldType.TEXT,
                label: 'Status'
            });
            salesorderSublist.addField({
                id: 'custpage_jj_so_customer',
                type: serverWidget.FieldType.TEXT,
                label: 'Customer Name'
            });
            salesorderSublist.addField({
                id: 'custpage_jj_so_subsidiary',
                type: serverWidget.FieldType.TEXT,
                label: 'Subsidiary'
            });
            salesorderSublist.addField({
                id: 'custpage_jj_so_department',
                type: serverWidget.FieldType.TEXT,
                label: 'Department'
            });
            salesorderSublist.addField({
                id: 'custpage_jj_so_class',
                type: serverWidget.FieldType.TEXT,
                label: 'Class'
            });
            salesorderSublist.addField({
                id: 'custpage_jj_so_subtotal',
                type: serverWidget.FieldType.CURRENCY,
                label: 'Subtotal'
            });
            salesorderSublist.addField({
                id: 'custpage_jj_so_tax',
                type: serverWidget.FieldType.CURRENCY,
                label: 'Tax'
            });
            salesorderSublist.addField({
                id: 'custpage_jj_so_total',
                type: serverWidget.FieldType.CURRENCY,
                label: 'Total'
            });

            // Build filters for search based on selected filter values
            const filters = [];
            filters.push(['mainline', 'is', 'T']);
            filters.push('AND');
            filters.push(['status', 'anyof', ['SalesOrd:B', 'SalesOrd:F']]); // Only "Pending Approval" or "Pending Fulfillment"

            if (request.parameters.custpage_status_filter) {
                filters.push('AND');
                filters.push(['status', 'anyof', request.parameters.custpage_status_filter]);
            }
            if (request.parameters.custpage_customer_filter) {
                filters.push('AND');
                filters.push(['entity', 'anyof', request.parameters.custpage_customer_filter]);
            }
            if (request.parameters.custpage_subsidiary_filter) {
                filters.push('AND');
                filters.push(['subsidiary', 'anyof', request.parameters.custpage_subsidiary_filter]);
            }
            if (request.parameters.custpage_department_filter) {
                filters.push('AND');
                filters.push(['department', 'anyof', request.parameters.custpage_department_filter]);
            }

            // Create the search
            const soSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: filters,
                columns: [
                    {name: 'internalid'},
                    {name: 'tranid'},
                    {name: 'trandate'},
                    {name: 'statusref'},
                    {name: 'entity'},
                    {name: 'subsidiary'},
                    {name: 'department'},
                    {name: 'class'},
                    {name: 'grossamount'},
                    {name: 'taxamount'},
                    {name: 'amount'}
                ]
            });

            // Run the search and populate the sublist
            let line = 0;
            // Helper: safely set sublist value ensuring a defined string is passed
            const safeSet = (sublist, options) => {
                try {
                    const id = options.id;
                    const ln = options.line;
                    let val = options.value;
                    if (val === undefined || val === null) {
                        val = '';
                    } else if (typeof val === 'object' && val instanceof Date) {
                        // Convert Date to ISO-ish string acceptable to NetSuite UI
                        val = val.toISOString().split('T')[0];
                    } else {
                        val = String(val);
                    }
                    sublist.setSublistValue({id: id, line: ln, value: val});
                } catch (err) {
                    try { log.error('safeSet failed', {id: options.id, line: options.line, error: err}); } catch (e) { /* ignore */ }
                }
            };

            soSearch.run().each(result => {
                safeSet(salesorderSublist, {id: 'custpage_jj_so_internalid', line: line, value: result.getValue({name: 'internalid'})});
                safeSet(salesorderSublist, {id: 'custpage_jj_so_tranid', line: line, value: result.getValue({name: 'tranid'})});
                safeSet(salesorderSublist, {id: 'custpage_jj_so_date', line: line, value: result.getValue({name: 'trandate'})});
                safeSet(salesorderSublist, {id: 'custpage_jj_so_status', line: line, value: result.getText({name: 'statusref'})});
                safeSet(salesorderSublist, {id: 'custpage_jj_so_customer', line: line, value: result.getText({name: 'entity'})});
                safeSet(salesorderSublist, {id: 'custpage_jj_so_subsidiary', line: line, value: result.getText({name: 'subsidiary'})});
                safeSet(salesorderSublist, {id: 'custpage_jj_so_department', line: line, value: result.getText({name: 'department'})});
                safeSet(salesorderSublist, {id: 'custpage_jj_so_class', line: line, value: result.getText({name: 'class'})});
                safeSet(salesorderSublist, {id: 'custpage_jj_so_subtotal', line: line, value: result.getValue({name: 'grossamount'})});
                safeSet(salesorderSublist, {id: 'custpage_jj_so_tax', line: line, value: result.getValue({name: 'taxamount'})});
                safeSet(salesorderSublist, {id: 'custpage_jj_so_total', line: line, value: result.getValue({name: 'amount'})});

                line++;
                return true;
            });



            response.writePage(form);   


        
    };
    return {onRequest}

    });
