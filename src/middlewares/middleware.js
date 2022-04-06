function meuMiddleware1(req, res, next) {
    res.locals.erros = req.flash('erros');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
};
function checkCsrfError(error, req, res, next) {
    if (error) {
        console.log('error = ', error);
        return res.render('404');
    }
    next();
}
function csrfMiddleware(req, res, next) {
    res.locals.csrfToken = req.csrfToken()
    next();
}

function loginRequired(req, res, next) {
    if (!req.session.user) {
        req.flash('erros', 'Usuario não logado. Faça login.');
        req.session.save(() => res.redirect('/'));
        return;
    }
    next();
}

module.exports = {
    loginRequired,
    meuMiddleware1,
    checkCsrfError,
    csrfMiddleware
};

