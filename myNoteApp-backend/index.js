const express = require('express')
const connectToMongo = require('./db');
const authRoute = require('./routes/auth');
const noteRoute = require('./routes/notes');
const app = express()
const cors = require('cors')
const port = 8000

connectToMongo();

app.use(cors())
app.use(express.json())
// Available Routes 
app.use('/api/auth', authRoute);
app.use('/api/note', noteRoute);

// Start The Server 
app.listen(port, () => {
  console.log(`MyNoteApp Backend listening at http://localhost:${port}`)
})