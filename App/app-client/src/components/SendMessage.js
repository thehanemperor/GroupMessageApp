import React from 'react'
import styled from 'styled-components'
import {withFormik} from 'formik'
import {Input} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {compose,graphql} from 'react-apollo'

const SendMessageWrapper= styled.div `

    grid-column: 3;
    grid-row: 3;
    margin: 20px;
    padding: 20px;
    
`
const ENTER_KEY = 13
const SendMessage= ({
    channelName,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting 
    })=>(
    <SendMessageWrapper>
        <Input 
            name="message" 
            onKeyDown = {
                (e)=>{
                    if (e.keyCode === ENTER_KEY && !isSubmitting){
                        handleSubmit(e)
                    }
                }}
        value = {values.message} onChange={handleChange} onBlur={handleBlur} fluid placeholder={`Message # ${channelName}`}></Input>

    </SendMessageWrapper>
)

const crearteMessageMutation = gql`
    mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`

export default compose( 
    graphql(crearteMessageMutation),
    withFormik({
    mapPropsToValues: () => ({ message :''}),
    handleSubmit: async(values,{props:{channelId,mutate},setSubmitting , resetForm})=> {
        console.log(values.message)
        if (!values.message || !values.message.trim()){
            setSubmitting(false)
        }
    
    await mutate({
        variables : {channelId: channelId,text:values.message},
        
        
    })
    setSubmitting (false)
    resetForm(false) 
    
    }
}))(SendMessage)