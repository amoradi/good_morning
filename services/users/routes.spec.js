const should = require("should");
const { app, server } = require("../../index");
const request = require("supertest");

describe("users service", () => {
  after((done) => {
    server.close(done);
  });

  describe("POST users/create", () => {
    it("should create a user", (done) => {
      request(app)
        .post("/api/users/create")
        .send({ username: "foo", password: "french" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)
        .expect({ username: "foo" })
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });

    it("should not create a user when username is invalid and redirect to /sign-up", (done) => {
      // empty string username
      request(app)
        .post("/api/users/create")
        .send({ username: "", password: "french" })
        .set("Accept", "application/json")
        .expect(302)
        .end((err, res) => {
          should(res.headers.location).equal("/sign-up");
          if (err) return done(err);
        });

      // undefined username
      request(app)
        .post("/api/users/create")
        .send({ username: undefined, password: "french" })
        .set("Accept", "application/json")
        .expect(302)
        .end((err, res) => {
          should(res.headers.location).equal("/sign-up");
          if (err) return done(err);
          done();
        });
    });

    it("should not create a user when it already exists and redirect to /sign-up", (done) => {
      request(app)
        .post("/api/users/create")
        .send({ username: "foo", password: "french" })
        .set("Accept", "application/json")
        .expect(302)
        .end((err, res) => {
          should(res.headers.location).equal("/sign-up");
          if (err) return done(err);
          done();
        });
    });
  });

  // NOTE: this really sucks. I'm foregoing testing auth-ed paths
  // for time's sake. If I make time and/or upgrade this into a more "serious"
  // project, proper auth-ed cases should be tested -- until then, only auth-failing paths
  // are accounted for, cheers.
  //
  // to be fair, I did try to quickly stub-out the auth functions in sinon and to no avail.
  describe("authenticated and authorized routes", () => {
    describe("GET users/:username", () => {
      it("should redirect to / when unauthorized", (done) => {
        request(app)
          .get("/api/users/aaronm")
          .expect(302)
          .expect({})
          .end((err) => {
            if (err) return done(err);
            done();
          });
      });
    });
    describe("DELETE users/:username", () => {
      it("should redirect to / when unauthorized", (done) => {
        request(app)
          .delete("/api/users/aaronm")
          .expect(302)
          .expect({})
          .end((err) => {
            if (err) return done(err);
            done();
          });
      });
    });
    describe("PUT users/:username", () => {
      it("should redirect to / when unauthorized", (done) => {
        request(app)
          .put("/api/users/aaronm")
          .expect(302)
          .expect({})
          .end((err) => {
            if (err) return done(err);
            done();
          });
      });
    });
  });
});
