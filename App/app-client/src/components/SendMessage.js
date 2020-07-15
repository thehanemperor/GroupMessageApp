import React from 'react'
import styled from 'styled-components'
import {withFormik} from 'formik'
import {Input} from 'semantic-ui-react'

const SendMessageWrapper= styled.div `

    grid-column: 3;
    grid-row: 3;
    margin: 20px;
    padding: 20px;
    
`
const ENTER_KEY = 13
const SendMessage= ({
    placeholder,
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
        value = {values.message} onChange={handleChange} onBlur={handleBlur} fluid placeholder={`Message # ${placeholder}`}></Input>

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