import React from 'react'
import {Form,Input,Button, Modal} from 'semantic-ui-react'
import {withFormik} from 'formik'
import gql from 'graphql-tag'
import {compose, graphql} from 'react-apollo'
import {allTeamsQuery} from '../graphql/team'
import findIndex from 'lodash/findIndex'

const AddChannelModal = ({ open, onClose,values,handleChange,handleBlur,handleSubmit,isSubmitting })=> (
    <Modal open={open} onClose= {onClose}>

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
                <Form.Group widths='equal'>
                    
                    <Button disabled={isSubmitting} onClick={onClose} fluid>Cancel</Button>
                    <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Create Channel </Button>
                
                </Form.Group>
            </Form>
            
        </Modal.Content>
    </Modal>
)

const createChannelMutation = gql`
    mutation($teamId: Int!, $name: String!){
        createChannel(teamId:$teamId, name:$name){
            ok
            channel{
                id
                name
            }
        }
    }

`

export default compose(
    graphql(createChannelMutation),
    withFormik({
    mapPropsToValues: () => ({name:''}),
    handleSubmit: async(values,{props:{onClose,teamId,mutate},setSubmitting })=> {
        

        // teamId is from sidebar mutate is from higer order func
        let teamInt = parseInt(teamId,10)
        console.log('add channel teamId',teamInt,typeof(teamInt))
        
        await mutate({
            variables : {teamId: teamInt,name:values.name},
            // optimisticResponse: {
                
            //     createChannel:{
            //         __typename: 'Mutation',
            //         ok: true,
            //         channel:{
            //             __typename:'Channel',
            //             id: -1,
            //             name: values.name
            //         }
                    
            //     }
            // },
            update: (store,{data:{createChannel}}) => {
                const {ok,channel} = createChannel
                if (!ok){
                    return
                }

                const data = store.readQuery({query:allTeamsQuery})
                console.log('addchannelModal.js update cache data',data)

                const teamIdx = findIndex(data.allTeams,['id',teamId])
                const deepClone = JSON.parse(JSON.stringify(data));
                
                deepClone.allTeams[teamIdx].channels.push(channel);
                store.writeQuery({query: allTeamsQuery,data:deepClone})
            },
        })
        onClose()
        setSubmitting (false)
        
    }
})
)(AddChannelModal)