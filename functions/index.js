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

const mp = new MP ('5409116096828326', '9TtUxaqpZEZYtMrPrDtjuPUKCp6HGRPN');

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
});

exports.api = functions.https.onRequest(app);
