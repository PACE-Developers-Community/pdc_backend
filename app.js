const mongoose = require('mongoose');
 const connectMongo = require('./db/conn');
 const express = require('express');
 var cors = require('cors')
 const app = express()

app.use(cors())

connectMongo();


 const port = 5000
 
 app.use(express.json())

 //available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


 app.get('/', (req, res) => {
   res.send('Hello World!')
 })

 app.listen(port, () => {
   console.log(`note app server listening on port ${port}`)
 })


