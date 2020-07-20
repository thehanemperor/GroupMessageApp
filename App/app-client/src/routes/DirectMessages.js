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
    data:{ loading , me,getUser },
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
        <Header channelName = {getUser.username}></Header>
        
        <DirectMessageContainer teamId ={team.id} userId= { otherUserId }></DirectMessageContainer>
        
        <SendMessage placeholder={getUser.username} 
                    onSubmit={ async (text)=>{
                        await mutate({
                            variables: {
                                text: text,
                                receiverId: otherUserId,
                                teamId: teamIdInteger
                            },
                            optimisticResponse: {
                                createDirectMessage: true
                            },
                            update: (store) => {
                                const data= store.readQuery({ query: meQuery });
                                const teamIdx2 = findIndex(data.me.teams, ['id', team.id]);
                                
                                const notAlreadyThere = data.me.teams[teamIdx2].directMessageMembers.every(member => member.id !== parseInt(userId,10))
                                const deepClone = JSON.parse(JSON.stringify(data));
                                console.log('not exist?',notAlreadyThere)
                                if (notAlreadyThere)
                                    {
                                       
                                        deepClone.me.teams[teamIdx2].directMessageMembers.push({
                                            __typename:"User",
                                            id: userId,
                                            username: getUser.username,
                                        });

                                        store.writeQuery({ query: meQuery, data: deepClone });
                                        
                                    }

                                
                            }
                        });
                    }}></SendMessage>

    </AppLayout>)
}

const crearteDirectMessageMutation = gql`
    mutation($receiverId: Int!, $text: String!, $teamId:Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`
const directMessageMeQuery = gql`
  query ($userId : Int!) {
    getUser(userId: $userId){
        username
    }
    me{
        id
        username
        teams {
            id
            name
            admin
            directMessageMembers {
                id
                username
            }
            channels {
                id
                name
            }
        }
    }   
  }
`

export default compose( 
    graphql(crearteDirectMessageMutation),
    graphql( directMessageMeQuery, {  
        options: props => ({ 
            variables : { userId: parseInt(props.match.params.userId,10)},                            
            fetchPolicy : 'network-only' 
            })
        })
)(ViewTeam);