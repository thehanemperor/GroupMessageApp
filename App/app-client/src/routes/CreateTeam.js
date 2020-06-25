import React from 'react'
import {observer} from 'mobx-react'
import {extendObservable} from 'mobx'
import {Message,Form,Button, Input,Container,Header} from 'semantic-ui-react';
import {gql,graphql} from 'react-apollo'

class CreateTeam extends React.Component {
    constructor(props){
        super(props);

        extendObservable(this,{
            name: '',
            errors: {}
        });
    };

    onSubmit =async () => {
        const {name} = this;
        const response = null
        try{
            await this.props.mutate({
                variables:{name}
            })
    
        }
        catch(err){
            this.props.history.push('/login')
            return
        }
        
        console.log(response)

        const { ok,errors} = response.data.createTeam;

        if (ok){
            
            this.props.history.push('/')
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
        const {name,errors:{nameError}} = this;
        const errorList = []
       
        if(nameError){
            errorList.push(nameError)
        }

        return(

            <Container text>
            <Header as='h2'>Create a Team</Header>
            
            <Form>
                


                <Form.Field error={!!nameError}>
                    <Input 
                    
                        name="name" 
                        onChange={this.onChange} 
                        value = {name} 
                        
                        placeholder = "Name" 
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

const CreateTeamMutation = gql`
    mutation($name:String!) {
        createTeam(name:$name){
            ok,
            errors{
                path,
                message
            }
        }
    }
`;

export default graphql(CreateTeamMutation)(observer(CreateTeam))

