require('dotenv').config();

const express = require('express');
const app = express();

//bando de dados mongoDB e Schema do mongoose
const mongoose = require('mongoose');
console.log('connecting with MongoDB: ...');
mongoose.connect(process.env.urlMongoDB)
    .then(() => {
        app.emit('isConnectedWithMongoDB');
    }).catch((error) => {
        console.log('connecting with MongoDB: Error', error);
    });

//salvando seção na memoria. check cookie do cliente.
const session = require('express-session');
const MongoStore = require('connect-mongo');
//msg rapidas tipo notification
const flash = require('connect-flash');

//mapeando as rotas
const routes = require('./routes')
const path = require('path');

//proteger o site de entrada externa
const helmet = require('helmet');
//proteção de formularios
const csrf = require('csurf');
const { meuMiddleware1, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');
app.use(helmet());

// tratar body do post de form 
app.use(express.urlencoded({ extended: true }));
// parse de json para dentro da aplicação
app.use(express.json());
// pastas publicas e estaticas
app.use(express.static(path.resolve(__dirname, 'public')));
//config de sessao
const sessionOptions = session({
    secret: 'textosecreto',
    store: new MongoStore({ mongoUrl: process.env.urlMongoDB }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
});
app.use(sessionOptions);
app.use(flash());

// views. simular frontend
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

//proteção para o site
app.use(csrf());

//ler meus middlewares
app.use(meuMiddleware1);
app.use(checkCsrfError);
app.use(csrfMiddleware);

// chamar rotas
app.use(routes);

app.on('isConnectedWithMongoDB', () => {
    //lista no terminal quando server é iniciado ou atualizado.
    app.listen(3000, () => {
        console.log('connected with MongoDB. Ok.');
        console.log('Server in ', __dirname);
        console.log('Executando na porta 3000.');
        console.log('http://localhost:3000');
    });
});
