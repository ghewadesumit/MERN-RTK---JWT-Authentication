const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const port = process.env.PORT;
const path = require('path');

console.log('port is',port);

connectDB()

const app = express()

// use is like middleware and anything below app.use will first trigger app.use and then following 
// api call will get triggered.
// add your frontend application here
const whiteList = ['https://www.google.com','http://localhost:5000','https://www.yutube.com'];
const corsOptions = {
    origin: (origin,callback)=>{
      console.log(origin);
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null,true);
        }else{
            callback(new Error('I dont know you so not allowing you.. - cors'));
        }
    },
    optionsSuccessStatus:200
}

// Cross origin resource sharing
app.use(cors(corsOptions));

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
  console.log('developement')
  app.get('/', (req, res) => res.send('Please set to production'))
}

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
