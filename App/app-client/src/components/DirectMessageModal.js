import React from 'react'
import { Form, Button, Modal} from 'semantic-ui-react'
import { graphql,compose } from 'react-apollo'
import {withRouter} from 'react-router-dom'
import {withFormik } from 'formik'
import MultiSelectUsers from './MultiSelectUsers'
import gql from 'graphql-tag'
import { meQuery } from '../graphql/team'
import findIndex from 'lodash/findIndex'

const DirecMessageModal = ({ 
    open, 
    onClose,
    values,
    handleSubmit,
    isSubmitting,
    resetForm,
    setFieldValue,  
    teamId,  
    currentUserId,
    })=> (
    <Modal open={open} onClose= {onClose}>

        <Modal.Header>Direct Message</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field>
                    <MultiSelectUsers
                        //value = {values.members}
                        //handelChange = {(e,{ value }) => setFieldValue('members',value)}
                        onChange = {
                            (e,{ value }) => {
                                //console.log('on change',value)
                                setFieldValue('members',value)}}
                        placeholder="Select Members to DM"
                        currentUserId = {currentUserId}
                        teamId = {teamId}>
                    </MultiSelectUsers>
                    
                </Form.Field>
                <Form.Group>
                    <Button 
                        disabled={isSubmitting} 
                        onClick={(e)=> {
                            resetForm()
                            onClose(e)
                        }} 
                        fluid
                        >Cancel</Button>
                    <Button disabled={ isSubmitting } onClick={handleSubmit} fluid>Start Messaging</Button>
                </Form.Group>
                
                
            </Form>
            
        </Modal.Content>
    </Modal>
)


const getOrCreateChannel = gql`
    mutation($teamId:Int!, $members: [Int!]!){
        getOrCreateChannel(teamId: $teamId, members: $members){
            id
            name
        }
    }
`;
export default compose(
    withRouter,
    graphql(getOrCreateChannel),
    withFormik({
        mapPropsToValues: () => ({ members: []}),
        handleSubmit: async({ members },{ props : { history, onClose, teamId, mutate }, setSubmitting,resetForm })=> {
            const response = await mutate({ 
                variables: { members, teamId},
                update:(store, {data: { getOrCreateChannel }})=>{
                        const { id,name }= getOrCreateChannel
                        const data = store.readQuery({ query: meQuery });
                        const teamIdx = findIndex(data.me.teams,['id',teamId])
                        const deepClone = JSON.parse(JSON.stringify(data));
                        const notInChannelList = deepClone.me.teams[teamIdx].channels.every(c => c.id !== id)
                        console.log('dmModal deepclone',deepClone,'teamidx',teamIdx,id,name,)
                        if (notInChannelList){
                            
                            deepClone.me.teams[teamIdx].channels.push({
                                __typename: 'Channel',
                                id:id, name:name,dm:true });
                            store.writeQuery({query: meQuery,data:deepClone})
                            }
                        history.push(`/view-team/${teamId}/${id}`)
                    },
            })
            
        }
    }),
    )(DirecMessageModal)


    