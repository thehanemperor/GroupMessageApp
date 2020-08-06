import React from 'react'
import {Button,Container,Header} from 'semantic-ui-react';

class Test extends React.Component{
    
    render(){
        return(
            <Container style={{paddingTop: '125px'}}>
                <Container >
                <video width="800" height="500" controls>
                    
                    <source src={`http://192.168.1.10:8080/files/videos\\1.mp4`} type={'video/mp4'} />
                </video>
                </Container>
                <br/>
                <br/>
               
                <Header as="h2" >
                    午夜付费直播-- 主播SWT  --TT
                </Header>
                <Button>Bitch<span role="img" aria-label="sheep">🔞</span></Button>
            </Container>
        )
    } 
}

export default Test