const express = require('express');
const path = require('path');
const exmHb = require('express-handlebars');
const homeRouter = require('./routes/home');
const addRouter = require('./routes/add');
const coursesRouter = require('./routes/courses');
const cardRout = require('./routes/card');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const User = require('./models/user');
const OrdersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const keys = require('./keys');
const errorPage = require('./middleware/error');
const profPage = require('./routes/profile');
const fileMiddleware = require('./middleware/file');
const helmet = require('helmet');
const compression = require('compression');


//E60jGeFR3eXPqsk3

const store = new MongoStore({
    collection: 'session',
    uri: keys.MONGODB_URI
});

const port = process.env.PORT ?? 3000;


const app = express();

//Настройка handlebars
const hbs = exmHb.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(fileMiddleware.single('avatar'));
app.use(helmet());
app.use(compression());
// app.use(csurf());
app.use(flash());
app.use((req, res, next) => {
    res.locals.isAuth = req.session.isAuthenticated;
    next();
});
app.use(async (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    req.user = await User.findById(req.session.user._id);
    next();
});




app.use('/', homeRouter);
app.use('/add', addRouter);
app.use('/courses', coursesRouter);
app.use('/card', cardRout);
app.use('/orders', OrdersRouter);
app.use('/auth', authRouter);
app.use('/profile', profPage);


app.use(errorPage);

async function start() {

    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useFindModify: false
        });
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);

        });
    } catch (e) {
        console.log(e);
    }
}

start();