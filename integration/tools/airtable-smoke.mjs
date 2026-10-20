import { randomUUID } from 'node:crypto';
const { AIRTABLE_TOKEN: token, AIRTABLE_BASE_ID: base, AIRTABLE_TABLE_ID: table } = process.env;
if (!token || !base || !table) throw new Error('Missing Airtable configuration');
const endpoint = `https://api.airtable.com/v0/${base}/${table}`;
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
const name = `MW connection test ${randomUUID()}`;
const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
let recordId;
let created = false;
async function call(method, url, body) {
  const response = await fetch(url, { method, headers, ...(body ? {body:JSON.stringify(body)} : {}), signal:AbortSignal.timeout(15000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Airtable HTTP ${response.status}; error type: ${typeof data.error?.type === 'string' ? data.error.type.replace(/[^A-Z_]/g,'') : 'unknown'}`);
  return data;
}
try {
  const fields = { fldaOxNr7MAWsadLz:name, fldiH8Hl7TaDPX5rm:slug, fldKucG1B6eJzXPPt:'Madeleine integration test', fldmP1yKBCseNpWHG:'Inactive connection test; do not speak.', fld85BoGXvg5yaR3Q:'Temporary connectivity test; will be deleted.', fld6ZevxYqsrP0fCn:false, fldBijVi8ETlwgfgX:JSON.stringify({source:'my-custom-chatbot',test:true,submittedAt:new Date().toISOString()}) };
  const body = {performUpsert:{fieldsToMergeOn:['fldiH8Hl7TaDPX5rm']},returnFieldsByFieldId:true,records:[{fields}]};
  const first = await call('PATCH',endpoint,body);
  recordId = first.records?.[0]?.id;
  created = Boolean(recordId && first.createdRecords?.includes(recordId));
  if (!created) throw new Error('A new test record was not confirmed; stop');
  console.log(JSON.stringify({created:true,recordId,active:false}));
  fields.fld85BoGXvg5yaR3Q='Updated: same slug, same record.';
  const second = await call('PATCH',endpoint,body);
  if (second.records?.[0]?.id !== recordId || !second.updatedRecords?.includes(recordId) || second.createdRecords?.length) throw new Error('Upsert did not confirm the same record');
  const read = await call('GET',`${endpoint}/${recordId}?returnFieldsByFieldId=true`);
  if (read.fields?.fld85BoGXvg5yaR3Q !== fields.fld85BoGXvg5yaR3Q || read.fields?.fld6ZevxYqsrP0fCn === true) throw new Error('Read-back did not match');
  console.log(JSON.stringify({updated:true,sameRecord:true,readBack:true}));
} catch (error) {
  console.error(JSON.stringify({ok:false,error:error.message,networkCode:error.cause?.code ?? null}));
  process.exitCode=1;
} finally {
  if (created && recordId) {
    try {
      const deleted = await call('DELETE',`${endpoint}/${recordId}`);
      if (!deleted.deleted) throw new Error('Deletion was not confirmed');
      console.log(JSON.stringify({deleted:true,recordId}));
    } catch (error) {
      console.error(JSON.stringify({cleanupFailed:true,recordId,error:error.message}));
      process.exitCode=1;
    }
  }
}
