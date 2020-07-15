import formatErrors from '../formatErrors'
import requiresAuth from '../permissions'

export default {
    Mutation: {
        createChannel: requiresAuth.createResolver (async (parent,args,{models,user}) => {
            try{
                const member = await models.Member.findOne(
                    { where: { teamId: args.teamId, userId: user.id } },
                    {raw: true})
                if (!member.admin){
                    return {
                        ok: false,
                        errors:[
                            {
                                path:'name',
                                message: 'you have to be the owner of the team'
                            }
                        ]
                    }
                }
                const channel = await models.Channel.create(args);
                return {
                    ok:true,
                    channel
                };
            }catch (err){
                return {
                   ok: false,
                   errors: formatErrors(err,models)
                }
            }
        })
    }
}