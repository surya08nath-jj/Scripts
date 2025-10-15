/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */
define(['N/log','N/search'],
    /**
 * @param{log} log
 */
    function (log, search) {
        /**
         * Defines the Portlet script trigger point.
         * @param {Object} params - The params parameter is a JavaScript object. It is automatically passed to the script entry
         *     point by NetSuite. The values for params are read-only.
         * @param {Portlet} params.portlet - The portlet object used for rendering
         * @param {string} params.column - Column index forthe portlet on the dashboard; left column (1), center column (2) or
         *     right column (3)
         * @param {string} params.entity - (For custom portlets only) references the customer ID for the selected customer
         * @since 2015.2
         */
        const render = (params) => {
            renderPortlet(params);

        }
        function renderPortlet(params) {
            try {
                const portlet = params.portlet;
                portlet.title = 'Customer Engagement Tracker';
                const customerSearch = search.create({
                    type: search.Type.CUSTOMER,
                    filters: [],
                    columns: [
                        search.createColumn({ name: 'entityid' }),
                        search.createColumn({ name: "lastsaledate" }),
                        search.createColumn({ name: "isinactive" })
                    ]
                });
                const results = customerSearch.run().getRange({ start: 0, end: 10 });
                let html = '<table border="1" style="width:100%; text-align:left;">';
                html += '<tr><th><b>Customer Name</b></th><th><b>Last Transaction Date</b></th><th><b>Inactive Status</b></th></tr>';

                results.forEach(result => {
                    const name = result.getValue('entityid');
                    const lastTransactionDate = result.getValue('lastsaledate');
                    const engagementStatus = result.getText('entitystatus');
                    html += `<tr><td>${name}</td><td>${lastTransactionDate}</td><td>${engagementStatus}</td></tr>`;
                });

                html += '</table>';

                portlet.html = html;

            } catch (error) {
                log.error('Error', 'Error rendering portlet: ' + error.message);

            }
        }

        return { render }

    });
