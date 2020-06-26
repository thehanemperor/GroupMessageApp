import formatErrors from '../formatErrors'
import requiresAuth from '../permissions'


export default {
    Query:{
        allTeams: requiresAuth.createResolver( async(parent,args ,{models,user}) =>
         
             models.Team.findAll({owner: user.id},{raw:true})),

    },
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
       
    },
    Team: {
        channels: ({id},args,{models})=> models.Channel.findAll({teamId: id})
        
    } 
    
}