import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

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