# Services

...will consist of REST endpoints more-or-less

TODO: user swagger and follow best naming patterns: plural/singular?

Users Service

- CRUD a user
- username, email, password
- user table

Holdings Service

- CRUD a holding
- symbol, name, class string[], category string[], amount owned number (BTC, bitcoin, crypto, stable coin)
- a holding is tied to a single user
- holdings table

Holdings History Service

- track holdings over time: daily timestamp. closing at 5pm EST or w/e
- agg price $3k
- $ composition over time ($400 BTC, $100 ADA)
- DERIVED. % composition over time
- CREATE + READ ONLY
- holding history is tied to a single user
- holdings_history table
