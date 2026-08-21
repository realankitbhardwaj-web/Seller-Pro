// shared-config.js — Seller Pro extras ke liye common Supabase config.
// Isko index.html ke SUPABASE_URL/KEY se hamesha match rakhna — dono jagah same project.
const SUPABASE_URL = 'https://oshargfscaylmvwuhgpt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zaGFyZ2ZzY2F5bG12d3VoZ3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MzU3MTcsImV4cCI6MjA5MzIxMTcxN30.uGXCMCA6KhwnTqrG0cfWa-9PeXyjTZvcImnxFD6Rfnk';

async function sbReq(method, table, body, query){
  try{
    let url = SUPABASE_URL + '/rest/v1/' + table + (query ? ('?' + query) : '');
    const headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json'
    };
    if(method === 'POST') headers['Prefer'] = 'resolution=merge-duplicates,return=minimal';
    if(method === 'GET') headers['Prefer'] = 'count=none';
    const opts = { method, headers };
    if(body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    if(!res.ok){ console.warn('sbReq fail', table, res.status, await res.text().catch(()=>'')); return null; }
    if(method === 'GET') return await res.json();
    return true;
  }catch(e){ console.warn('sbReq error', e); return null; }
}

// Saare pages ek jagah offset-pagination se poora data khinchein (1000-row cap se bachne ke liye)
async function sbGetAll(table, select, filterQuery){
  let all = [], offset = 0; const pageSize = 1000;
  while(true){
    let q = (select ? ('select=' + select + '&') : '') + (filterQuery ? (filterQuery + '&') : '') + 'limit=' + pageSize + '&offset=' + offset;
    const page = await sbReq('GET', table, null, q);
    if(!page) break;
    all = all.concat(page);
    if(page.length < pageSize) break;
    offset += pageSize;
    if(all.length >= 50000) break;
  }
  return all;
}
