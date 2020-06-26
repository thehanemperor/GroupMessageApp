import React from 'react'
import {gql,graphql} from 'react-apollo'
import Channels from '../components/Channels'
import Teams from '../components/Teams'
import _ from 'lodash'
import decode from 'jwt-decode'


const Sidebar = ({data: {loading,allTeams},currentTeamId})=>{
    if(loading){
        return null;
    }

    let username = ''

    try{
        const token = localStorage.getItem('token')
        const {user} = decode(token);
        username = user.username
    }catch (err){

    }
    const teamIdx = _.findIndex(allTeams,['id',currentTeamId])
    
    const team = allTeams[teamIdx]
    return [
            <Teams key="team-sidebar" teams={allTeams.map(t=>({
                id: t.id,
                letter: t.name.charAt(0).toUpperCase(),
            }))}></Teams>,
            <Channels 
                key= "channels-sidebar"
                teamName = {team.name}
                userName = {username}
                channels = {team.channels}
                users = {[{id:1,name:'slackbot'},{id:2,name:'user1'}]}
            ></Channels>
        ]
    }
const allTeamsQuery = gql`
{
    allTeams{
        id
        name
        channels{
            id
            name
        }
    }
}
`
export default graphql(allTeamsQuery)(Sidebar);
