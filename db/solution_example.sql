/* 

Holds all SQL statements needed to model the app,
in case it's ever needed for later use.

## User model /////////////////////

users table

email: varchar(100) UNIQUE
password: varchar(100)
username: varchar(100) UNIQUE

username <PK>

///////////////////////////////////

## Holding model //////////////////

holdings table // tracks ownership not price.

symbol: varchar(10); // ticker
name: varchar(100); // full name
category: varchar(100)[]; // alternative asset, stable coin, red, etc.
amount: decimal; // amount in number X holdings. decimal
username: varchar(100) User.username <foreign key> // points to users table

symbol, username <PK>
username <FK> <users table>

/////////////////////////////////////

## Holding History //////////////////

holdings_history table

symbol: varchar(10)
name: varchar(100)
price_at_5pm_usd: [varchar(100), money], [[date, price]]

symbol <FK> <holdings table>
name <FK> <holdings table>

//////////////////////////////////////

*/




CREATE TABLE films (
  name TEXT,
  release_year INTEGER
);

INSERT INTO films (name, release_year)
VALUES ('The Matrix', 1999);

INSERT INTO films (name, release_year)
VALUES ('Monsters, Inc.', 2001);

INSERT INTO films (name, release_year)
VALUES ('Call Me By Your Name', 2017);

SELECT * FROM films WHERE release_year = 1999;

ALTER TABLE films ADD COLUMN runtime INTEGER;
ALTER TABLE films ADD COLUMN category TEXT;
ALTER TABLE films ADD COLUMN rating REAL;
ALTER TABLE films ADD COLUMN box_office BIGINT;

UPDATE films
SET runtime = 150,
    category = 'sci-fi',
    rating = 8.7,
    box_office = 465300000   
WHERE name = 'The Matrix';

UPDATE films
SET runtime = 92,
    category = 'animation',
    rating = 8,
    box_office = 5774000000   
WHERE name = 'Monsters, Inc.';

UPDATE films
SET runtime = 132,
    category = 'drama',
    rating = 7.9,
    box_office = 41900000  
WHERE name = 'Call Me By Your Name';

ALTER TABLE films
ADD CONSTRAINT unique_name UNIQUE (name);