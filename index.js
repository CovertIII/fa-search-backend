const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors')
const { searchList } = require('./search.js');

const port = process.env.PORT || 3005;

const main = async () => {

  if(process.env.NODE_ENV === 'production'){
    app.enable('trust proxy');
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }

  app.use(cors());

  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));

  app.get('/search', (req, res) => {
    const term = req.query.term;
    const delay = req.query.delay === 'true';
    if(term === 'error') {
      res.status(500);
      return res.json({title: 'Fake server error'});
    }
    return searchList(term).then( result => {
      if(delay) {
        const delayTime = result.length * 20;
        setTimeout(() => {
          res.json(result);
        }, delayTime);
      } else {
        res.json(result);
      }
    }).catch( e => {
      res.status(500);
      res.json({
        detail: e.message,
        title: 'Server error',
        type: 'Internal Server error'
      });
    });
  });

  app.listen(port, () => {
    console.log('Express server listening on port ' + port);
  });
};

main();
