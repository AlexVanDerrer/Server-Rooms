
const consola = require('consola')
const { app, server}  = require('./src/index')

const port = 3000;

function start(){

    server.listen(port, (error) => {
        if (error) { 
            return consola.error(new Error(error)); 
        }

        consola.ready({
            message: `Server listening port: ${port} `,
            badge: true
        })
    })

}

start();