# Tank Anarchy
Tank Anarchy is an online multiplayer tank battle arena game that takes place
in a single large world. Anyone who logs on can battle anyone else that's online at
the same time.

# Technical:
  - Made with NodeJS and Socket.IO
  - The states of all the objects are all instantiated, updated, and managed
  server side. All calculations are done server side.
  - The client merely sends intents to the server, which are processed. The
  server returns a series of JSON objects that hold the state of the world to
  the client for rendering.
  - The server holds authoritative determination over the positions and states
  of all the objects.

# Setting Up:
  This project requires node version 6.0.0 or greater. We recommend using
  nvm to manage your node versions.
  npm, bower and gulp should be installed globally on your system.
  ```
  npm install
  bower install
  gulp
  ```
  The project Gulpfile already has a few custom processes to run.  
  ```bash
  gulp            # will compile the JS and LESS assets

  gulp lint       # will lint the JS assets

  gulp js         # will lint and compile the JS assets

  gulp less       # will compile the LESS assets

  gulp watch      # will watch the JS and LESS assets and compile them when
                  # they are modified, recommended during development

  gulp watch-js   # will only watch the JS assets

  gulp watch-less # will only watch the LESS assets
  ```

# Contributing:
  - Fork this repository and set it up on your computer.
  - Commit to your own fork and send a pull request to the master repository.
  - Search for TODOs using git grep.
  - Note that only compiled sources are exposed on the server but are not
  committed to this repository. Do not commit compiled sources (/public/dist).
  - Your code will be reviewed and must be approved before it is merged.
  - `gulp js` should not throw any errors in your code.
  - Please use our convention of **2 space tabs that are space characters and
  not tab characters**.
  - Document any code that you write using Google's JSDOC conventions.

# Creators:
  - Alvin Lin (omgimanerd)
  - Kenneth Li (noobbyte)

&copy; 2015 Penumbra Games
