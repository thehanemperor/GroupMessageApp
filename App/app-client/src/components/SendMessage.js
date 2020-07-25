import React from 'react'
import styled from 'styled-components'
import {withFormik} from 'formik'
import {Input,Button, Icon} from 'semantic-ui-react'
import FileUpload from './FileUpload'

const SendMessageWrapper= styled.div `

    grid-column: 3;
    padding: 20px;
    display: grid;
    grid-template-columns: 5% auto;
    
    
`
const ENTER_KEY = 13
const SendMessage= ({
    placeholder,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    channelId
    })=>(
    <SendMessageWrapper>
        <FileUpload channelId={channelId}>
        <Button icon>
            <Icon name="plus"></Icon>
        </Button>
        </FileUpload>
        <Input 
            name="message" 
            onKeyDown = {
                (e)=>{
                    if (e.keyCode === ENTER_KEY && !isSubmitting){
                        handleSubmit(e)
                    }
                }}
        value = {values.message} onChange={handleChange} onBlur={handleBlur}  placeholder={`Message # ${placeholder}`}></Input>

    </SendMessageWrapper>
)



export default 
    withFormik({
    mapPropsToValues: () => ({ message :''}),
    handleSubmit: async(values,{ props:{ onSubmit },setSubmitting , resetForm})=> {
        
        if (!values.message || !values.message.trim()){
            setSubmitting(false)
            return
        }
        await onSubmit(values.message);
        resetForm(false) 
    
    }
})(SendMessage)