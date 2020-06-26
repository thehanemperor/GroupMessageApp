import React from 'react'


import Header from '../components/Header'
import Messages from '../components/Messages'
import SendMessage from '../components/SendMessage'
import AppLayout from '../components/AppLayout'
import Sidebar from '../containers/Sidebars'

export default ()=> (
    <AppLayout>
        <Sidebar currentTeamId={1}></Sidebar>
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