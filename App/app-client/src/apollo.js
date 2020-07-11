import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws'
import {getMainDefinition } from 'apollo-utilities'

//const backup = 'http://192.168.1.6:8080/graphql'
const localhost ='http://localhost:8080/graphql'
const httpLink = createHttpLink({uri: localhost})

//middleware running before the graphql request
// for authentication
const middlewareLink = setContext(()=>({
  headers:{
    'x-token' : localStorage.getItem('token'),
    'x-refresh-token' : localStorage.getItem('refreshToken'),
  }
}));


// afterware running after the graphql request
const afterwareLink = new ApolloLink((operation,forward)=> {
    const {headers} = operation.getContext();

    if (headers){
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token')
      if (token){
          localStorage.setItem('token',token)
      }
      if (refreshToken){
          localStorage.setItem('refreshToken',refreshToken)
      }

    }
    
    return forward(operation)
});

const httpLinkWithMiddleware = afterwareLink.concat( middlewareLink.concat(httpLink))


const sublink="ws://localhost:8080/subscriptions"
//const sublinkBackUp ='ws://192.168.1.6:8080/subscriptions'
const wsLink = new WebSocketLink({

    uri: sublink,
    options: {
        reconnect: true
    }
})

// fork the route so we can choose which http to use
const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLinkWithMiddleware,
)

export default new ApolloClient({
    link,
    cache: new InMemoryCache(),
  })