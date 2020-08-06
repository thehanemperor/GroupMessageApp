import  React from 'react'
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import {Comment } from 'semantic-ui-react'
import FileUpload from '../components/FileUpload'
import styled from "styled-components";
import {VideoMessage,AudioMessage,ImageMessage,NormalMessage} from './MessageType'
import MessageStyle  from './MessageStyle'

const newChannelMessageSubscription = gql`
    subscription($channelId: Int!){
        newChannelMessage(channelId: $channelId){
            id
            text
            user{
                username
            }
            url
            filetype
            created_at
        }
    }
` 
const StyledIcon = styled.img`
  border-radius: 50%;
  margin-right: 10px;
`;

// const fileStyle = {
//     gridColumn: '3',
//     gridRow: '2',
//     paddingLeft: '20px',
//     paddingRight: '20px',
//     display: 'flex',
//     flexDirection: 'column-reverse',
//     overflowY:'auto',
// }

const StyledDate = styled.span`
  @media (max-width: 768px) {
    display: none !important;
  }
`;

const ToISODate = ({time})=>{
    
    let digit = parseInt(time,10)
    //console.log('timestring',time,typeof(time) ,digit)
    const standardDate =  new Date(digit).toISOString()
    return    <StyledDate>{standardDate}</StyledDate>
}

const Message = ({message:{url,text,filetype}})=>{
    if (url){
        if (filetype.startsWith('image/')){
            
            return (<ImageMessage url={url} alt={url}></ImageMessage>)
        } else if (filetype.startsWith('audio/')){
            return(
                <AudioMessage url={url} filetype={filetype} />
            )
        } else if (filetype.startsWith("video/")) {
            return <VideoMessage url={url} filetype={filetype} />;
        }
        
    }
    
    return (<NormalMessage text={text} />)
}

class MessageContainer extends React.Component{
    state =  {
        hasMoreItems: true
    }
    UNSAFE_componentWillMount(){
    //componentDidMount(){
        this.unsubscribe = this.subscribe(this.props.channelId);
    }

    // subscribe when switch props

    UNSAFE_componentWillReceiveProps({ data: { messages }, channelId }){
    //componentDidUpdate({data: { messages }, channelId }) {
        if (this.props.channelId !== channelId){
            console.log('different channel')
            if (this.unsubscribe){
                this.unsubscribe()
            }
            this.unsubscribe= this.subscribe(channelId)
        }

        if (
            this.scroller &&
            // fetch when reached top ( === 0)
            this.scroller.scrollTop === 0 &&
            this.props.data.messages &&
            messages &&
            this.props.data.messages.length !== messages.length)
            {
                //30 messages
                const heightBefore = this.scroller.scrollHeight
                setTimeout(()=>{
                    if (this.scroller){
                        this.scroller.scrolltop = this.scroller.scrollHeight - heightBefore
                    }

                }, 120)
        }

    }

    componentWillUnmount(){
        if (this.unsubscribe){
            this.unsubscribe()
        }
    }

    subscribe = (channelId)=>
        this.props.data.subscribeToMore({
            document: newChannelMessageSubscription,
            variables:{
                channelId: channelId
            },
            updateQuery: (prev,{ subscriptionData })=> {
                if (!subscriptionData){
                    return prev
                }
                return {
                    ...prev,
                    messages: [subscriptionData.newChannelMessage,...prev.messages,]
                }
            }
        })
    
    handleScroll = ()=>{
        const {data:{messages,fetchMore },channelId} = this.props
        if (this.scroller && this.scroller.scrollTop === 0 && this.state.hasMoreItems && messages.length >= 30 ){
            console.log(this.scroller.scrollTop,'reached top' )
            console.log(messages,messages[messages.length -1].created_at,typeof(messages[messages.length -1].created_at))
            const timeStamp = parseInt(messages[messages.length -1].created_at,10)             
            const toISO = new Date(timeStamp).toISOString()
            fetchMore({
                
                variables:{
                    channelId: channelId,
                    cursor: toISO,
                },
                updateQuery: (previousResult, { fetchMoreResult})=> {
                    console.log('fetchMore',fetchMoreResult)
                    if (!fetchMoreResult){
                        return previousResult
                    }
                    if (fetchMoreResult.messages.length < 30){
                        this.setState({ hasMoreItems: false})
                    }
                    return {
                        ...previousResult,
                        messages: [...previousResult.messages, ...fetchMoreResult.messages]
                    }
                }
            })
        }
    }

    render(){
         const {data:{loading,messages },channelId} = this.props
         return loading ? null : (
            <MessageStyle
                //style={fileStyle}
                onScroll = { this.handleScroll }
                ref = {(scroller) =>{
                    this.scroller = scroller
                }}>
            <FileUpload style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                }} 
                channelId={channelId} 
                disableClick>
                <Comment.Group>
                    
                    {[...messages].reverse().map(m=> (
                        <Comment 
                            key={`${m.id}-message`}
                            style={{
                            padding: "15px 1rem",
                            marginTop: "10px",
                            //fontFamily: "AvenirNext, sans-serif",
                            fontSize: "16px",
                        }}>
                            <Comment.Content 
                                style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                }}>
                                <StyledIcon
                                className="ui mini image"
                                src={`http://localhost:8080/files/avatar/${m.id % 4}.jpg`}
                                />
                                <div>
                                <Comment.Author as= "a">
                                    <span
                                    style={{
                                        //fontFamily: "AvenirNextDemi, sans-serif",
                                        fontSize: "15px",
                                    }}
                                    >
                                    {m.user.username}
                                    </span>
                                </Comment.Author>
                                <Comment.Metadata>
                                   <ToISODate time={m.created_at}></ToISODate> 
                                </Comment.Metadata>
                                <br></br>
                                <Message message={m}></Message>
                                <Comment.Actions>
                                    <Comment.Action>Reply</Comment.Action>
                                </Comment.Actions>
                                </div>
                            </Comment.Content>

                        </Comment>
                    ))}
                </Comment.Group>
            </FileUpload>
            </MessageStyle>


);
}}

const messagesQuery = gql `
    query($cursor: String, $channelId: Int!){
        messages(cursor:$cursor channelId: $channelId){
            id
            text
            user{
                username
            }
            url
            filetype
            created_at
        }
    }
`

export default graphql(messagesQuery,{
    
    options: props => ({
        fetchPolicy: 'network-only',
        variables:  {
            channelId: props.channelId,
            
        },
    })
})( MessageContainer)