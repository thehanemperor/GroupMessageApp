import React from 'react'
import {gql,graphql}  from 'react-apollo'

const Home = ({data:{loading,allUser}}) => 
    (loading ? null:allUser.map( u => <h1 key={u.id}>{u.email}</h1>))


const allUsersQuery = gql`
    {
        allUser{
            id
            email
        }
    }
`;

export default graphql(allUsersQuery)(Home);