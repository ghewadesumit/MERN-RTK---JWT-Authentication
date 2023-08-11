# Goalsetter MERN app

This is the goalsetter app from the [Learn the MERN Stack](https://www.youtube.com/watch?v=-0exw-9YJBo) series on YouTube.


## Usage

Rename the .envexample to .env and add your MONGO_URI


## How to generate encoded secret key

type ```node``` in the terminal. Which will bring up node terminal
type ```require('crypto').randomBytes(64).toString('hex')```
copy paste the generated code without quotes in the .env file.

### Install dependencies

```
# Backend deps
npm install

# Frontend deps
cd frontend
npm install
```

### Run Server

```
npm run server
```

## Demo

I am not sure how long this will be up

https://mernappbrad.herokuapp.com/
