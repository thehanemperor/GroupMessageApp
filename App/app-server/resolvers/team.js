import formatErrors from '../formatErrors'
import requiresAuth from '../permissions'


export default {
    Query: {
        getTeamMembers: requiresAuth.createResolver(async(parent, { teamId }, { models })=>
             
                models.sequelize.query(
                'select * from users as u join members as m on m.user_id = u.id where m.team_id = ? ',
                {
                    replacements: [teamId],
                    model: models.User,
                    raw: true,

                },
                )
               
                
            )
    },
    Mutation: {
        addTeamMember: requiresAuth.createResolver(
            async(parent,{email,teamId} ,{models,user}) =>{
                
                console.log('team.js email',email)
                try{
                    const memberPromise = await models.Member.findOne(
                        { where:{ teamId: teamId, userId: user.id } },
                        {raw: true})
                    const userToAddPromise = await models.User.findOne({where:{email}},{raw: true})
                    const [member,userToAdd] = await Promise.all([memberPromise,userToAddPromise])
                    if (!member.admin){
                        return {
                            ok: false,
                            errors: [{path:'email',message: 'You cannot add members to the team'}]
                        }
                    }
                    if (!userToAdd){
                        console.log('cannot find')
                        return {
                            ok: false,
                            errors: [{path:'email',message: 'cannot find user'}]
                        }
                    }

                    await models.Member.create({userId: userToAdd.id,teamId})
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
        //createTeam: (parent,args,{models}) => models.
        createTeam: requiresAuth.createResolver( async(parent,args ,{models,user}) =>{
            try{
                const response = await models.sequelize.transaction( async ()=>{
                    const team = await models.Team.create({...args});
                    // to increase speed we omit await
                    await models.Channel.create({name:'general',public:true, teamId: team.id})
                    await models.Member.create({teamId: team.id, userId:user.id, admin:true})
                    return team
                })
                
                return {
                    ok: true,
                    team:response
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
        channels: ({id},args,{models})=> models.Channel.findAll({where: {teamId: id}})
        
    } 
    
}