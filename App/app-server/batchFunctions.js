export const channelBatcher = async (ids, models, user) => {
    // id  = [1,2,3,4]
    // return [team1: channels]
    const results = await models.sequelize.query(`
        select distinct on (id) * from channels as c
        left outer join pcmembers as pc 
        on c.id = pc.channel_id
        where c.team_id in (:teamIds) and (c.public = true or pc.user_id = :userId );`,
        {
            replacements: {teamIds: ids, userId: user.id },
            model: models.Channel,
            raw : true
        })

        const data = {}

        results.forEach((re) => {
            if (data[re.team_id]){
                data[re.team_id].push(re)
            }
            else{
                data[re.team_id] = [re]
            }
            
        });
        
        return ids.map(id=> data[id])
    }

export const userBatcher = async (models, user, userIds) => {
    if (user){
        return user
    }
    const results  = await models.sequelize.query(`
        select * from users 
        where id in (:userIds);`,
        {
            replacements: {userIds: userIds},
            model: models.User,
            raw : true
        })
    const data = {}
    console.log('ids',ids)
    console.log('data',data)
    results.forEach((re)=>{
        if (data[re.id]){
            data[re.id].push(re)
        }
        else{
            data[re.id] = [re]
        }
        return userIds.map((id)=>data[id])
    })

}