

// shorten ethereum address
export const shortenAddress = (address: string) => {
  return address.substring(0, 6) + "..." + address.substring(38);
}
export const shortenHash = (hash: string) => {
  return hash.substring(0, 6) + "..." + hash.substring(60);
}


export const formatError = (error: any):string => {
  let _err = error;
  if (_err.errors){
    _err = _err.errors;
  }
  if (typeof _err === 'string'){
    return _err;
  }
  if (_err){
    return _err.map((e:any) =>{
      if (e.param){
        return `${e.param} ${e.msg}`
      }
      if (e.msg){
        return e.msg
      }
      return e + ""
    }).join(', ');
  }
  return error.message || error + "";
}