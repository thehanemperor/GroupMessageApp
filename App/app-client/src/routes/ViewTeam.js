import React from 'react'
import gql from 'graphql-tag'
import {Redirect} from 'react-router-dom'
import Header from '../components/Header'
import SendMessage from '../components/SendMessage'
import AppLayout from '../components/AppLayout'
import Sidebar from '../containers/Sidebars'
import { compose,graphql } from 'react-apollo'
import { meQuery } from '../graphql/team'
import findIndex from 'lodash/findIndex'
import MessageContainer from '../containers/MessageContainer'

const ViewTeam= ({ 
    mutate,
    data:{ loading , me },
    match:{ params: { teamId , channelId } }
})=> {
    if (loading || !me ){
        return null
    }
    
    // if (!inviteTeams && !allTeams){
    //     var teams = allTeams
    // }else{
    //     var teams = [...allTeams, ...inviteTeams]
    // }
    const {id:currentUserId, username,teams} = me
    
    
    if (!teams.length){
        return (<Redirect to="/create-team"></Redirect>)
    }
    const teamIdInteger = parseInt(teamId,10);
    const channelIdInteger = parseInt(channelId,10)
    

    const teamIdx = teamIdInteger ? findIndex(teams,['id',teamIdInteger]):0;
    const team = teamIdx=== -1 ? teams[0]: teams[teamIdx]

    const channelIdx = channelIdInteger? findIndex(team.channels,['id',channelIdInteger]):0;
    const channel = channelIdx === -1?  team.channels[0]: team.channels[channelIdx]
    
    return (
    <AppLayout>
        <Sidebar 
            teams={teams.map(t=>({
                    id: t.id,
                    letter: t.name.charAt(0).toUpperCase(),
                }))} 
            team= {team} 
            username= {username}
            currentUserId = {currentUserId}
            ></Sidebar>
        {channel && <Header channelName = {channel.name}></Header>}
        {channel && (
            <MessageContainer channelId = {channel.id}></MessageContainer>
        )}
        {channel && <SendMessage 
                        channelId = {channel.id}
                        placeholder={channel.name} 
                        onSubmit= { async(text)=>{
                            await mutate({variables: { text, channelId: channel.id}})
                        }} >
                    </SendMessage>}

    </AppLayout>)
}

const crearteMessageMutation = gql`
    mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`
export default compose(
    graphql( meQuery, { options: { fetchPolicy: 'network-only' } }),
    graphql(crearteMessageMutation)         
)(ViewTeam);