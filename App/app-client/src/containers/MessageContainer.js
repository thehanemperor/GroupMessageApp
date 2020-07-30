import  React from 'react'
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import {Comment } from 'semantic-ui-react'
import FileUpload from '../components/FileUpload'
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
const fileStyle = {
    gridColumn: '3',
    gridRow: '2',
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'flex',
    flexDirection: 'column-reverse',
    overflowY:'auto',
}

const Message = ({message:{url,text,filetype}})=>{
    if (url){
        if (filetype.startsWith('image/')){
            return (<img className="ui medium rounded image" src={url} alt={url}></img>)
        } else if (filetype.startsWith('audio/')){
            return(
                <audio controls>
                    <source src={url} type={filetype}></source>
                </audio>
            )
        }
        
    }
    
    return (<Comment.Text>{text} </Comment.Text>)
}

class MessageContainer extends React.Component{
    state =  {
        hasMoreItems: true
    }
    componentWillMount(){
        this.unsubscribe = this.subscribe(this.props.channelId);
    }

    // subscribe when switch props

    componentWillReceiveProps({ data: { messages }, channelId }){
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
                    this.scroller.scrolltop = this.scroller.scrollHeight - heightBefore
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
            <div 
                style={fileStyle}
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
                        <Comment key={`${m.id}-message`}>
                            <Comment.Content>
                                <Comment.Author as= "a">{m.user.username}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{m.created_at}</div>
                                </Comment.Metadata>
                                <Message message={m}></Message>
                                <Comment.Actions>
                                    <Comment.Action>Reply</Comment.Action>
                                </Comment.Actions>
                            </Comment.Content>

                        </Comment>
                    ))}
                </Comment.Group>
            </FileUpload>
            </div>


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