const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const userS = [], userI = [];
// const ExpressPeerServer = require('peer').ExpressPeerServer;
// const peerServer = ExpressPeerServer(server, {
//   debug: true
// });

// // server.listen(3000, () =>{
// // 	console.log("Serving port 3000");
// // });

//app.use('/peerjs', peerServer); //peerjs server living in express and runing at different ports

app.set('view engine', 'ejs');
app.use(express.static('public'));




app.get('/', (req, res) =>{
	res.redirect(`/${uuidV4()}`);  //send uuid to client address bar 
 })

app.get('/:room', (req, res) =>{
	let addRoomId = req.params.room;
    console.log(addRoomId);
	res.render('room',{roomId: `${addRoomId}` }); //get id from address bar and send to ejs
})

io.on('connection', socket =>{
	//code to disconnect user using socket simple method ('join-room')
	socket.on('join-room',(roomId, userId) =>{
	
		userS.push(socket.id);
		userI.push(userId);
		//console.log("room Id:- " + roomId,"userId:- "+ userId);    //userId mean new user 
		
		//join Room
		console.log("room Id:- " + roomId,"userId:- "+ userId);    //userId mean new user 
		socket.join(roomId);                                       //join this new user to room
		socket.to(roomId).broadcast.emit('user-connected',userId); //for that we use this and emit to cliet	
		
		//Remove User
	    socket.on('removeUser', (sUser, rUser)=>{
	    	var i = userS.indexOf(rUser);
	    	if(sUser == userI[0]){
	    	  console.log("SuperUser Removed"+rUser);
	    	  socket.to(roomId).broadcast.emit('remove-User', rUser);
	    	}
	    });

		//code to message in roomId
		socket.on('message', (message,yourName) =>{
			io.to(roomId).emit('createMessage',message,yourName);
			
		})

	    socket.on('disconnect', () =>{
	    	//userS.filter(item => item !== userId);
	    	var i = userS.indexOf(socket.id);
	    	userS.splice(i, 1);
            socket.to(roomId).broadcast.emit('user-disconnected', userI[i]);
            //update array
           
            userI.splice(i, 1);
	    });
	    socket.on('seruI', () =>{
	    	socket.emit('all_users_inRoom', userI);
			//console.log(userS);
		    console.log(userI);
	    });  
	})
	
})

server.listen(3000, () =>{
	console.log("Serving port 3000")
});