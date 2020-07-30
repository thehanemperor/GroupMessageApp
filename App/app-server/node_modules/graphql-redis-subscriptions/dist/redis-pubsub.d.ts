/// <reference types="ioredis" />
import { RedisOptions, Redis as RedisClient } from 'ioredis';
import { PubSubEngine } from 'graphql-subscriptions/dist/pubsub-engine';
export interface PubSubRedisOptions {
    connection?: RedisOptions;
    triggerTransform?: TriggerTransform;
    connectionListener?: (err: Error) => void;
    publisher?: RedisClient;
    subscriber?: RedisClient;
}
export declare class RedisPubSub implements PubSubEngine {
    constructor(options?: PubSubRedisOptions);
    publish(trigger: string, payload: any): boolean;
    subscribe(trigger: string, onMessage: Function, options?: Object): Promise<number>;
    unsubscribe(subId: number): void;
    asyncIterator<T>(triggers: string | string[]): AsyncIterator<T>;
    getSubscriber(): RedisClient;
    getPublisher(): RedisClient;
    private onMessage(channel, message);
    private triggerTransform;
    private redisSubscriber;
    private redisPublisher;
    private subscriptionMap;
    private subsRefsMap;
    private currentSubscriptionId;
}
export declare type Path = Array<string | number>;
export declare type Trigger = string | Path;
export declare type TriggerTransform = (trigger: Trigger, channelOptions?: Object) => string;
