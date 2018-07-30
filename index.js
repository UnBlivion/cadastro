const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressMongoDb = require('express-mongo-db');

const app = express(); //cria daemon

//app.use conecta express e mongo conecta banco de dados "emails"
app.use(expressMongoDb('mongodb://localhost/emails'));
//cors cros origin resources share(conecta front e back)
app.use(cors());
//converse automaticamente as respostas em formato json
app.use(bodyParser.json());
// é pra servir o front end
app.use(express.static('static'));


//oq é endpoint - é o recurso disponibilizado pela api
//nomes emails -e o recurso disponibilizado pela api
//app.alguma coisa rest(get,post,put,delete)
//get obter ler, post escrever receber ,put cria,delete delete

//uri universe resource identifier, cada end poite tem q ter identificardor unico
//req fronte end mandou pra vc, res acesso a oq vai ser retornado
app.get('/emails', (req, res) => {
    //collection do mongo    find retorna sequencia de items em uma coleção, o toarray transforma em uma array de objetos    res.send envia de volta a lista cadastros
    req.db.collection('cadastros').find({}).toArray((err, cadastros) => {
        res.send(cadastros);
    });
});

app.get('/email/:nome', (req, res) => {
    if(!req.params.nome){
        return res.status(400).send({mensagem: "Nome e email são obrigatórios"});
    }
    //.findone retorna apenas 1     req.params.nome   
    req.db.collection('cadastros').findOne({nome: req.params.nome}, (err, cadastro) => {
        return res.send(cadastro);
    });
});

//post   n usa params, usa body
app.post('/email/cadastrar', (req, res) => {
    if(!req.body.nome || !req.body.email){
        //send devolte em formato json
        return res.status(400).send({mensagem: "Nome e email são obrigatórios"});
    }
    //insert cria
    req.db.collection('cadastros').insert(req.body, (err) => {
        console.log(err);
    });

    res.send({mensagem: 'Cadastro realizado com sucesso!'});
});

app.delete("/email/:nome",  (req, res) => {
    if(!req.params.nome){
        return res.status(400).send({mensagem: "Nome e email são obrigatórios"});
    }
    req.db.collection('cadastros').deleteOne({nome: req.params.nome}, err => {
        if(err){
            console.log(err);
        }
        else{
            return res.send({mensagem: "Usuário removido ocm sucesso"});
        }
    });
});

//inicia o daemon da aplicação
app.listen(3000, () => console.log('Aplicação iniciada.'));