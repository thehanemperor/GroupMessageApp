import requireAuth, {requireTeamAccess} from '../permissions'
import { withFilter} from 'graphql-subscriptions'
import pubsub from '../pubsub'

const NEW_CHANNEL_MESSAGE ='NEW_CHANNEL_MESSAGE'

export default {
    Subscription:{
        newChannelMessage: {
            subscribe: requireTeamAccess.createResolver(withFilter(
                () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
                (payload,args) => payload.channelId === args.channelId
            ))
        }
    },

    Message: {
        user :({user,userId },args,{ models }) => {
            if (user){
                return user
            }

            return models.User.findOne({ where:{ id : userId } },{raw: true})
        }
        
    },
    Query:{
        messages: requireAuth.createResolver(async(parent,{channelId},{models})=> 
            models.Message.findAll({order: [['created_at','ASC']] , where:{channelId}},{raw: true})
           )
    },

    Mutation: {
        createMessage: requireAuth.createResolver(async (parent,{ file ,...args },{models,user}) => {
            try{
                console.log('message resolver files',file)
                const messageData = args;
                if (file){
                    messageData.filetype = file.type;
                    messageData.url = file.path
                }
                
                const message= await models.Message.create({
                    ...messageData,
                    userId : user.id
                })
                
                const asyncFetch = async () => {
                    const currentUser = await models.User.findOne({
                        where: {
                            id: user.id
                        }
                    })

                    pubsub.publish(NEW_CHANNEL_MESSAGE,
                        {
                            channelId: args.channelId,
                            newChannelMessage: {
                                ...message.dataValues,
                                user: currentUser.dataValues
                            }
                        })
                }
                asyncFetch()

                return true
            } catch(err){
                console.log(err)
                return false;
            }
            
        })
    }
}