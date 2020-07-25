import React from 'react';
import {graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Dropzone from 'react-dropzone';

const FileUpload = ({children,disableClick,channelId,mutate})=>(
    <Dropzone 
        className="ignore" 
        onDrop={async ([file])=> {
                const response = await mutate({
                    variables:{
                        channelId,
                        file
                    }
                })
                console.log('upload response',response)
            }} 

        disableClick = {disableClick}>{children}
    </Dropzone>
)

const createFileMessageMutation = gql`
 
    mutation($channelId: Int!, $file: File) {
        createMessage(channelId: $channelId, file: $file)
      }
`


export default graphql(createFileMessageMutation)(FileUpload);