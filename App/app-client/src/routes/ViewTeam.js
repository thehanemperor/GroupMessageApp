import React from 'react'

import Channels from '../components/Channels'
import Teams from '../components/Teams'
import Header from '../components/Header'
import Messages from '../components/Messages'
import SendMessage from '../components/SendMessage'
import AppLayout from '../components/AppLayout'


export default ()=> (
    <AppLayout>
        <Teams teams={[{id:1,letter:'T'},{id:2,letter:'Q'}]}></Teams>
        <Channels 
            teamName = "Team name"
            userName = "User name"
            channels = {[{id:1,name:'general'},{id:2,name:'random'}]}
            users = {[{id:1,name:'slackbot'},{id:2,name:'user1'}]}
        ></Channels>
        <Header channelName = "general"></Header>
        <Messages>
            <ul class="message-list">
                <li></li>
                <li></li>
            </ul>

        </Messages>
        <SendMessage channelName="genearl"></SendMessage>

    </AppLayout>
)