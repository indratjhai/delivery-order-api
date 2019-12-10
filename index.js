const app = require('./src/app');

app.listen(8080, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`); // eslint-disable-line no-console
});
