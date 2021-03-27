// Server status codes
// Server response content
// Error cases
var app = require("../../index");
var request = require("supertest")(app);

describe("users service", () => {
  describe("POST users/create", () => {
    test("creates a user", () => {
      request
        .post("/user/create")
        .send({ username: "chargha", password: "french" })
        .query(token)
        .expect(201, {
          username: "chargha",
        })
        .end(function (err, res) {
          should(err).equal(null);
          done();
        });
    });

    test("user already exists", () => {
      request
        .post("/user/create")
        .send({ username: "chargha", password: "french" })
        .query(token)
        .expect(201, {
          username: "chargha",
        })
        .end(function (err, res) {
          should(err).equal(null);
          done();
        });
    });

    //test('invalid password')
    //test('invalid username')

    describe("authenticated and authorized routes", () => {
      describe("GET users/:user", () => {
        // fails not authed
        // fails not authzed

        let token; // pass token around to test authenticated routes
        before(function (done) {
          request
            .post("/login")
            .send({
              username: "aaronm",
              password: "texas",
            })
            .end(function (err, res) {
              if (err) throw err;
              token = { access_token: res.body.token };
              done();
            });
        });
      });
      describe("PUT users/:user", () => {
         // fails not authzed and aauthed

         let token; // pass token around to test authenticated routes
         before(function (done) {
           request
             .post("/login")
             .send({
               username: "aaronm",
               password: "texas",
             })
             .end(function (err, res) {
               if (err) throw err;
               token = { access_token: res.body.token };
               done();
             });
         });
      });
    });
  });
});
