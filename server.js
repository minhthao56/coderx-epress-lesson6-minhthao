// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
const upload = multer() // for parsing multipart/form-data
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')

var adapter = new FileSync('db.json')
var db = low(adapter)
db.defaults({ todos:[]}).write()


app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.render('index',{name:'Minh Thao'});
});


app.get('/todos', (request, response) => {
  response.render('todos/index',{
    todos: db.get("todos").value()
  });
});


app.get ('/todos/search', function(request, response){
  var q = request.query.q;
  var filterlisttodo = db.get("todos").filter(function(todo){
    var lowercase = todo.text.toLowerCase();
     return lowercase.indexOf(q) !==-1;
  }).write();
  console.log(filterlisttodo );
  response.render('todos/index',{
    todos: filterlisttodo
  });
});

app.get('/todos/create', function(request, response){
  response.render('create/index')
})
app.post('/todos/create', function(request, response){
  db.get('todos').push(request.body).write()
  response.redirect('/todos')
})




// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
