# CSE410 - Airline Consortium
By Alex Kim & ChoongLiang Tan

**Before you start, make sure you installed MongoDB and Node.js.
If you're not using WebStorm, only apply to IDE and Terminal.**

Starting server
===============

1. cd into the project directory using Terminal.
2. Then, type ```node app.js```.
3. If the port is in use, change to other port. Or else, you should see

```
Server started on port 3000
MongoDB connected
```

4. Now the server is running. To access pages, open any web browser and type:
For example, for Port Number 3000, ```localhost:3000```.
5. Lastly, press Control + c to terminate the server.

Accessing database
==================

1. Type ```mongo``` to enter mongo shell using Terminal.
2. Then, type ```use blockchain_market```.
3. You should see that you're switched to the right database.
4. Type ```db.users.find()``` to check the list of registered users.
5. Then, you're good to go.
