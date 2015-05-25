Server side
========
The server for Tank Anarchy is based on NodeJS and Socket.IO. Here, objects
are maintained as classes and JSON Objects. Game updates happen in the game
loop in server.js but all methods for updating objects are defined in the
respective object.

Util.js and Constants.js hold global constants about the game environment
across the server.

All other classes are self-explanatory by their name.

&copy; Copyright 2015 Alvin Lin and Kenneth Li
