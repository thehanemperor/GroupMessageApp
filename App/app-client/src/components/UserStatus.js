import React from 'react'
import {  Image } from 'semantic-ui-react'
import styled from 'styled-components'

const UserWrapper = styled.div`
    height: auto;
	width: inherit;
	grid-column: 2;
    grid-row: 3 / 4;
    margin-left:20px;
	flex-direction: column;
	
    `

export default ({userName})=>(
    <UserWrapper>
        <div>
            <Image src="http://localhost:8080/files/avatar/2.jpg" avatar />
            <span> {userName}</span>
        </div>
    </UserWrapper>
)