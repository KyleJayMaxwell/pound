// *** main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var pg = require('pg');

// *** database *** //
var connectionString = 'postgres://localhost:5432/pound';


// *** express instance *** //
var app = express();


// *** view engine *** //
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');


// *** static directory *** //
app.set('views', path.join(__dirname, 'views'));


// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));


// *** main routes *** //
// return all puppies
app.get('/api/puppies', function(req, res, next) {

  var responseArray = [];
  
  pg.connect(connectionString, function(err, client, done) {

    if(err) {
      // status code
      // message
      res.status(500)
        .json({
          status: 'error',
          message: 'Something bad happened'
        });
      done();
    }

    // query the database
    var query = client.query('SELECT * FROM puppies');

    //get all rows
    query.on('row', function(row) {
      responseArray.push(row);
    });

    query.on('end', function(){
      res.json(responseArray);
      done();
    });

    pg.end();

  });

});

// return a SINGLE puppy
app.get('/api/puppy/:id', function(req, res, next) {

  var responseArray = [];
  
  pg.connect(connectionString, function(err, client, done) {

    if(err) {
      // status code
      // message
      res.status(500)
        .json({
          status: 'error',
          message: 'Something bad happened'
        });
      done();
    }

    // query the database
    var query = client.query('SELECT * FROM puppies WHERE id ='+req.params.id);

    //get all rows
    query.on('row', function(row) {
      responseArray.push(row);
    });

    query.on('end', function(){
      res.json(responseArray);
      done();
    });

    pg.end();

  });

});


// return a SINGLE puppy
app.post('/api/puppies', function(req, res, next) {

  var newPuppy = req.body;

  var responseArray = [];
  
  pg.connect(connectionString, function(err, client, done) {

    if(err) {
      // status code
      // message
      res.status(500)
        .json({
          status: 'error',
          message: 'Something bad happened'
        });
      done();
    }

    // query the database
    var query = client.query("INSERT INTO puppies (name, breed, age, sex, alive) VALUES ('" + newPuppy.name + "' , '" + newPuppy.breed + "' , " + newPuppy.age + " , '" + newPuppy.sex + "' , " + newPuppy.alive + ');' );

    query.on('end', function(){
      res.json({statu: 'success', message: 'Inserted new puppy into pound!'});
      done();
    });

    pg.end();

  });

});

// remove a SINGLE puppy
app.delete('/api/puppies/:id', function(req, res, next) {
  
  pg.connect(connectionString, function(err, client, done) {

    if(err) {
      // status code
      // message
      res.status(500)
        .json({
          status: 'error',
          message: 'Something bad happened'
        });
      done();
    }

    // query the database
    var query = client.query("DELETE FROM puppies WHERE id ="+req.params.id);

    query.on('end', function(){
      res.json({status: 'success', message: 'Puppy Gone'});
      done();
    });

    pg.end();

  });

});

// update a SINGLE puppy
app.put('/api/puppies/:id', function(req, res, next) {

  // UPDATE table SET column='value'
  
  pg.connect(connectionString, function(err, client, done) {

    if(err) {
      // status code
      // message
      done();
      return res.status(500)
        .json({
          status: 'error',
          message: 'Something bad happened'
        });
    }

    // query the database
    var query = client.query("UPDATE puppies SET "+ req.body.column +"= '"+ req.body.value +"' WHERE id ="+req.params.id);

    query.on('end', function(){
      res.json({statu: 'success', message: 'Changed'});
      done();
    });

    pg.end();

  });

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
