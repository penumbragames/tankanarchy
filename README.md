# Tank Anarchy
Tank Anarchy is an online multiplayer tank battle arena game that takes place
in a single large world. Anyone who logs on can battle anyone else that's online at
the same time.

Technical:
  - Made with NodeJS and Socket.IO
  - The states of all the objects are all instantiated, updated, and managed
  server side. All calculations are done server side.
  - The client merely sends intents to the server, which are processed. The
  server returns a series of JSON objects that hold the state of the world to
  the client for rendering.
  - The server holds authoritative determination and the client does not use
  prediction/reconciliation.

&copy; 2015 Kenneth Li and Alvin Lin
