export default `
    type Team{
        owner: User!
        members: [User!]!
        channels: [Channel!]!
    }

    type CreateTeamResoponse{
        ok: Boolean!
        errors: [Error!]
    }

    type Mutation {
        createTeam(name:String!): CreateTeamResoponse!
    }
`