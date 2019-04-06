var Express = require('express');
var proxy = require('express-http-proxy');
let App = Express();

//static files
App.use(Express.static('html'));

//reverse proxy
App.use('/hlf1', proxy('localhost:3001/')); //Donor 
App.use('/hlf2', proxy('localhost:3002/')); //Regulator
App.use('/hlf3', proxy('localhost:3003/')); //Charity
App.use('/hlf4', proxy('localhost:3000/')); //Beneficiary

let port = process.env.PORT || 8001;
App.listen(port, () => console.log(`Server listening on port ${port}!`))
