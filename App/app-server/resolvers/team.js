import formatErrors from '../formatErrors'
import requiresAuth from '../permissions'


export default {
    Mutation: {
        //createTeam: (parent,args,{models}) => models.
        createTeam: requiresAuth.createResolver( async(parent,args ,{models,user}) =>{
            try{
                await models.Team.create({...args,owner:user.id});
                return {
                    ok: true
                }
            }catch (err){
                console.log('resolver team.js',err);
                return {
                    ok:   false,
                    errors: formatErrors(err,models)
                    
                }
            }
        }),
       
    }
    
}