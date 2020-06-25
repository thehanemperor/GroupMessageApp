import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Routes from './routes';
import {ApolloClient, createNetworkInterface, ApolloProvider} from 'react-apollo'
import  'semantic-ui-css/semantic.min.css';


const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8080/graphql',
  //uri: 'http://192.168.1.6:8080/graphql'
})

networkInterface.use([{
  applyMiddleware(req,next){
    if (!req.options.headers){
      req.options.headers = {}
    }
    req.options.headers['x-token'] = localStorage.getItem('token');
    req.options.headers['x-refresh-token'] = localStorage.getItem('refreshToken');
    next();
  }
}])

networkInterface.useAfter([{
  applyAfterware({response:{headers}},next){
    const token = headers.get('x-token');
    const refreshToken = headers.get('x-refresh-token')
    if (token){
        localStorage.setItem('token',token)
    }
    if (refreshToken){
        localStorage.setItem('refreshToken',refreshToken)
    }

    next()
  }
}])

const client = new ApolloClient({
  networkInterface
})

const App = (
  <ApolloProvider client = {client}>
    <Routes/>
  </ApolloProvider>
  
)

ReactDOM.render(
  
  App,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
