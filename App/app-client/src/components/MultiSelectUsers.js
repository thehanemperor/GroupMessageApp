import React from 'react'
import {getTeamMembersQuery} from '../graphql/team';
import {Dropdown} from 'semantic-ui-react'
import { graphql } from 'react-apollo';

const MultiSelectUsers = ({
    data: { loading, getTeamMembers=[] }, 
    currentUserId,
    onChange,
    placeholder,
})=> 
    ( loading ? null :(
        <Dropdown
            //value={value}
            //onChange={handleChange}
            
            onChange = {onChange}
            placeholder={placeholder}
            fluid
            multiple
            search
            selection
            options= {getTeamMembers
                .filter(tm=>tm.id !== currentUserId)
                .map(tm => ({ key: tm.id, value: tm.id, text: tm.username}))}
        ></Dropdown>
    ))


    export default graphql(getTeamMembersQuery, {
    options: ({ teamId }) => ({ variables: { teamId } }),
    })(MultiSelectUsers);
