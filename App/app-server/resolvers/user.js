
import {tryLogin} from '../auth'
import formatErrors from '../formatErrors'



export default{
    Query:{
        getUser: (parent,{id},{models}) => models.User.findOne({where:{id}}),
        allUser: (parent,args,{models}) => models.User.findAll()
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