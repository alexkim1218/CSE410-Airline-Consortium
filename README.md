# CSE410 - Airline Consortium
By Alex Kim & ChoongLiang Tan

**Before you start, make sure you installed MongoDB, Node.js and Ganache.
In addition, make sure you installed MetaMask on your web browser.
If you're not using WebStorm, only apply to IDE and Terminal.**

Starting truffle 
================
1. start Ganache.
2. cd into ballot-contract.
3. first ```truffle migrate --reset```
4. then ```truffle migrate ```

Starting server
===============

1. cd into the project directory and then into ballot-app using Terminal.
2. Then, type ```node index.js```.
3. If the port is in use, change to other port. Or else, you should see

```
Server started on port 3000
MongoDB connected
```

4. Now the server is running. To access pages, open any web browser and type:
For example, for Port Number 3000, ```localhost:3000```.
5. Lastly, press Control + c to terminate the server.

if you ran into metamask related issue, an account reset would most likely to fix the issue.
