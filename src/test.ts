
/**
    const data = {
      foo : 0,
      poo : false,
    }

    const dic = ( Object.keys( data ) as (keyof typeof data)[] ).map( (key) => {
      return {
        [`_` + key]: data[key],
        get [key]() { 
          return this[`_` + key];
        },
        set [key](value) {
          this[`_` + key] = value;
          console.log(`update`, value)
        }
      }
    })
    console.log( { ...dic[0], ...dic[1] } )
    dic[0].foo = 999;
    
    const o = Object.keys( data ).reduce( (prev,key) => ({ 
      ...prev,
      ...{
        [`_` + key]: data[key],
        get [key]() { 
          return this[`_` + key];
        },
        set [key](value) {
          this[`_` + key] = value;
          console.log(`update`, value)
        }
      },
    }), {} ) as typeof data;
    o.foo = 99;
    console.log( data, o )

/** */