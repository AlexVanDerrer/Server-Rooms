const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const users = require('./users')();
const crypto = require('./crypto')();

const m = (name, text, id, type, avatar) => ({name, text: crypto.encryptData(text), id, type, avatar})

const adminAvatar = 'https://purepng.com/public/uploads/medium/purepng.com-anonymous-maskanonymous-maskfawkesgunpowder-plored-cheeksguy-fawkes-mask-1421526668310teu48.png'



io.on('connection', socket => {
    socket.on('userJoined', (dataUserFront, cb)=> {
        if(!dataUserFront.name || !dataUserFront.room){
            return cb('fail data')
        }
        const countUserInRoomNow = users.getByRoom(dataUserFront.room).length;

        socket.join(dataUserFront.room);
        users.remove(socket.id)

        users.add({
            id: socket.id,
            name: dataUserFront.name,
            room: dataUserFront.room,
            isAdmin: countUserInRoomNow > 0? false : true
        })

        cb({userId: socket.id});
        io.to(dataUserFront.room).emit('updateUsersList', users.getByRoom(dataUserFront.room))
        setTimeout(()=> {
            socket.emit('newMessage', m('AdminBot', `${dataUserFront.name}, welcome to room: ${dataUserFront.room}`, socket.id, 'received', adminAvatar));
        },1000)
        
        socket.broadcast
            .to(dataUserFront.room)
            .emit('newMessage', m('AdminBot', `${dataUserFront.name} in room `, socket.id, 'received', adminAvatar))
    })

    socket.on('createMessage', (data, cb) => {
        if (!data.text){
            return cb('empty text');
        }
        const user = users.get(data.id);
        if (user) {
            io.to(user.room).emit('newMessage', m(user.name, data.text, data.id, 'received', 'https://angliya.com/wp-content/uploads/2017/08/30445655_l-2.jpg'))
        }
        cb()
        
    })

    socket.on('userlogout', (id, cb) => {
        const user = users.remove(id)
        if (user) {
            io.to(user.room).emit('updateUsersList', users.getByRoom(user.room))
            io.to(user.room).emit('newMessage', m('AdminBot', `${user.name} logged out`, user.id, 'received', adminAvatar))
        }
        cb()
    })

    socket.on('disconnect', () => {
        const user = users.remove(socket.id)
        if (user) {
            io.to(user.room).emit('updateUsersList', users.getByRoom(user.room))
            io.to(user.room).emit('newMessage', m('AdminBot', `${user.name} logged out`, socket.id, 'received', adminAvatar))
        }
    })
})

module.exports = { app, server }