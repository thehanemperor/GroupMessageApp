import { RedisPubSub } from "graphql-redis-subscriptions";

export default new RedisPubSub({
    connection:{
        host: '127.0.0.1',
        port: 6379,
        retryStrategy: options=>{
            // reconnect
            return Math.max(options.attempt * 100, 3000)
        }
    }
})