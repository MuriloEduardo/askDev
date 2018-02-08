const functions   = require('firebase-functions');
const express     = require('express');
const cors        = require('cors');
const MP          = require('mercadopago');

express.application.prefix = express.Router.prefix = function (path, configure) {
  const router = express.Router();
  this.use(path, router);
  configure(router);
  return router;
};

const mp = new MP (functions.config().mercadopago.client_id, functions.config().mercadopago.client_secret);
const access_tokenMP = mp.getAccessToken((err, accessToken) => {
  return accessToken;
});

const app = express();
app.use(cors());

app.prefix('/pagamentos', pagamentos => {

  pagamentos.route('/preferencias/:id').get((req, res) => {
    mp.getPreference(req.params.id).then(data => {
      res.json(data);
    });
  });

  pagamentos.route('/preferencias').post((req, res) => {
    mp.createPreference(req.body).then(data => {
      res.json(data);
    });
  });

  pagamentos.route('/clientes').post((req, res) => {
    mp.post('/v1/customers', req.body).then(data => {
      res.json(data);
    })
  });

  pagamentos.route('/clientes/search/:email').get((req, res) => {
    mp.get('/v1/customers/search', {
      'email': req.params.email
    }).then(data => {
      res.json(data);
    })
  });

  pagamentos.route('/clientes/:id/card').get((req, res) => {
    mp.get('/v1/customers/search', {
      'email': req.params.email
    }).then(data => {
      res.json(data);
    })
  });

  pagamentos.route('/users/:user_id/balance').get((req, res) => {
    mp.get ('/users/' + req.params.user_id + '/mercadopago_account/balance')
      .then(data => {
        res.json(data);
      })
  });
});

exports.api = functions.https.onRequest(app);
