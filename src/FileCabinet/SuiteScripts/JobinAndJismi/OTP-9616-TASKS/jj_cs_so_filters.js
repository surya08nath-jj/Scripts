/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/url', 'N/currentRecord'], (url, currentRecord) => {
  const scriptId = 'customscript_jj_sl_so_basedonstatus';
  const deploymentId = 'customdeploy_jj_sl_so_basedonstatus';

  const fieldChanged = (context) => {
    const record = currentRecord.get();
    const fields = ['custpage_status_filter', 'custpage_customer_filter', 'custpage_subsidiary_filter', 'custpage_department_filter'];

    if (fields.includes(context.fieldId)) {
      const params = {};
      fields.forEach(field => {
        const val = record.getValue({ fieldId: field });
        if (val) params[field] = val;
      });

      const resolvedUrl = url.resolveScript({
        scriptId: scriptId,
        deploymentId: deploymentId,
        params: params,
      });

      window.location.href = resolvedUrl;
    }
  };

  return { fieldChanged };
});