const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// const redis = require('socket.io-redis');
const users = require('./users')();
const cryptoJS = require('crypto-js');

// io.adapter(redis({ host: 'localhost', port: 6379 }));

// const key = cryptoJS.MD5('rooms-security').toString();
function createObjForMsg(name, text, id, type, avatar) {
    return {
        name, 
        // text: cryptoJS.AES.encrypt(text, key).toString(), 
        text,
        id, 
        type, 
        avatar
    }
};
const adminNickname = 'AdminBot'; //cryptoJS.AES.encrypt('AdminBot', key).toString();
const adminAvatar = 'https://purepng.com/public/uploads/medium/purepng.com-anonymous-maskanonymous-maskfawkesgunpowder-plored-cheeksguy-fawkes-mask-1421526668310teu48.png'



io.on('connection', socket => {
    /**
     * Новый пользователь
     */
    socket.on('userJoined', (dataUserFront, cb)=> {
        if(!dataUserFront.name || !dataUserFront.room){
            return cb('fail data')
        }
        const countUserInRoomNow = users.getByRoom(dataUserFront.room).length;
        const KEY = cryptoJS.MD5(dataUserFront.room).toString();


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
                socket.emit('newMessage', createObjForMsg(
                        adminNickname, 
                        `${dataUserFront.name}, welcome to room: ${dataUserFront.room}.`, 
                        socket.id, 
                        'received', 
                        adminAvatar)
                    );
            },1000)
        
        socket.broadcast
            .to(dataUserFront.room)
            .emit('newMessage', createObjForMsg(
                adminNickname, 
                `${dataUserFront.name} in room `, 
                socket.id, 
                'received', 
                adminAvatar))
    })
    /**
     * Обработчик сообщений пользователей
     */
    socket.on('createMessage', (data, cb) => {
        const user = users.get(data.id);
        if (!data.text){
            return cb('empty text');
        }
        // console.log(data);
        const message = {
            name: cryptoJS.AES.encrypt(user.name, user.room).toString(),
            text: data.text,
            id: data.id,
            type: 'received',
            avatar: 'https://angliya.com/wp-content/uploads/2017/08/30445655_l-2.jpg'
        }
        if (user) {
            io.to(user.room).emit('newMessage', message);
        }
        cb()
        
    })

    /**
     * Пользователь вышел сам
     */
    socket.on('userlogout', (id, cb) => {
        const user = users.remove(id);
        if (user) {
            let usersList = users.getByRoom(user.room);
            if(user.isAdmin === true){
                let newAdmin = usersList.shift();
                newAdmin.isAdmin = true;
                usersList.unshift(newAdmin);
            }
            io.to(user.room).emit('updateUsersList', usersList)
            io.to(user.room).emit('newMessage', createObjForMsg(adminNickname, `${user.name} logged out`, user.id, 'received', adminAvatar))
        }
        cb()
    })
    /**
     * Пользоавптель отключился
     */
    socket.on('disconnect', () => {
        const user = users.remove(socket.id)
        if (user) {
            let usersList = users.getByRoom(user.room);
            if(user.isAdmin === true){
                let newAdmin = usersList.shift();
                newAdmin.isAdmin = true;
                usersList.unshift(newAdmin);
            }
            io.to(user.room).emit('updateUsersList', usersList)
            io.to(user.room).emit('newMessage', createObjForMsg(adminNickname, `${user.name} logged out`, socket.id, 'received', adminAvatar))
        }
    })
})

module.exports = { app, server }