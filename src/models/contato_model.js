const mongoose = require('mongoose');
const validator = require('validator');
const ContatoSchema = new mongoose.Schema({
    apelido: { type: String, required: true },
    nome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
    this.body = body;
    this.erros = [];
    this.contato = null;
}
Contato.prototype.register = async function () {
    this.valida();
    if (this.erros.length > 0) {
        return;
    }
    this.contato = await ContatoModel.create(this.body);
}

Contato.prototype.valida = function () {
    this.cleanUp();
    if (!this.body.apelido) {
        this.erros.push('Apelido é obrigatorio.');
    }
    if (this.body.email && !validator.isEmail(this.body.email)) {
        this.erros.push('Email inválido.');
    }
    if (!this.body.email && !this.body.telefone) {
        this.erros.push('Falta email e telefone. Informe pelo menos um contato');
    }
}
Contato.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }
    this.body = {
        apelido: this.body.apelido,
        nome: this.body.nome,
        email: this.body.email,
        telefone: this.body.telefone,
    }
}
Contato.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;
    this.valida();
    if (this.erros.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
}
//Este metodo nao esta no prototipe
// ele pertence a classe e nao precisa de instancia. 
//é um metodo estatico.
Contato.buscaPorId = async function (id) {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findById(id);
    return contato;
}

Contato.buscaContatos = async function () {
    const contatos = await ContatoModel.find().sort({ criadoEm: -1 });
    return contatos;
}

Contato.deleteContato = async function (id) {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findByIdAndDelete(id);
    // const contato = await ContatoModel.findOneAndDelete({ _id: id });
    return contato;
}

module.exports = Contato;