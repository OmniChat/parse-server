const SessionTokenCache = require('../lib/LiveQuery/SessionTokenCache')
  .SessionTokenCache;

describe('SessionTokenCache', function() {
      beforeEach(function(done) {
        const Parse = require('parse/node');

        spyOn(Parse, 'Query').and.returnValue({
          first: jasmine.createSpy('first').and.returnValue(
            Promise.resolve(
              new Parse.Object('_Session', {
                user: new Parse.User({
                  id: 'userId'
                }),
              })
            )
          ),
          equalTo: function() {},
        });

        spyOn(Parse, "Query").and.returnValue({
          first: jasmine.createSpy("first").and.returnValue(Parse.Promise.as(new Parse.Object("_Session", {
            user: new Parse.User({
              id: "userId"
            })
          }))),
          equalTo: function() {}
        })

        sessionTokenCache.getUserId(undefined).then(
          () => {},
          error => {
            expect(error).not.toBeNull();
            done();
          }
        );
      });

      it('can get existing userId', function(done) {
        const sessionTokenCache = new SessionTokenCache();
        const sessionToken = 'sessionToken';
        const userId = 'userId';
        sessionTokenCache.cache.set(sessionToken, userId);

        sessionTokenCache.getUserId(sessionToken).then(userIdFromCache => {
          expect(userIdFromCache).toBe(userId);
          done();
        });
      });

      describe('Invalid session', function() {
        beforeEach(function(done) {
          const Parse = require('parse/node');

          spyOn(Parse, "Query").and.returnValue({
            first: jasmine.createSpy("first").and.returnValue(Parse.Promise.as(undefined)),
            equalTo: function() {}
          })

          sessionTokenCache.getUserId('sessionToken').then(userIdFromCache => {
            expect(userIdFromCache).toBe('userId');
            expect(sessionTokenCache.cache.length).toBe(1);
            done();
          });
        });
      });