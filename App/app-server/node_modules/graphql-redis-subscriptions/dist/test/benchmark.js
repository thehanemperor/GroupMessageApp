"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var graphql_1 = require("graphql");
var graphql_subscriptions_1 = require("graphql-subscriptions");
var redis_pubsub_1 = require("../redis-pubsub");
var expect = chai.expect;
var User = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: {
        login: {
            type: graphql_1.GraphQLString,
        },
        avatar_url: {
            type: graphql_1.GraphQLString,
        },
        html_url: {
            type: graphql_1.GraphQLString,
        },
        name: {
            type: graphql_1.GraphQLString,
        },
        last_visit: {
            type: graphql_1.GraphQLFloat,
        },
    },
});
var Comment = new graphql_1.GraphQLObjectType({
    name: 'Comment',
    fields: {
        id: {
            type: graphql_1.GraphQLID,
        },
        content: {
            type: graphql_1.GraphQLString,
        },
        repoName: {
            type: graphql_1.GraphQLString,
        },
        createdAt: {
            type: graphql_1.GraphQLFloat,
        },
        attachedImage: {
            type: graphql_1.GraphQLString,
        },
        likes: {
            type: graphql_1.GraphQLInt,
        },
        postedBy: {
            type: User,
        },
    },
});
var schema = new graphql_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: {
            testString: {
                type: graphql_1.GraphQLString,
                resolve: function (_, args) {
                    return 'works';
                },
            },
        },
    }),
    subscription: new graphql_1.GraphQLObjectType({
        name: 'Subscription',
        fields: {
            testSubscription: {
                type: graphql_1.GraphQLString,
                resolve: function (root) {
                    return root;
                },
            },
            testSubscription2: {
                type: graphql_1.GraphQLString,
                resolve: function (root) {
                    return root;
                },
            },
            commentAdded: {
                type: Comment,
                resolve: function (root) {
                    return root;
                },
            },
        },
    }),
    types: [Comment, User],
});
describe('Benchmark EE PubSub', function () {
    var subManager = new graphql_subscriptions_1.SubscriptionManager({
        schema: schema,
        setupFunctions: {},
        pubsub: new graphql_subscriptions_1.PubSub(),
    });
    describe('multiple subscribers to channel', function () {
        var numberOfSubscribers = 30000;
        var subsPromises = [];
        var publishesCounter = 0;
        var subIds = [];
        before("Subscribe to " + numberOfSubscribers, function (done) {
            this.timeout(10000);
            publishesCounter = 0;
            var query = 'subscription X{ testSubscription }';
            var callback = function () { return publishesCounter++; };
            for (var i = 0; i < numberOfSubscribers; i++) {
                var promise = subManager.subscribe({ query: query, operationName: 'X', callback: callback });
                subsPromises.push(promise);
            }
            Promise.all(subsPromises).then(function (ids) {
                subIds = ids;
                done();
            }).catch(done);
        });
        after('Unsubscribe', function (done) {
            this.timeout(10000);
            subIds.forEach(function (subId, index) {
                expect(subId).to.be.a('number');
                subManager.unsubscribe(subId);
                if (index >= subIds.length - 1) {
                    done();
                }
            });
        });
        it("should be able to publish to " + numberOfSubscribers + " subscribers under a second", function (done) {
            this.slow(1000);
            subManager.publish('testSubscription', 'small event');
            setTimeout(function () {
                try {
                    expect(publishesCounter).to.equals(numberOfSubscribers);
                    done();
                }
                catch (e) {
                    done(e);
                }
            }, 10);
        });
    });
    describe('multiple events to channel', function () {
        this.timeout(10000);
        var smallEventsPerSec = 30000;
        var mediumEventsPerSec = 30000;
        var largeEventsPerSec = 30000;
        var mutationsPerSec = 30000;
        var smallQueriesPerSec = 19700;
        var mediumQueryPerSec = 16600;
        var fullQueryPerSec = 14600;
        it("should be able to publish " + smallEventsPerSec + " small events under a second", function (done) {
            var query = 'subscription X{ testSubscription2 }';
            var payload = 'small event';
            testEventsPerSecond.call(this, smallEventsPerSec, payload, subManager, query, done);
        });
        var mediumEventSize = 5000;
        var mediumMessage = '';
        for (var i = 0; i < mediumEventSize; i++) {
            mediumMessage += 'e';
        }
        it("should be able to publish " + mediumEventsPerSec + " medium events under a second", function (done) {
            var query = 'subscription X{ testSubscription2 }';
            testEventsPerSecond.call(this, mediumEventsPerSec, mediumMessage, subManager, query, done);
        });
        var largeEventSize = 50000;
        var largeMessage = '';
        for (var i = 0; i < largeEventSize; i++) {
            largeMessage += 'e';
        }
        it("should be able to publish " + largeEventsPerSec + " large events under a second", function (done) {
            var query = 'subscription X{ testSubscription2 }';
            testEventsPerSecond.call(this, largeEventsPerSec, largeMessage, subManager, query, done);
        });
        var mutationResult = {
            content: 'Very good example',
            repoName: 'graphql-redis-subscriptions',
            attachedImage: 'https://avatars1.githubusercontent.com/u/2580920?v=3&s=466',
            likes: 5,
            postedBy: {
                login: 'davidyaha',
                avatar_url: 'https://avatars1.githubusercontent.com/u/2580920?v=3&s=466',
                html_url: 'https://twitter.com/davidyahalomi',
                name: 'David Yahalomi',
                last_visit: Date.now(),
            },
        };
        it("should be able to publish " + mutationsPerSec + " empty query mutation results under a second", function (done) {
            var query = "subscription X{\n        commentAdded {\n          id\n        }\n      }";
            testMutationsPerSecond.call(this, mutationsPerSec, mutationResult, subManager, query, done);
        });
        it("should be able to publish " + smallQueriesPerSec + " small query mutation results under a second", function (done) {
            var query = "subscription X{\n        commentAdded {\n          id\n          createdAt\n          postedBy {\n            login\n          }\n        }\n      }";
            testMutationsPerSecond.call(this, smallQueriesPerSec, mutationResult, subManager, query, done);
        });
        it("should be able to publish " + mediumQueryPerSec + " medium query mutation results under a second", function (done) {
            var query = "subscription X{\n        commentAdded {\n          id\n          createdAt\n          content\n          repoName\n          postedBy {\n            login\n            avatar_url\n            html_url\n          }\n        }\n      }";
            testMutationsPerSecond.call(this, mediumQueryPerSec, mutationResult, subManager, query, done);
        });
        it("should be able to publish " + fullQueryPerSec + " full query mutation results under a second", function (done) {
            var query = "subscription X{\n        commentAdded {\n          id\n          createdAt\n          content\n          repoName\n          attachedImage\n          likes\n          postedBy {\n            login\n            avatar_url\n            html_url\n            name\n            last_visit\n          }\n        }\n      }";
            testMutationsPerSecond.call(this, fullQueryPerSec, mutationResult, subManager, query, done);
        });
    });
});
describe('Benchmark Redis PubSub', function () {
    var subManager = new graphql_subscriptions_1.SubscriptionManager({
        schema: schema,
        setupFunctions: {},
        pubsub: new redis_pubsub_1.RedisPubSub(),
    });
    describe('multiple subscribers to channel', function () {
        var numberOfSubscribers = 30000;
        var subsPromises = [];
        var publishesCounter = 0;
        var subIds = [];
        before("Subscribe to " + numberOfSubscribers, function (done) {
            this.timeout(10000);
            publishesCounter = 0;
            var query = 'subscription X{ testSubscription }';
            var callback = function () { return publishesCounter++; };
            for (var i = 0; i < numberOfSubscribers; i++) {
                var promise = subManager.subscribe({ query: query, operationName: 'X', callback: callback });
                subsPromises.push(promise);
            }
            Promise.all(subsPromises).then(function (ids) {
                subIds = ids;
                done();
            }).catch(done);
        });
        after('Unsubscribe', function (done) {
            this.timeout(10000);
            subIds.forEach(function (subId, index) {
                expect(subId).to.be.a('number');
                subManager.unsubscribe(subId);
                if (index >= subIds.length - 1) {
                    done();
                }
            });
        });
        it("should be able to publish to " + numberOfSubscribers + " subscribers under a second", function (done) {
            this.slow(1000);
            subManager.publish('testSubscription', 'small event');
            setTimeout(function () {
                try {
                    expect(publishesCounter).to.equals(numberOfSubscribers);
                    done();
                }
                catch (e) {
                    done(e);
                }
            }, 10);
        });
    });
    describe('multiple events to channel', function () {
        this.timeout(10000);
        var smallEventsPerSec = 14000;
        var mediumEventsPerSec = 5000;
        var largeEventsPerSec = 340;
        var mutationsPerSec = 10500;
        var smallQueriesPerSec = 9500;
        var mediumQueryPerSec = 8700;
        var fullQueryPerSec = 7700;
        it("should be able to publish " + smallEventsPerSec + " small events under a second", function (done) {
            var query = 'subscription X{ testSubscription2 }';
            var payload = 'small event';
            testEventsPerSecond.call(this, smallEventsPerSec, payload, subManager, query, done);
        });
        var mediumEventSize = 5000;
        var mediumMessage = '';
        for (var i = 0; i < mediumEventSize; i++) {
            mediumMessage += 'e';
        }
        it("should be able to publish " + mediumEventsPerSec + " medium events under a second", function (done) {
            var query = 'subscription X{ testSubscription2 }';
            testEventsPerSecond.call(this, mediumEventsPerSec, mediumMessage, subManager, query, done);
        });
        var largeEventSize = 50000;
        var largeMessage = '';
        for (var i = 0; i < largeEventSize; i++) {
            largeMessage += 'e';
        }
        it("should be able to publish " + largeEventsPerSec + " large events under a second", function (done) {
            var query = 'subscription X{ testSubscription2 }';
            testEventsPerSecond.call(this, largeEventsPerSec, largeMessage, subManager, query, done);
        });
        var mutationResult = {
            content: 'Very good example',
            repoName: 'graphql-redis-subscriptions',
            attachedImage: 'https://avatars1.githubusercontent.com/u/2580920?v=3&s=466',
            likes: 5,
            postedBy: {
                login: 'davidyaha',
                avatar_url: 'https://avatars1.githubusercontent.com/u/2580920?v=3&s=466',
                html_url: 'https://twitter.com/davidyahalomi',
                name: 'David Yahalomi',
                last_visit: Date.now(),
            },
        };
        it("should be able to publish " + mutationsPerSec + " empty query mutation results under a second", function (done) {
            var query = "subscription X{\n        commentAdded {\n          id\n        }\n      }";
            testMutationsPerSecond.call(this, mutationsPerSec, mutationResult, subManager, query, done);
        });
        it("should be able to publish " + smallQueriesPerSec + " small query mutation results under a second", function (done) {
            var query = "subscription X{\n        commentAdded {\n          id\n          createdAt\n          postedBy {\n            login\n          }\n        }\n      }";
            testMutationsPerSecond.call(this, smallQueriesPerSec, mutationResult, subManager, query, done);
        });
        it("should be able to publish " + mediumQueryPerSec + " medium query mutation results under a second", function (done) {
            var query = "subscription X{\n        commentAdded {\n          id\n          createdAt\n          content\n          repoName\n          postedBy {\n            login\n            avatar_url\n            html_url\n          }\n        }\n      }";
            testMutationsPerSecond.call(this, mediumQueryPerSec, mutationResult, subManager, query, done);
        });
        it("should be able to publish " + fullQueryPerSec + " full query mutation results under a second", function (done) {
            var query = "subscription X{\n        commentAdded {\n          id\n          createdAt\n          content\n          repoName\n          attachedImage\n          likes\n          postedBy {\n            login\n            avatar_url\n            html_url\n            name\n            last_visit\n          }\n        }\n      }";
            testMutationsPerSecond.call(this, fullQueryPerSec, mutationResult, subManager, query, done);
        });
    });
});
function testEventsPerSecond(eventsPerSec, eventPayload, subManager, query, done) {
    this.slow(1500);
    var start;
    var publishesCounter = 0;
    var subId;
    var callback = function () {
        if (++publishesCounter === eventsPerSec) {
            try {
                expect(Date.now() - start).to.below(1000);
                subManager.unsubscribe(subId);
                done();
            }
            catch (e) {
                done(e);
            }
        }
    };
    subManager.subscribe({ query: query, operationName: 'X', callback: callback }).then(function (id) {
        subId = id;
        start = Date.now();
        for (var i = 0; i < eventsPerSec; i++) {
            subManager.publish('testSubscription2', eventPayload);
        }
    }).catch(done);
}
function testMutationsPerSecond(mutationsPerSec, mutationPayload, subManager, query, done) {
    this.slow(1500);
    var start;
    var publishesCounter = 0;
    var subId;
    var callback = function (err, event) {
        if (err) {
            done(err);
        }
        if (++publishesCounter === mutationsPerSec) {
            try {
                expect(Date.now() - start).to.below(1000);
                var commentId = event.data.commentAdded.id;
                expect(commentId).to.equals(String(mutationsPerSec));
                subManager.unsubscribe(subId);
                done();
            }
            catch (e) {
                done(e);
            }
        }
    };
    subManager.subscribe({ query: query, operationName: 'X', callback: callback }).then(function (id) {
        subId = id;
        start = Date.now();
        for (var i = 0; i < mutationsPerSec; i++) {
            mutationPayload['id'] = i + 1;
            mutationPayload['createdAt'] = Date.now();
            subManager.publish('commentAdded', mutationPayload);
        }
    }).catch(done);
}
//# sourceMappingURL=benchmark.js.map