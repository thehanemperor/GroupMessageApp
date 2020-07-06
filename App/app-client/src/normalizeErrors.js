// [{path: '',message: ''}]

export default  errors => 
    errors.reduce((acc,currentValue)=>{
        if (currentValue.path in acc){
            acc[currentValue.path].push(currentValue.message)
        }else{
            acc[currentValue.path] = [currentValue.message];
        }
        
    return acc;
}, {})