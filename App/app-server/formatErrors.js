import _ from 'lodash'
export default  (e,models) => {
    //console.log(models.sequelize.SequelizeValidationError)
    
    if (e instanceof models.sequelize.ValidationError){
        return e.errors.map(x => _.pick(x,['path','message']));
    }
    
    return [{path:'name',message:e.message}]
};
