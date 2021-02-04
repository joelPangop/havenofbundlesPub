const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
app.use(express.static(__dirname + "/dist"));
app.listen(port);
console.log('server is runing!');
