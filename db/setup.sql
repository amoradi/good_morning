/* 

  Holds all SQL statements needed to model the app,
  in case it's ever needed for later use.

  varchar 100 & 10 used for consistancy

*/


CREATE TABLE users (
  email: varchar(100) NOT NULL UNIQUE,
  password: varchar(100) NOT NULL,
  username: varchar(100) NOT NULL PRIMARY KEY
);

/* 

  Tracks asset **ownership and amount owned** not price.
  Primary key denotes ownership -- in the form of a symbol-user pair.

  - symbol, user_username <PK>
  - user_username <FK>

*/
CREATE TABLE holdings (
  symbol: varchar(10) NOT NULL,
  name: varchar(100) NOT NULL,
  category: varchar(100)[] NOT NULL,
  amount: decimal NOT NULL,
  user_username: varchar(100) NOT NULL REFERENCES users(username),
  PRIMARY KEY(symbol, user_username)
)

/*

  Tracks price history for said asset

*/

CREATE TABLE asset_history (
  symbol: varchar(10) NOT NULL UNIQUE PRIMARY KEY
  price_at_5pm_usd: [varchar(100), money][] NOT NULL /* [[date, price]] */
)
