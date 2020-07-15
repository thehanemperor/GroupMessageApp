import React from 'react'
import gql from 'graphql-tag'
import {Redirect} from 'react-router-dom'
import Header from '../components/Header'
import SendMessage from '../components/SendMessage'
import AppLayout from '../components/AppLayout'
import Sidebar from '../containers/Sidebars'
import { compose, graphql } from 'react-apollo'
import { meQuery } from '../graphql/team'
import findIndex from 'lodash/findIndex'
import DirectMessageContainer from '../containers/DirectMessageContainer'

const ViewTeam= ({ 
    mutate,
    data:{ loading , me },
    match:{ params: { teamId , userId } }
})=> {
    if (loading){
        return null
    }
    
    // if (!inviteTeams && !allTeams){
    //     var teams = allTeams
    // }else{
    //     var teams = [...allTeams, ...inviteTeams]
    // }

    const {username,teams} = me
    
    
    if (!teams.length){
        return (<Redirect to="/create-team"></Redirect>)
    }
    const teamIdInteger = parseInt(teamId,10);    
    const teamIdx = teamIdInteger ? findIndex(teams,['id',teamIdInteger]):0;
    const team = teamIdx=== -1 ? teams[0]: teams[teamIdx]

    const otherUserId = parseInt(userId,10)
    return (
    <AppLayout>
        <Sidebar teams={teams.map(t=>({
                id: t.id,
                letter: t.name.charAt(0).toUpperCase(),
            }))} team= {team} username= {username}></Sidebar>
        <Header channelName = {"Someone's Username"}></Header>
        
        <DirectMessageContainer teamId ={teamIdInteger} otherUserId= { otherUserId }></DirectMessageContainer>
        
        <SendMessage placeholder={userId} 
                    onSubmit={ async (text)=>{
                        await mutate({
                            variables: {
                                text: text,
                                receiverId: otherUserId,
                                teamId: teamIdInteger
                            }
                        })
                    }}></SendMessage>

    </AppLayout>)
}

const crearteDirectMessageMutation = gql`
    mutation($receiverId: Int!, $text: String!, $teamId:Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`

export default compose( 
    graphql(crearteDirectMessageMutation),
    graphql( meQuery, { options: { fetchPolicy: 'network-only' } })
)(ViewTeam);