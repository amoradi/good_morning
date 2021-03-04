# Final Back-End Project
The project to be something that you are passionate about building.

Think about:

cryptovest.aaronmoradi.com

- I want to know how my crypto is doing
  - NOW => crypto holdings: bump and waffle charts: https://medium.com/s/story/ five-unusual-alternatives-to-pie-charts-389cc4676974
    - bump chart for coin rank
    - waffle chart for agg view and total in dollars
  - IN THE CONTEXT OF TIME (PAST TO NOW): graph portfolio over time
    - show the whole (total worth in $)
    - run a chron job every day graph the porfolio.
      - would be nice to know TOT + BTC (10%) VET (12%) etc.
  - use CW's rest API: https://docs.cryptowat.ch/rest-api/
- what's the latest vid content from bitboy/alt coin daily

Portfolio of current Crytpo holdings

Project Requirements:
- Build the application using Node.js and Express
- Persist data for your application using a PostgreSQL database
  - instrument?/assets? table
    - symbol <string>
    - name <string>
    - amount_owned <decimal>
    - category??
  - portfolio over time table
    - total <number>
    - asset, % of TOT <string, number> tuple
- Version control your application with Git and host the repository on GitHub
- Use a project management tool (GitHub Projects, Trello, etc.) to plan your work
- Write a README (using Markdown) that documents your project including:
  - Technologies used
  - Features
  - Future work
  - Any other relevant documentation for people to use your app

Write unit tests for your service methods

Document your back-end API with Swagger
  - POST asset
  - EDIT
  - DELETE
Authenticate users to manage their access to parts of the application
Host your app online so users can access it from a URL
Handle errors gracefully and return clear response codes

OPTIONAL: Create a front-end that adds a user interface to your API
OPTIONAL: Get a custom domain name and use it for your application
OPTIONAL: Set up a CI/CD workflow to automatically deploy your application when the master branch in the repository changes