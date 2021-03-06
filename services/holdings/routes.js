// symbol, name, class string[], category string[], amount owned number

const express = require("express");
const passport = require("passport");
const isAuthorized = require("../auth/isAuthorized");
const fakeDb = require("../../db");
const router = express.Router();
/*

  Holding:
  symbol varchar(10) NOT NULL,
  name varchar(100) NOT NULL,
  category varchar(100)[] NOT NULL,
  amount decimal NOT NULL,
  owner varchar(100) NOT NULL REFERENCES users(username),
  PRIMARY KEY(symbol, owner)

*/

/*

  NOTE: holdings are are always _owned_ -- they are tied to a user.

*/

// GET all the holdings you own
router.get("/holdings/:username", isAuthorized, (req, res) => {
  db.query(db.getHoldings(req.params.username), (err, dbRes) => {
    if (err) {
      res.status(500);
    }

    res.status(200).json({ holdings: dbRes.rows });
  });
});

// create a holding 
router.post("/holdings/:username/create", isAuthorized, (req, res) => {
  const foundUser = fakeDb.find((rec) => rec.username === req.params.username);
  const holdings = []; // TODO: find holdings by user
  const newHolding = req.body.holding;

  holdings.push({
    /* new holding */
  });

  // symbol: string;
  // name: string;
  // category: string[];
  // denomination: number;
  // username: string

  if (foundUser) {
    res.status(200).json({
      /* new holding */
    });
  } else {
    res.status(404);
  }
});

// delete a holding
router.delete("/holdings/:username/delete", isAuthorized, (req, res) => {
  const symbol = req.body.symbol;

  // find symbol who's linked to :username
  // and delete it.

  if (foundUser) {
    res.status(200).json({
      /* deleted holding */
    });
  } else {
    res.status(404);
  }
});

// update a holding
// TODO: patch, put or post?
router.patch("/holdings/:username/update", isAuthorized, (req, res) => {
  const foundUser = fakeDb.find((rec) => rec.username === req.params.username);
  const foundHolding = ""; // find holding.
  const { name, category, denomination } = req.body;
  // symbol: string;
  // name: string;
  // category: string[];
  // denomination: number;
  // username: string

  if (foundHolding) {
    if (name) {
      foundHolding.name = name;
    }

    if (category) {
      foundHolding.category = category;
    }

    if (denomination !== undefined) {
      foundHolding.denomination = denomination;
    }

    res.status(200).json({ foundHolding });
  } else {
    res.status(404);
  }
});
