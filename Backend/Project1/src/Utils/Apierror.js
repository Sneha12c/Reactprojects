class Apierror extends Error{
    constructor(
      statusCode ,
      message ="",
      errors = [],
      statck = ""
    ){
      super(message);
      this.statusCode = statusCode
      this.data = null  // Placeholder for any extra data related to the error (default: null)
      this.message = message
      this.success = false,
      this.errors = errors
      
      if(statck){
        this.stack = statck
      }
      else{
        Error.captureStackTrace(this , this.constructor)
      }
    }
}

export {Apierror};
