const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const {database} = require('./keys');
const bodyParser = require('body-parser');

//initializations for express

const app = express();
require('./lib/passport');
//settings

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

app.set('view engine', 'hbs');
//middlewares
app.use(session({
    secret: 'faztmysqlnode',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
/*app.use(express.urlencoded({ extended: false}));
app.use(express.json());*/
app.use(passport.initialize());
app.use(passport.session());

//global variables
app.use((req,res,next) => {
    app.locals.success = req.flash('success');
    app.locals.smessage = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));
//Public
app.use(express.static(path.join(__dirname, 'public')));
// Starting the server
app.listen(app.get('port'),()=>{
    console.log('listening on port', app.get('port'));
});

