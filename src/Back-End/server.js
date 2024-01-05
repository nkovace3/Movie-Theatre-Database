const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve front-end
app.use('/', express.static('../Front-End'));

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
