const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const port = process.env.PORT

connectDB()

const app = express()

// Cross origin resource sharing
app.use(cors());

//built in middleware for json
app.use(express.json())
// built in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())

app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => res.send('Please set to production'))
}

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
