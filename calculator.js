export const defaults = {price:35000,tax:6,taxable:35000,fees:600,financeFees:true,rebate:0,down:5000,trade:0,tradeDebt:0,mode:'finance',apr:6.5,term:60,months:60,extra:0,lump:0,lumpMonth:12,payoff:0,depreciation:'18, 12, 10, 8, 8',resale:'',odometer:12000,mileage:12000};
export function normalize(raw) {
 const d={...defaults};
 for(const key of Object.keys(d)) if(raw[key]!==undefined) d[key]=raw[key];
 for(const key of Object.keys(d)) if(typeof defaults[key]==='number') { d[key]=Number(d[key]); if(!Number.isFinite(d[key])||d[key]<0) throw new Error('Enter a valid nonnegative value for '+key+'.'); }
 for(const k of ['term','months','lumpMonth','payoff']) d[k]=Math.round(d[k]);
 if(d.term<1||d.term>600||d.months<1||d.months>600) throw new Error('Loan and ownership periods must be between 1 and 600 months.');
 if(!['cash','finance'].includes(d.mode)) throw new Error('Choose cash or financing.');
 if(typeof d.financeFees!=='boolean') throw new Error('Invalid fee selection.');
 d.depreciation=String(d.depreciation);
 const rates=d.depreciation.split(',').map(x=>Number(x.trim()));
 if(!rates.length||rates.some(x=>!Number.isFinite(x)||x<0||x>100)) throw new Error('Depreciation rates must be between 0 and 100, separated by commas.');
 d.resale=String(d.resale).trim();
 if(d.resale!==''&&(!Number.isFinite(Number(d.resale))||Number(d.resale)<0)) throw new Error('Enter a valid resale value.');
 return d;
}
export function calculate(raw) {
 const d=normalize(raw), rates=d.depreciation.split(',').map(Number), tax=d.taxable*d.tax/100;
 const purchase=d.price+tax+d.fees-d.rebate, equity=d.trade-d.tradeDebt;
 const net=purchase-equity;
 const principal=d.mode==='finance'?Math.max(0,net-d.down-(d.financeFees?0:d.fees)):0;
 const upfront=net-principal;
 const r=d.apr/1200;
 const payment=principal===0?0:r===0?principal/d.term:principal*r/(1-Math.pow(1+r,-d.term));
 function amortize(extra,lump,payoff) {
  let balance=principal,interestTotal=0,paid=0,finish=0; const schedule=[];
  for(let month=1;month<=Math.max(d.months,d.term);month++) {
   const interest=balance*r;
   let pay=balance>0?Math.min(balance+interest,payment+extra+(month===d.lumpMonth?lump:0)):0;
   if(payoff&&month===payoff) pay=balance+interest;
   const principalPaid=pay-interest;
   balance=Math.max(0,balance-principalPaid); if(balance<1e-7) balance=0;
   paid+=pay;interestTotal+=interest;
   if(!balance&&!finish&&principal>0) finish=month;
   schedule.push({month,payment:pay,interest,principal:principalPaid,balance,paid,interestTotal});
  }
  return {schedule,finish,interestTotal};
 }
 const actual=amortize(d.extra,d.lump,d.payoff), baseline=amortize(0,0,0);
 let value=d.price; const rows=[{month:0,value,balance:principal,odometer:d.odometer,cost:upfront+equity+principal-value,interestTotal:0,payment:0}];
 for(let month=1;month<=d.months;month++) {
  const rate=rates[Math.min(Math.floor((month-1)/12),rates.length-1)]/100;
  value*=Math.pow(1-rate,1/12);
  const s=actual.schedule[month-1];
  rows.push({...s,value,odometer:d.odometer+d.mileage*month/12,cost:upfront+equity+s.paid+s.balance-value});
 }
 // The override is an endpoint estimate: interpolate its difference from the modeled value.
 if(d.resale!=='') { const difference=Number(d.resale)-rows.at(-1).value; for(const row of rows){row.value+=difference*row.month/d.months;row.cost=upfront+equity+(row.paid||0)+row.balance-row.value;} }
 for(const row of rows) row.equity=row.value-row.balance;
 const end=rows.at(-1), miles=d.mileage*d.months/12;
 return {d,rows,schedule:actual.schedule,purchase,principal,upfront,tradeEquity:equity,payment,end,miles,costPerMile:miles?end.cost/miles:null,payoffMonth:actual.finish,interestSaved:Math.max(0,baseline.interestTotal-actual.interestTotal),totalInterest:actual.interestTotal,breakEven:rows.find(x=>x.equity>=0)?.month??null};
}
