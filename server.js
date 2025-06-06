const { createServer } = require('http');
const next = require('next');

const app = next({ 
  dev: false,
  dir: __dirname 
});

const handler = app.getRequestHandler();

app.prepare().then(() => {
  createServer(handler).listen(process.env.PORT || 3000, () => {
    console.log(`Ready on http://localhost:${process.env.PORT || 3000}`);
  });
});