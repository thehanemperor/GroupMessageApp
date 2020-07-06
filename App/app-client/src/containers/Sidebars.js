import React from 'react'
import Channels from '../components/Channels'
import Teams from '../components/Teams'
import decode from 'jwt-decode'
import AddChannelModal from '../components/AddChannelModal'
import InvitePeopleModal  from '../components/InvitePeopleModal'


export default class Sidebar extends React.Component{
    state = {
        openAddChannelModal: false,
        openInvitePeopleModal: false

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

    const {teams,team} = this.props;
    const {openAddChannelModal,openInvitePeopleModal} = this.state
    let username = ''
    let isOwner = false

    try{
        const token = localStorage.getItem('token')
        const {user} = decode(token);
        username = user.username
        isOwner = user.id === team.owner
    }catch (err){

    }
    
    
    
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
                isOwner = {isOwner}
            ></Channels>,
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


