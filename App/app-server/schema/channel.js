export default `
    type Channel{
        id: Int!
        name: String!
        message: [Message!]!
        public: Boolean!
        users: [User!]!
        
    }
    
    type ChannelResponse{
        ok: Boolean!
        channel: Channel
        errors: [Error!]
    }

    type Mutation{
        createChannel(teamId: Int!,name:String!,public:Boolean = false) : ChannelResponse!
    }
`