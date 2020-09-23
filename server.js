const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000})

server.on('connection', ws => {
    console.log('Server Start');
    ws.on('message', message => {
        if(message === '/kill'){
            ws.close();
        } else {
            server.clients.forEach(client => {
                if(client.readyState === WebSocket.OPEN){
                    client.send(message);
                }
            });
        }
    })
    ws.send('Welcom to Old School Chat! :) <br> > to kill connect enter > /kill <br> * * * * * * * * * * * * * * * *');
})