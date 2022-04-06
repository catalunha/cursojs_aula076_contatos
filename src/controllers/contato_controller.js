const Contato = require('../models/contato_model');
exports.index = (req, res) => {
    console.log('contato/index: req.session.user = ', req.session.user);
    // res.send('contatos');
    res.render('contato', { contato: {} });
};
exports.register = async (req, res) => {
    try {

        console.log('contato/register: req.session.user = ', req.session.user);
        const contato = new Contato(req.body);
        await contato.register();

        if (contato.erros.length > 0) {
            req.flash('erros', contato.erros);
            req.session.save(() => { res.redirect('/contato/index') })
            return;
        }
        req.flash('success', 'Contato registrado com sucesso');
        req.session.save(() => { res.redirect(`/contato/index/${contato.contato._id}`) })
        return;
        // res.send('register');
        // res.render('contato');
    } catch (error) {
        console.log('contato/register: error = ', error);
        return res.render('404');
    }
};

exports.editIndex = async function (req, res) {
    if (!req.params.id) { return res.render('404'); }
    const contato = await Contato.buscaPorId(req.params.id);
    if (!contato) { return res.render('404'); }
    res.render('contato', { contato });
};

exports.edit = async function (req, res) {
    try {
        if (!req.params.id) { return res.render('404'); }
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);
        if (contato.erros.length > 0) {
            req.flash('erros', contato.erros);
            req.session.save(() => { res.redirect('/contato/index') })
            return;
        }
        req.flash('success', 'Contato editado com sucesso');
        req.session.save(() => { res.redirect(`/contato/index/${contato.contato._id}`) })
        return;
    } catch (error) {
        console.log('contato/edit: error = ', error);
        return res.render('404');
    }

};

exports.delete = async function (req, res) {
    if (!req.params.id) { return res.render('404'); }
    const contato = await Contato.deleteContato(req.params.id);
    if (!contato) res.render('404');
    req.flash('success', 'Contato apagado');
    req.session.save(() => res.redirect('/'));
    return;
};