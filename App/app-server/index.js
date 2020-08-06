import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress,graphiqlExpress} from 'apollo-server-express'

import models from "./models"
import { makeExecutableSchema } from 'graphql-tools'

import path from "path"
import {fileLoader,mergeTypes, mergeResolvers} from "merge-graphql-schemas"
import cors from 'cors'

import jwt  from 'jsonwebtoken'
import {refreshTokens}  from './auth'


import {createServer } from 'http'
import { execute, subscribe} from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { create } from 'domain'
import formidable from 'formidable'
import Dataloader from 'dataloader'
import { channelBatcher,userBatcher } from './batchFunctions'

const SECRET = 'jsidfniejisernfidsner'
const SECRET2 = 'jifjdisnfiesseresder'

const typeDefs =  mergeTypes(fileLoader(path.join(__dirname,'./schema')));
const resolvers =  mergeResolvers(fileLoader(path.join(__dirname,'./resolvers')));

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const graphqlEndpoint = "/graphql"
const app = express()
app.use(cors('*'));

const addUser= async (req,res,next)=> {
    const token = req.headers['x-token'];
    if (token){
        try{
            const {user} = jwt.verify(token,SECRET)
            req.user = user;
        }catch (err){
            const refreshToken = req.headers['x-refresh-token'];
            const newTokens = await refreshTokens(token,refreshToken,models,SECRET, SECRET2)
            if (newTokens.token && newTokens.refreshToken){
                res.set('Access-Control-Expose-Headers','x-token, x-refresh-token');
                res.set('x-token',newTokens,token)
                res.set('x-refresh-token',newTokens.refreshToken)
            }
            req.user = newTokens.user
        }
    }
    next()
}

const uploadDir = 'files'
const fileMiddleware = (req,res,next)=>{
    if (!req.is('multipart/form-data')) return next()
    
    const form = formidable.IncomingForm({
        uploadDir,
    })
    form.parse(req,(error,{operations},files)=> {
        if (error) 
        {
            console.log(error)
        }
        const document = JSON.parse(operations)
        if (Object.keys(files).length){
            const { file:{ type:type, path: filepath} } = files
            console.log('file type',type)
            console.log('file path',filepath)
            document.variables.file = {
                type: type,
                path: filepath,
            }
        }  
        
        req.body = document
        console.log('documents',req.body)
        next()
    })

}

app.use(addUser)

app.use(
    graphqlEndpoint,
    bodyParser.json(),
    fileMiddleware,
    graphqlExpress(req =>({
        schema:schema,
        context:{
            models,
            user:req.user,
            SECRET,
            SECRET2,
            channelLoader: new Dataloader((ids)=> channelBatcher( ids, models, req.user )),
            //userLoader: new Dataloader((user,userIds) = userBatcher(models,user,userIds)),
            serverUrl: `${req.protocol}://${req.get('host')}`,
        },
        

    }))
);

app.use('/graphiql',
        graphiqlExpress(
            {
                endpointURL:graphqlEndpoint,
                subscriptionsEndpoint: 'ws://localhost:8080/subscriptions'
                
            }
        )
    );

app.use('/files',express.static('files'))

const server = createServer(app)

models.sequelize.sync({ force: false }).then(()=> {
    server.listen(8080,()=>{
        new SubscriptionServer(
            {
                execute,
                subscribe,
                schema: schema,
                onConnect: async ({token,refreshToken},WebSocket)=> {
                    if (token && refreshToken){
                        let user = null
                        try{
                            const {user} = jwt.verify(token,SECRET)
                            return { models:models,user:user}
                        }catch (err){
                            const newTokens = await refreshTokens(token,refreshToken,models,SECRET, SECRET2)
                            return  { models:models, user: newTokens.user }
                        }

                    }
                    //console.log('throw error',token)
                    return { models:models,}
                }
            },
            {   
                server,
                path: '/subscriptions'

            }
        )
    })
})

