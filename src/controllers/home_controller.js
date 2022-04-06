const Contato = require('../models/contato_model');

exports.index = async (req, res) => {
    console.log('home/index: req.session.user = ', req.session.user);
    const contatos = await Contato.buscaContatos();
    res.render('index', { contatos });
};
