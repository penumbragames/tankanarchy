Tank Anarchy
========
Tank Anarchy is an online multiplayer tank battle arena game that takes place
in a single large world. Anyone who logs on can battle anyone else that's online at the same time.

Technical:
  - Made with NodeJS and Socket.IO
  - No game information is stored client-side. All calculations are managed on 
  the server.
  - The states of all the objects are all instantiated, updated, and managed
  server side.
  - The client merely sends intents to the server, which are processed. The
  server returns a series of JSON Objects that preserve the state of the world
  to each client.

&copy; 2015 Kenneth Li and Alvin Lin
