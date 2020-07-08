import React from 'react'

import {Redirect} from 'react-router-dom'
import Header from '../components/Header'
import SendMessage from '../components/SendMessage'
import AppLayout from '../components/AppLayout'
import Sidebar from '../containers/Sidebars'
import { graphql } from 'react-apollo'
import { allTeamsQuery } from '../graphql/team'
import findIndex from 'lodash/findIndex'
import MessageContainer from '../containers/MessageContainer'

const ViewTeam= ({data:{loading,allTeams,inviteTeams},match:{params:{teamId,channelId}}})=> {
    if (loading){
        return null
    }
    
    // if (!inviteTeams && !allTeams){
    //     var teams = allTeams
    // }else{
    //     var teams = [...allTeams, ...inviteTeams]
    // }

    const teams = [...allTeams,...inviteTeams]
    
    
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
        <Sidebar teams={teams.map(t=>({
                id: t.id,
                letter: t.name.charAt(0).toUpperCase(),
            }))} team= {team}></Sidebar>
        {channel && <Header channelName = {channel.name}></Header>}
        {channel && (
            <MessageContainer channelId = {channel.id}></MessageContainer>
        )}
        {channel && <SendMessage channelName={channel.name} channelId={channel.id}></SendMessage>}

    </AppLayout>)
}

export default graphql(allTeamsQuery)(ViewTeam);