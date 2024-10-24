const express = require('express') // commonjs module syntax
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const path = require('path')
const PORT = process.env.PORT || 3000

// Connect to database
connectDB()

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

// Routes endpoints
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
  // Set build folder as static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Support Desk API' })
  })
}

app.use(errorHandler)

/**
 * app.listen()
 * Starts a UNIX socket and listens for connections on the given path.
 * This method is identical to Node’s http.Server.listen().
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
