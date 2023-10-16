export const range = n => new Array(n).fill(null).map((_,i)=>i);
export const rangeFromTo = (min:number,max:number) => new Array(~~( max-min ) ).fill(null).map( (_,i) => ~~min + i );