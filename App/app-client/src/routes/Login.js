import React from 'react'
import {observer} from 'mobx-react'
import {extendObservable} from 'mobx'
import {Message,Form,Button, Input,Container,Header} from 'semantic-ui-react';
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import { wsLink } from '../apollo'

class Login extends React.Component {
    constructor(props){
        super(props);

        extendObservable(this,{
            email: '',
            password: '',
            errors: {

            }
        });
    };

    onSubmit =async () => {
        const {email,password} = this;
        console.log(email,password)
        const response = await this.props.mutate({
            variables:{email,password}
        })

        

        const { ok, token, refreshToken,errors} = response.data.login;

        if (ok){
            localStorage.setItem('token',token);
            localStorage.setItem('refreshToken',refreshToken)
            wsLink.subscriptionClient.tryReconnect()
            console.log('ok',localStorage) 
            this.props.history.push('/view-team')
        }else{
            const err = {}
            errors.forEach(({path,message}) => {
                err[`${path}Error`] = message
                
            });
            this.errors = err
        }
    }

    onChange = e=> {
        const {name,value} = e.target;
        this[name]= value
    }

    render(){
        const {email,password,errors:{emailError,passwordError}} = this;
        const errorList = []
        if (emailError){
            errorList.push(emailError)
        }

        if(passwordError){
            errorList.push(passwordError)
        }

        return(

            <Container text>
            <Header as='h2'>Login</Header>
            
            <Form>
                <Form.Field error={!!emailError}>
                    <Input 
                    
                        name="email" 
                        onChange={this.onChange} 
                        value = {email} 
                        placeholder = "Email" 
                        fluid>

                    </Input>
                </Form.Field>


                <Form.Field error={!!passwordError}>
                    <Input 
                    
                        name="password" 
                        onChange={this.onChange} 
                        value = {password} 
                        type="password" 
                        placeholder = "Password" 
                        fluid>

                    </Input>
                    
                </Form.Field>


                <Button onClick={this.onSubmit}>Submit</Button>
               
            </Form>
            { errorList.length ?(
                    <Message
                        error
                        header= "There was some errors with your submission"
                        list= {errorList}
                    />

            ) : null}

            
            
            
        </Container>

        )
    }

}

const loginMutation = gql`
    mutation($email:String!, $password:String!) {
        login(email:$email,password: $password){
        ok,
        token,
        refreshToken,
        errors{
            path,
            message
        }
        }
    }
`;

export default graphql(loginMutation)(observer(Login))

