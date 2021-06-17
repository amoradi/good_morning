const express = require("express");
const db = require("./db");
const isAuthenticated = require("./services/auth/isAuthenticated");

const router = express.Router();
const flashMessage = (message) =>
  `<p style="color:#ff0000;font-size:12px">${message}</p>`;
const flashInfoMessage = (message) =>
  `<p style="color:#02ff00;font-size:12px">${message}</p>`;

// === PAGES === //

router.get("/login", (req, res) => {
  if (req.isAuthenticated() /* a passport fn */) {
    res.redirect("/");
  } else {
    // else serve login form
    res.send(`
      ${flashMessage(res.locals.errors)}
      ${flashInfoMessage(res.locals.infos)}
      <h1>login</h1>
      <form id="form" action="/api/login" method="post">
        <input type="text" placeholder="username" name="username"></input>
        <input type="password" placeholder="password" name="password"></input>
        <!-- TODO: confirm password input -->
        <input type="submit" value="Submit">
      </form>
      <br />
      <a href="/sign-up">sign up</a>
    `);
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/sign-up", (req, res) => {
  console.log('wtf');
  res.send(`
  ${flashMessage(res.locals.errors)}
  <h1>sign up</h1>
  <form id="form" action="/api/users/create" method="post">
    <input type="text" placeholder="username" name="username"></input>
    <input type="text" placeholder="email" name="email"></input>
    <input type="password" placeholder="password" name="password"></input>
    <input type="submit" value="create account">
  </form>
  <br />
  <a href="/login">login</a>
`);
});


// === PROTECTED PAGES === //

// - current holdings, holdings over time and aggregate. Hard-coded: news, weather goals
// - edit assets link, log out link, profile link
// - hits holdings service
//
// (alias route for my-holdings)
router.get("/", isAuthenticated, (req, res) => {
  res.redirect("/my-holdings");
});
router.get("/my-holdings", isAuthenticated, (req, res) => { 
  db.query(db.getHoldings(req.user.username), (err, dbRes) => {
    const present = (holdings) => {
      // symbol varchar(10) NOT NULL,
      // name varchar(100) NOT NULL,
      // category varchar(100)[] NOT NULL,
      // amount decimal NOT NULL,
      // owner varchar(100) NOT NULL REFERENCES users(username),
      // PRIMARY KEY(symbol, owner)

      const html = holdings.map((h) => {
        return `
          <div>
            <div>${h.symbol}</div>
            <div>${h.name}</div>
            <div>${h.amount}</div>
            <div>${h.category.join("  ")}</div>
          </div>
        `
      });

      return html.join();
    }
    const content = err ? flashMessage(err.toString()) : present(dbRes.rows);

    res.send(`
      <h1>my holdings</h1>
      ${content}
      <a href="/edit"">edit</a>
      <a href="/logout">logout</a>
    `);
  });
});

// edit profile and holdings...
// add, remove holdings and change amounts
router.get("/edit", isAuthenticated, (req, res) => {
  db.query(db.getUser(req.user.username), (err, userRes) => {
    const user = userRes.rows[0];

    // start the callback fun =)
    // TODO: if you have time, convert to async/await
    db.query(db.getHoldings(req.user.username), (err, holdingsRes) => {
      let holdingsCnt = 0;
      const presentHoldings = () => {
        const html = holdingsRes.rows.map((h, i) => {
          `<div>
            <input type="text" name="symbol-${i}" value="${h.symbol}">
            <input type="text" name="name-${i}" value="${h.name}">
            <input type="text" name="amount-${i}" value="${h.amount}">
            <input type="text" name="category-${i}" value="${h.category.join("  ")}">
          </div>`
        });

        holdingsCnt = html.length;
        return html.join();
      }
      const addNewHolding = () => {
        return `<button type="button" id="add-holding" onclick="injectNewHoldingRow()">add holding</button>`;
      }

      res.send(`
        ${flashMessage(res.locals.errors)}
        ${flashInfoMessage(res.locals.infos)}
        <h1>edit</h1>
        <h2>my profile</h2>
        ${user && `<form id="form" action="/api/users/${user.username}" method="post">
          <input type="text" placeholder="username" readonly name="username" value="${user.username}">
          <input type="text" placeholder="email" name="email" value="${user.email}">
          <input type="password" placeholder="password" name="password" value="">
          <input type="password" placeholder="confirm password" name="password_confirm" value="">
          <p>
            <input type="submit" value="Submit">
          </p>
        </form>`}

        <h2>my holdings</h2>
        <script>
          let cnt  = ${holdingsCnt};
          
          function injectNewHoldingRow() {
            const el = document.getElementById('add-holding');
            
            if (el) {
              const div = document.createElement('div');
              const i = cnt + 1;

              div.innerHTML = \`
                <input type="text" name="symbol-\${i}" placeholder="symbol">
                <input type="text" name="name-\${i}" placeholder="name">
                <input type="text" name="amount-\${i}" placeholder="amount">
                <input type="text" name="category-\${i}" placeholder="category">
              \`;
              cnt = i;
              el.insertAdjacentElement('beforebegin', div);
              console.log(cnt);
            }
          }
        </script>
        <form id="form-holdings" action="/api/holdings" method="post">
          ${presentHoldings()}
          ${addNewHolding()}
          <!-- 
          
            list all my current assets in fields. 
            make adding an asset (new row) possible
            make removing a row possible
          
            on submit, filter out empty rows and SET ALL assets to user (clean sweep and set)
          -->
          <input type="submit" value="submit update">
        </form>
        <a href="/my-holdings">my holdings</a>
        <a href="/logout">logout</a>
      `);
    });
  });
});

module.exports = router;
