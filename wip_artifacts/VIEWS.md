# Views

...in protected, path, purpose, content, services

login

- /login
- login into app with username and pw
- username input, email input, pw input, forgot pw? link, create account link
- AUTH with gmail.
- users service

reset pw <logged-in>

- /reset-password
- update password...bc you forgot it
- insert new pw input, confirmation input... do it again.
- users service

create account

- /create-account
- create new account
- username, email, pw inputs

profile <logged-in>

- /profile
- see profile data: username, email, pw and link to edit them
- username, emial, pw inputs, edit email link, edit pw link
- users service

dashboard <logged-in>

- /
- display all data
- current holdings, holdings over time and aggregate. Hard-coded: news, weather goals
- edit assets link, log out link, profile link
- holdings service

edit <logged-in>

- /edit
- add/remove/edit assets
- add holding form, remove holding link + button confirm, edit assets amt input + button save
- holdings service
