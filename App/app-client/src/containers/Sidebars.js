import React from 'react'
import Channels from '../components/Channels'
import Teams from '../components/Teams'
//import decode from 'jwt-decode'
import AddChannelModal from '../components/AddChannelModal'
import InvitePeopleModal  from '../components/InvitePeopleModal'
import DirectMessageModal  from '../components/DirectMessageModal'


export default class Sidebar extends React.Component{
    state = {
        openAddChannelModal: false,
        openInvitePeopleModal: false,
        openDirectMessageModal: false
    }

    toggleDirectMessageModal = (event)=> {
        if(event){
            event.preventDefault();
        }
        
        this.setState(state => ({openDirectMessageModal: !state.openDirectMessageModal}))
    }

    toggleAddChannelModal = (event)=> {
        if(event){
            event.preventDefault();
        }
        
        this.setState(state => ({openAddChannelModal: !state.openAddChannelModal}))
    }
    
    toggleInvitePeopleModal = (event)=> {
        if (event){
            event.preventDefault();
        }
        
        this.setState(state => ({openInvitePeopleModal: !state.openInvitePeopleModal}))
    }

render(){

    const {teams,team,username} = this.props;
    const {openAddChannelModal,openInvitePeopleModal,openDirectMessageModal} = this.state
    
    
    
    return [
            <Teams key="team-sidebar" teams={teams}></Teams>,
            <Channels 
                key= "channels-sidebar"
                teamName = {team.name}
                userName = {username}
                teamId= {team.id}
                channels = {team.channels}
                users = {[{id:1,name:'slackbot'},{id:2,name:'user1'}]}
                onAddChannelClick = {this.toggleAddChannelModal}
                onInvitePeopleClick = {this.toggleInvitePeopleModal}
                onDirectMessageClick= {this.toggleDirectMessageModal}
                isOwner = {team.admin}
            ></Channels>,
            <DirectMessageModal 
                teamId = {team.id}
                onClose= {this.toggleDirectMessageModal}
                open = {openDirectMessageModal} key= "sidebar-directMessage-modal">
            </DirectMessageModal>,
            <AddChannelModal 
                teamId = {team.id}
                onClose= {this.toggleAddChannelModal}
                open = {openAddChannelModal} key= "sidebar-add-channel-modal">
            </AddChannelModal>,
            <InvitePeopleModal 
            teamId = {team.id}
            onClose= {this.toggleInvitePeopleModal}
            open = {openInvitePeopleModal} key= "sidebar-invite-people-modal">
            </InvitePeopleModal>
        ]
    }
}


