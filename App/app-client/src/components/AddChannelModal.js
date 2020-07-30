import React from 'react'
import {Form,Input,Button, Modal,Checkbox} from 'semantic-ui-react'
import {withFormik} from 'formik'
import gql from 'graphql-tag'
import {compose, graphql} from 'react-apollo'
import { meQuery } from '../graphql/team'
import findIndex from 'lodash/findIndex'
import MultiSelectUsers from './MultiSelectUsers'

//withformik higher model passes resetForm 
const AddChannelModal = ({ 
    open, 
    onClose,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    resetForm,
    setFieldValue,  
    teamId,  
    currentUserId,
})=> (
    <Modal open={open} 
            onClose= {(e)=> {
                resetForm()
                onClose(e)}}>

        <Modal.Header>Add Channel</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field>
                <Input 
                 value={values.name} onChange={handleChange}
                 name="name"
                 onBlur = {handleBlur}
                 fluid placeholder="channelName"></Input>
            
                </Form.Field>
                <Form.Field>
                    <Checkbox 
                        checked={!values.public} 
                        label="Private" 
                        onChange={(e,{checked})=> setFieldValue('public',!checked)}
                        toggle>
                    </Checkbox>
                </Form.Field>
                {values.public ? null: ( 
                <Form.Field>
                    <MultiSelectUsers
                        //value = {values.members}
                        //handelChange = {(e,{ value }) => setFieldValue('members',value)}
                        onChange = {
                            (e,{ value }) => {
                                //console.log('on change',value)
                                setFieldValue('members',value)}}
                        placeholder="Select Members"
                        currentUserId = {currentUserId}
                        teamId = {teamId}>
                    </MultiSelectUsers>
                </Form.Field>)}
               
                <Form.Group widths='equal'>
                    
                    <Button disabled={isSubmitting} 
                            onClick={(e)=> { 
                                    resetForm()
                                    onClose(e)}} fluid>Cancel</Button>
                    <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Create Channel </Button>
                
                </Form.Group>
            </Form>
            
        </Modal.Content>
    </Modal>
)

const createChannelMutation = gql`
    mutation($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]){
        createChannel(teamId:$teamId, name:$name, public: $public, members: $members){
            ok
            channel{
                id
                name
                dm
            }
        }
    }

`

export default compose(
    graphql(createChannelMutation),
    withFormik({
    mapPropsToValues: () => ({name:'', public: true, members: []}),
    handleSubmit: async(values,{props:{onClose,teamId,mutate},setSubmitting })=> {
        

        // teamId is from sidebar mutate is from higer order func
        let teamInt = parseInt(teamId,10)
        
        console.log('is public',values.public,'members',values.members)
        await mutate({
            variables : {teamId: teamInt, name:values.name , public: values.public, members: values.members},
            optimisticResponse: {
                
                createChannel:{
                    __typename: 'Mutation',
                    ok: true,
                    channel:{
                        __typename:'Channel',
                        id: -1,
                        name: values.name,
                        dm: false,
                    }
                    
                }
            },
            update: (store,{data:{createChannel}}) => {
                const {ok,channel} = createChannel
                if (!ok){
                    return
                }

                const data = store.readQuery({query:meQuery})
                console.log('addchannelModal.js update cache data',data)

                const teamIdx = findIndex(data.me.teams,['id',teamId])
                const deepClone = JSON.parse(JSON.stringify(data));
                
                deepClone.me.teams[teamIdx].channels.push(channel);
                store.writeQuery({query: meQuery,data:deepClone})
            },
        })
        onClose()
        setSubmitting (false)
        
    }
})
)(AddChannelModal)