const Login = require('../models/login_model');
exports.index = (req, res) => {
    console.log('login/index: req.session.user = ',req.session.user);
    if(req.session.user) return res.render('login-logado');
    res.render('login');
};

exports.register = async function (req, res) {
    console.log('iniciando register...');
    try {
        const login = new Login(req.body);
        await login.register();
        console.log(login.erros);
        if (login.erros.length > 0) {
            req.flash('erros', login.erros);
            req.session.save(function () {
                return res.redirect('/login/index');
            });
            return;
        }
        req.flash('success', 'Usuario criado com sucesso');
        req.session.save(function () {
            return res.redirect('back');
        });

    } catch (error) {
        console.log(error);
        res.render('404');
    }

};

exports.login = async function (req, res) {
    console.log('iniciando login...');
    try {
        const login = new Login(req.body);
        await login.login();
        console.log(login.erros);
        if (login.erros.length > 0) {
            req.flash('erros', login.erros);
            req.session.save(function () {
                return res.redirect('back');
            });
            return;
        }
        req.flash('success', 'Usuario logado.');
        req.session.user = login.user;
        req.session.save(function () {
            return res.redirect('back');
        });

    } catch (error) {
        console.log(error);
        res.render('404');
    }

};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};