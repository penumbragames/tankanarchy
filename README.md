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
  (Requires npm, bower and gulp should be installed globally on your system)
  ```
  git clone https://github.com/tankanarchy/tankanarchy.git
  npm install
  bower install
  ```
  
# Contributing:
  - Fork this repository and set it up on your computer.
  - Commit to your own fork and send a pull request to the master repository.
  - Your code will be reviewed and must be approved before it is merged.
  - Please use our convention of **2 space tabs that are space characters and
  not tab characters**. Document any code that you write.

&copy; 2015 Kenneth Li and Alvin Lin
