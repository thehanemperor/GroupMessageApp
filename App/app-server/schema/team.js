export default `
    type Team{
        id:Int!
        name: String!
        owner: User!
        members: [User!]!
        channels: [Channel!]!
    }

    type CreateTeamResoponse{
        ok: Boolean!
        errors: [Error!]
    }

    type Query{
        allTeams: [Team!]!
    }

    type Mutation {
        createTeam(name:String!): CreateTeamResoponse!
    }
`