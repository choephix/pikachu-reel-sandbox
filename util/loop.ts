export const loop = ( value:number, min:number, max:number ) => {
  if ( min >= max ) {
    return min;
  }
  while ( value < min ) {
    value += max - min;
  }
  while ( value >= max ) {
    value -= max - min;
  }
  return value;
}