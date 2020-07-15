
import {tryLogin} from '../auth'
import formatErrors from '../formatErrors'
import requiresAuth from '../permissions'


export default{
    User: {
        teams: (parent,args,{ models, user }) =>
            models.sequelize.query("select * from teams as team join members as member on team.id = member.team_id where  member.user_id = ?",
                {   
                    replacements: [user.id],
                    model: models.Team,
                    raw: true,
                })
    },
    Query:{
        me:  requiresAuth.createResolver((parent,args,{models,user}) =>
           models.User.findOne({where:{ id:user.id }})) ,
        allUser: (parent,args,{models}) => models.User.findAll(),

    },
    Mutation: {
        login: (parent,{email,password},{models,SECRET,SECRET2}) => 
            tryLogin(email,password,models,SECRET,SECRET2),


        register: async (parent,args,{models}) =>{
            // Store hash
            
            try{
                
                //const hasedPassword = await bcrypt.hash(password, 12);
                console.log('/resovers/user.js args',args)
                const user = await models.User.create(args);
                
                return {
                    ok: true,
                    user,
                } 

            }catch (err){
                console.log('err in /resovers/user.js',err)
                return {
                    ok: false,
                    errors: formatErrors(err,models),
                }
            }
        },
    }
    
}