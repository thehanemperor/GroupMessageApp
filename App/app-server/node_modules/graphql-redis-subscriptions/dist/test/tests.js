"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var simple_mock_1 = require("simple-mock");
var iterall_1 = require("iterall");
var redis_pubsub_1 = require("../redis-pubsub");
var IORedis = require("ioredis");
chai.use(chaiAsPromised);
var expect = chai.expect;
var listener;
var publishSpy = simple_mock_1.spy(function (channel, message) { return listener && listener(channel, message); });
var subscribeSpy = simple_mock_1.spy(function (channel, cb) { return cb && cb(null, channel); });
var unsubscribeSpy = simple_mock_1.spy(function (channel, cb) { return cb && cb(channel); });
var mockRedisClient = {
    publish: publishSpy,
    subscribe: subscribeSpy,
    unsubscribe: unsubscribeSpy,
    on: function (event, cb) {
        if (event === 'message') {
            listener = cb;
        }
    },
};
var mockOptions = {
    publisher: mockRedisClient,
    subscriber: mockRedisClient,
};
describe('RedisPubSub', function () {
    it('should create default ioredis clients if none were provided', function (done) {
        var pubSub = new redis_pubsub_1.RedisPubSub();
        expect(pubSub.getSubscriber()).to.be.an.instanceOf(IORedis);
        expect(pubSub.getPublisher()).to.be.an.instanceOf(IORedis);
        done();
    });
    it('can subscribe to specific redis channel and called when a message is published on it', function (done) {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        pubSub.subscribe('Posts', function (message) {
            try {
                expect(message).to.equals('test');
                done();
            }
            catch (e) {
                done(e);
            }
        }).then(function (subId) {
            expect(subId).to.be.a('number');
            pubSub.publish('Posts', 'test');
            pubSub.unsubscribe(subId);
        });
    });
    it('can unsubscribe from specific redis channel', function (done) {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        pubSub.subscribe('Posts', function () { return null; }).then(function (subId) {
            pubSub.unsubscribe(subId);
            try {
                expect(unsubscribeSpy.callCount).to.equals(1);
                var call = unsubscribeSpy.lastCall;
                expect(call.args).to.have.members(['Posts']);
                done();
            }
            catch (e) {
                done(e);
            }
        });
    });
    it('cleans up correctly the memory when unsubscribing', function (done) {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        Promise.all([
            pubSub.subscribe('Posts', function () { return null; }),
            pubSub.subscribe('Posts', function () { return null; }),
        ])
            .then(function (_a) {
            var subId = _a[0], secondSubId = _a[1];
            try {
                expect(pubSub.subscriptionMap[subId]).not.to.be.an('undefined');
                pubSub.unsubscribe(subId);
                expect(pubSub.subscriptionMap[subId]).to.be.an('undefined');
                expect(function () { return pubSub.unsubscribe(subId); }).to.throw("There is no subscription of id \"" + subId + "\"");
                pubSub.unsubscribe(secondSubId);
                done();
            }
            catch (e) {
                done(e);
            }
        });
    });
    it('will not unsubscribe from the redis channel if there is another subscriber on it\'s subscriber list', function (done) {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        var subscriptionPromises = [
            pubSub.subscribe('Posts', function () {
                done('Not supposed to be triggered');
            }),
            pubSub.subscribe('Posts', function (msg) {
                try {
                    expect(msg).to.equals('test');
                    done();
                }
                catch (e) {
                    done(e);
                }
            }),
        ];
        Promise.all(subscriptionPromises).then(function (subIds) {
            try {
                expect(subIds.length).to.equals(2);
                pubSub.unsubscribe(subIds[0]);
                expect(unsubscribeSpy.callCount).to.equals(0);
                pubSub.publish('Posts', 'test');
                pubSub.unsubscribe(subIds[1]);
                expect(unsubscribeSpy.callCount).to.equals(1);
            }
            catch (e) {
                done(e);
            }
        });
    });
    it('will subscribe to redis channel only once', function (done) {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        var onMessage = function () { return null; };
        var subscriptionPromises = [
            pubSub.subscribe('Posts', onMessage),
            pubSub.subscribe('Posts', onMessage),
        ];
        Promise.all(subscriptionPromises).then(function (subIds) {
            try {
                expect(subIds.length).to.equals(2);
                expect(subscribeSpy.callCount).to.equals(1);
                pubSub.unsubscribe(subIds[0]);
                pubSub.unsubscribe(subIds[1]);
                done();
            }
            catch (e) {
                done(e);
            }
        });
    });
    it('can have multiple subscribers and all will be called when a message is published to this channel', function (done) {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        var onMessageSpy = simple_mock_1.spy(function () { return null; });
        var subscriptionPromises = [
            pubSub.subscribe('Posts', onMessageSpy),
            pubSub.subscribe('Posts', onMessageSpy),
        ];
        Promise.all(subscriptionPromises).then(function (subIds) {
            try {
                expect(subIds.length).to.equals(2);
                pubSub.publish('Posts', 'test');
                expect(onMessageSpy.callCount).to.equals(2);
                onMessageSpy.calls.forEach(function (call) {
                    expect(call.args).to.have.members(['test']);
                });
                pubSub.unsubscribe(subIds[0]);
                pubSub.unsubscribe(subIds[1]);
                done();
            }
            catch (e) {
                done(e);
            }
        });
    });
    it('can publish objects as well', function (done) {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        pubSub.subscribe('Posts', function (message) {
            try {
                expect(message).to.have.property('comment', 'This is amazing');
                done();
            }
            catch (e) {
                done(e);
            }
        }).then(function (subId) {
            try {
                pubSub.publish('Posts', { comment: 'This is amazing' });
                pubSub.unsubscribe(subId);
            }
            catch (e) {
                done(e);
            }
        });
    });
    it('throws if you try to unsubscribe with an unknown id', function () {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        return expect(function () { return pubSub.unsubscribe(123); })
            .to.throw('There is no subscription of id "123"');
    });
    it('can use transform function to convert the trigger name given into more explicit channel name', function (done) {
        var triggerTransform = function (trigger, _a) {
            var repoName = _a.repoName;
            return trigger + "." + repoName;
        };
        var pubSub = new redis_pubsub_1.RedisPubSub({
            triggerTransform: triggerTransform,
            publisher: mockRedisClient,
            subscriber: mockRedisClient,
        });
        var validateMessage = function (message) {
            try {
                expect(message).to.equals('test');
                done();
            }
            catch (e) {
                done(e);
            }
        };
        pubSub.subscribe('comments', validateMessage, { repoName: 'graphql-redis-subscriptions' }).then(function (subId) {
            pubSub.publish('comments.graphql-redis-subscriptions', 'test');
            pubSub.unsubscribe(subId);
        });
    });
    afterEach('Reset spy count', function () {
        publishSpy.reset();
        subscribeSpy.reset();
        unsubscribeSpy.reset();
    });
    after('Restore redis client', function () {
        simple_mock_1.restore();
    });
});
describe('PubSubAsyncIterator', function () {
    it('should expose valid asyncItrator for a specific event', function () {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        var eventName = 'test';
        var iterator = pubSub.asyncIterator(eventName);
        expect(iterator).to.exist;
        expect(iterall_1.isAsyncIterable(iterator)).to.be.true;
    });
    it('should trigger event on asyncIterator when published', function (done) {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        var eventName = 'test';
        var iterator = pubSub.asyncIterator(eventName);
        iterator.next().then(function (result) {
            expect(result).to.exist;
            expect(result.value).to.exist;
            expect(result.done).to.exist;
            done();
        });
        pubSub.publish(eventName, { test: true });
    });
    it('should not trigger event on asyncIterator when publishing other event', function () {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        var eventName = 'test2';
        var iterator = pubSub.asyncIterator('test');
        var triggerSpy = simple_mock_1.spy(function () { return undefined; });
        iterator.next().then(triggerSpy);
        pubSub.publish(eventName, { test: true });
        expect(triggerSpy.callCount).to.equal(0);
    });
    it('register to multiple events', function (done) {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        var eventName = 'test2';
        var iterator = pubSub.asyncIterator(['test', 'test2']);
        var triggerSpy = simple_mock_1.spy(function () { return undefined; });
        iterator.next().then(function () {
            triggerSpy();
            expect(triggerSpy.callCount).to.be.gte(1);
            done();
        });
        pubSub.publish(eventName, { test: true });
    });
    it('should not trigger event on asyncIterator already returned', function (done) {
        var pubSub = new redis_pubsub_1.RedisPubSub(mockOptions);
        var eventName = 'test';
        var iterator = pubSub.asyncIterator(eventName);
        iterator.next().then(function (result) {
            expect(result).to.exist;
            expect(result.value).to.exist;
            expect(result.value.test).to.equal('word');
            expect(result.done).to.be.false;
        });
        pubSub.publish(eventName, { test: 'word' });
        iterator.next().then(function (result) {
            expect(result).to.exist;
            expect(result.value).not.to.exist;
            expect(result.done).to.be.true;
            done();
        });
        iterator.return();
        pubSub.publish(eventName, { test: true });
    });
});
//# sourceMappingURL=tests.js.map