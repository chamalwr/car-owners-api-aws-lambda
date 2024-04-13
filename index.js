// index.js
'use strict';

const { app } = require('./handler');

app.listen(Number(process.env.APPLICATION_PORT), () => {
    console.info(`Listening on port ${process.env.APPLICATION_PORT}.`);
});
