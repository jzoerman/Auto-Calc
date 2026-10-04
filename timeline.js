// Civil dates use UTC internally to avoid timezone and daylight-saving shifts.
export function localDateString(date=new Date()) {
 return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function dateTimestamp(value) {
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Enter a valid ownership start date.');
 const timestamp=Date.parse(value+'T00:00:00Z');
 if(!Number.isFinite(timestamp)||new Date(timestamp).toISOString().slice(0,10)!==value)throw new Error('Enter a valid ownership start date.');
 return timestamp;
}
export function monthTimestamp(startDate,month) {
 const start=new Date(dateTimestamp(startDate));
 const target=new Date(0);target.setUTCFullYear(start.getUTCFullYear(),start.getUTCMonth()+month,1);target.setUTCHours(0,0,0,0);
 const last=new Date(target);last.setUTCMonth(last.getUTCMonth()+1,0);
 target.setUTCDate(Math.min(start.getUTCDate(),last.getUTCDate()));
 return target.getTime();
}
export function timelineSnapshot(rows,startDate,today=localDateString()) {
 const timestamp=dateTimestamp(today), dated=rows.map(row=>({...row,timestamp:monthTimestamp(startDate,row.month)}));
 if(timestamp<dated[0].timestamp)return {rows:dated,timestamp,state:'before',snapshot:null};
 if(timestamp>dated.at(-1).timestamp)return {rows:dated,timestamp,state:'after',snapshot:null};
 let index=dated.findLastIndex(row=>row.timestamp<=timestamp);
 const previous=dated[index],next=dated[index+1];
 const fraction=next?(timestamp-previous.timestamp)/(next.timestamp-previous.timestamp):0;
 const snapshot={...previous,timestamp,month:previous.month+fraction};
 // Payments post on monthly anniversaries; value and mileage progress between them.
 for(const key of ['value','odometer'])snapshot[key]=previous[key]+(next?next[key]-previous[key]:0)*fraction;
 snapshot.equity=snapshot.value-snapshot.balance;
 snapshot.cost=previous.cost+previous.value-snapshot.value;
 return {rows:dated,timestamp,state:'during',snapshot};
}
