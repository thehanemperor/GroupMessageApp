import formatErrors from '../formatErrors'
import requiresAuth from '../permissions'

export default {
    Mutation: {
        getOrCreateChannel: requiresAuth.createResolver (async (parent,{ teamId,members },{ models,user }) => {

            const member = await models.Member.findOne(
                { where: { teamId: teamId, userId: user.id}},
                { raw: true }
            )
            if (!member){
                throw new Error("Not Authenticated")
            }

            const allMembers = [...members,user.id]
            
            // check if channel already exists with these memebrs
            const [data,result] = await models.sequelize.query(`
                select c.id , c.name
                from channels as c, pcmembers pc
                where pc.channel_id = c.id and c.dm = true and c.public = false and c.team_id = ${teamId}
                group by c.id, c.name
                having array_agg(pc.user_id) @> Array[${allMembers.join(',')}] and count(pc.user_id) = ${allMembers.length}
            `, { raw: true });
            if (data.length){
                return data[0]
            }
            const users = await models.User.findAll({
                raw: true, 
                where: { 
                    id: {
                    [models.sequelize.Op.in]: members
                    }
                }
            })
            const name = users.map(u => u.username).join(',')
            const channelId = await models.sequelize.transaction(async(transaction)=>{
                const channel = await models.Channel.create({
                    name: name,
                    public: false,
                    dm: true,
                    teamId: teamId
                },
                    {transaction}
                );
                const cId = channel.dataValues.id
                await models.PCMember.bulkCreate(allMembers.map(m =>({userId: m, channelId: cId})),{transaction} )
                
                return cId
            })
            
            return {
                id:channelId,
                name: name,
            }
        }),
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

                const response =  models.sequelize.transaction(async(transaction)=>{
                    const channel = await models.Channel.create(args, { transaction });
                    if (! args.public){
                        const members = args.members.filter(m => m !== user.id)
                        members.push(user.id)
                        await models.PCMember.bulkCreate(members.map(m =>({userId: m, channelId: channel.dataValues.id})),{transaction} )
                    }
                    return channel
                })
                
                return {
                    ok:true,
                    channel: response,
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