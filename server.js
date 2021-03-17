require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const db = require('_helpers/db');
const clicks = db.Clicks
const userService = require('./users/user.service');
const io = require('socket.io')(http);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));

io.on('connection', (socket) => {

  socket.emit('connections', Object.keys(io.sockets.connected).length);

  socket.on('disconnect', () => {
      console.log("A user disconnected");
  });

  socket.on('chat-message', (data) => {
      socket.broadcast.emit('chat-message', (data));
  });

  socket.on('typing', (data) => {
      socket.broadcast.emit('typing', (data));
  });

  socket.on('stopTyping', () => {
      socket.broadcast.emit('stopTyping');
  });

  socket.on('joined', (data) => {
      socket.broadcast.emit('joined', (data));
  });

  socket.on('leave', (data) => {
      socket.broadcast.emit('leave', (data));
  });

});

// app.post('/clicked', (req, res) => {
//     const click = {clickTime: new Date(), test:'test123'};
//     console.log(click);

//     console.log(clicks);
  
//     clicks.save(click, (err, res) => {
//       if (err) {
//         return console.log(err);
//       }
//       console.log('click added to db');
//       res.sendStatus(201);
//     });
//   });

// app.put('/users/active-status/:id', (req, res, next) => {
//   const userId= req.params.id;
//   const status = req.params.activeStatus

//   // then find the user and set the is_active status to status variable

//   next();
// });
 

// app.get('/users-count', (req, res, next) => {
//   userService.getCount()
//         .then(numUsers => res.json(numUsers))
//         .catch(err => next(err));
// })

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
