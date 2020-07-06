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

app.use(addUser)

app.use(
    graphqlEndpoint,
    bodyParser.json(),
    graphqlExpress(req =>({
        schema:schema,
        context:{
            models,
            user:req.user,
            SECRET,
            SECRET2,
        },
        

    }))
);

app.use('/graphiql',graphiqlExpress({endpointURL:graphqlEndpoint}));

models.sequelize.sync({force: false}).then(()=> {
    app.listen(8080)
})
