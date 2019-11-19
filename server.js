// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Add mongoose
var mongoose = require('mongoose');
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.json());

// const flash = require('express-flash');
// app.use(flash());

// Use native promises
// mongoose.Promise = global.Promise;

//CONFIG
app.use(express.urlencoded({extended: true})); // this allows us to access POST data by extractubg it out of the requst obj.

app.use(express.json());
app.use(express.static(__dirname + "/static"));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// DATABASE: this connects Mongoose to MongoDB
mongoose.connect('mongodb://localhost/restful_tasks', {useNewUrlParser: true});

// Sample Schema
var TaskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, default: ''},
    completed: {type: Boolean, default: false}}
    // created_at: {type: String, default: Date.now},
    // updated_at: {type: String, default: Date.now}},
    ,{timestamps: true}
);

var Task = mongoose.model('Task', TaskSchema);

//ROUTES

// RETRIEVE ALL TASKS
// app.get('/', (req, res) => {
//     res.json('index')
// });

app.get('/tasks', (req, res) => {
    all_tasks = Task.find({})
        .then(task => {
            // console.log("SUCCESS", all_tasks), //you do not want to see the entire DB printed
            res.json({tasks:task})
        })
        .catch(err =>{ 
            console.log("ERROR SOMETHING WENT WRONG", err), 
            res.json({error:err})
        })
});

// RETRIEVE A TASK BY ID
app.put('/tasks/:id', (req, res) => {
    User.findOne({_id: req.params.id})
    .then(user => {
        res.json({user:user});
    })
    .catch(err => {
        console.log("We have an error!"),
        res.json({error: err})
    });
});

//CREATE A TASK
app.post('/tasks', (req, res) => {
    var task = new Task();
    task.title = req.body.title;
    task.description = req.body.description;
    task.save()
        .then(newTaskData => {
            console.log('New DB entry: ', newTaskData), res.json({newTaskData})
        })
        .catch(err => {
            console.log("We have an error!", err);
            // for (var key in err.errors) {
            //     req.flash('registration', err.errors[key].message);
            // }
            res.json({error: err});
        });
});

//     var user = new User({name: req.params.name});
//     user.save()
//         // .then(data =>  res.render('quotes', {dataBase: data}))
//         .then(newUserData => {
//             console.log('New DB entry: ', newUserData), 
//             res.redirect('/')}
//         )
//         .catch(err => {
//             console.log("We have an error!", err);
//             res.redirect('/');
//         });
//     console.log(user);


//UPDATE A TASK BY ID
app.put('/tasks/:id/', (req, res) => {
    console.log("UPDATING")
    User.findOneAndUpdate({_id: req.params.id}, {
        title : req.body.title,
        description : req.body.description,
    })
    .then(updatedTask => {
        console.log(updatedTask.title + " has been updated."),
        res.redirect('/tasks');
    })
    .catch(err => {
        console.log("This task does not exist"),
        res.json({error: err})
    })
});

//DELETE A TASK BY ID
app.delete('/remove/:id/', (req, res) => {
    console.log("DELETING")
    User.findOneAndRemove({_id: req.params.id})
        .then(deletedTask => {
            console.log(deletedTask.title + " has been removed."),
            res.redirect('/');
        })
        .catch(err => {
            console.log("This task does not exist"),
            res.json({error: err})
        })
});


app.listen(8000, () => {
    console.log("♡♡♡ listening on port 8000 ♡♡♡")
});
