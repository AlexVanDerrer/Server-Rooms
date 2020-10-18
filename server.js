
const consola = require('consola')
const { app, server}  = require('./src/index')

const port = 3000;

function start(){

    server.listen(port, () => {
        consola.ready({
            message: `Server listening port: ${port} `,
            badge: true
        })
    })

}

start();