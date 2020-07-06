import React from 'react'
import {Form,Input,Button, Modal} from 'semantic-ui-react'
import {withFormik} from 'formik'
import gql from 'graphql-tag'
import {compose, graphql} from 'react-apollo'
import normalizeErrors from '../normalizeErrors'

const InvitePeopleModal = ({ 
    open,
    onClose,
    values,
    handleChange,
    handleBlur,
    handleSubmit,isSubmitting,
    touched,
    errors })=> (
    <Modal open={open} onClose= {onClose}>

        <Modal.Header>Add People to your Team</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field>
                <Input 
                 value={values.name} onChange={handleChange}
                 name="email"
                 onBlur = {handleBlur}
                 fluid placeholder="User's Email"></Input>
            
                </Form.Field>
                {touched.email && errors.email ? errors.email[0]: null}
                <Form.Group widths='equal'>
                    
                    <Button disabled={isSubmitting} onClick={onClose} fluid>Cancel</Button>
                    <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Add User </Button>
                
                </Form.Group>
            </Form>
            
        </Modal.Content>
    </Modal>
)

const addTeamMemberMutation = gql`
    mutation($teamId: Int!, $email: String!){
        addTeamMember(teamId:$teamId, email:$email){
            ok
            errors{
                path
                message
            }
        }
    }

`

export default compose(
    graphql(addTeamMemberMutation),
    withFormik({
        mapPropsToValues: () => ({email:''}),
        handleSubmit: async(
            values,
            {props:{onClose,teamId,mutate},setSubmitting,setErrors })=> {
            

        // teamId is from sidebar mutate is from higer order func
        let teamInt = parseInt(teamId,10)
        
        const response = await mutate({
            variables : {teamId: teamInt,email:values.email},
            
        })
        const {ok,errors} = response.data.addTeamMember;
        console.log('errors from invitePeople',response)
        if (ok){
            onClose()
            setSubmitting (false)
        }else{
            setSubmitting(false)
            setErrors(normalizeErrors(errors))
        }
        
        
    }
})
)(InvitePeopleModal)