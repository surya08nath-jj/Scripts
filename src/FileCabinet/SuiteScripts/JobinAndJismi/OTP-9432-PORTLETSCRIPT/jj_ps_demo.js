/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */
define(['N/search'], function (search) {
    /**
     * Defines the Portlet script trigger point.
     * @param {Object} params - The params parameter is a JavaScript object. It is automatically passed to the script entry
     *     point by NetSuite. The values for params are read-only.
     * @param {Portlet} params.portlet - The portlet object used for rendering
     * @param {string} params.column - Column index for the portlet on the dashboard; left column (1), center column (2) or
     *     right column (3)
     * @param {string} params.entity - (For custom portlets only) references the customer ID for the selected customer
     * @since 2015.2
     */
    const render = (params) => {
        const portlet = params.portlet;
        portlet.title = 'Recent Customers';
 
        const customerSearch = search.create({
            type: search.Type.CUSTOMER,
            filters: [],
            columns: [
                search.createColumn({ name: 'entityid' }),
                search.createColumn({ name: 'datecreated', sort: search.Sort.DESC })
            ]
        });
 
        const results = customerSearch.run().getRange({ start: 0, end: 5 });
 
        let html = '<table border="1" style="width:100%; text-align:left;">';
        html += '<tr><th><b>Name</b></th><th><b>Date Created</b></th></tr>';
 
        results.forEach(result => {
            const name = result.getValue('entityid');
            const dateCreated = result.getValue('datecreated');
            html += `<tr><td>${name}</td><td>${dateCreated}</td></tr>`;
        });
 
        html += '</table>';
        portlet.html = html;
    };
 
    return { render };
});
 
 