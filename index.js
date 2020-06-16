const path = require('path');
const express = require('express');
const app = express();
const { searchList } = require('./search.js');

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

  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));
  const port = process.env.PORT || 3005;

  app.get('/search', (req, res) => {
    const term = req.query.term;
    return searchList(term).then( result => {
      res.json(result);
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
