
//firebase config
var firebaseConfig = {

    apiKey: "AIzaSyAYdLO-v4Ty3aWmnqe7iXmzrCYgr7a1iWk",
    authDomain: "videochat-472a2.firebaseapp.com",
    projectId: "videochat-472a2",
    databaseURL: "https://videochat-472a2-default-rtdb.firebaseio.com",
    storageBucket: "videochat-472a2.appspot.com",
    messagingSenderId: "383505580197",
    appId: "1:383505580197:web:a26012cacf007a6e614d4c",
    measurementId: "G-ZM3GKPPZD5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db=firebase.firestore();
  db.settings({timestampsInSnapshots:true});


//world chat
const chatList = document.querySelector('#chat-list');
const form = document.querySelector('#add-chat-form');


let YourName = prompt('Enter Your Name');  
let RoomID = prompt('Enter your Room-ID');

// create element & render cafe
function renderchat(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let message = document.createElement('span');
    let time_display=document.createElement('span');
    let date_display=document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    message.textContent = doc.data().message;
    date_display.textContent = doc.data().time.toDate().toDateString();
    time_display.textContent = doc.data().time.toDate().toLocaleTimeString('en-US');
    cross.textContent = 'X';

    li.appendChild(name);
    li.appendChild(message);
    li.appendChild(time_display);
    li.appendChild(date_display);
    li.appendChild(cross); 
    

    chatList.appendChild(li);

    //deleting chat from wrold chat
    cross.addEventListener('click',async (e) => {
        e.stopPropagation();
        
        let id_val = e.target.parentElement.getAttribute('data-id');
        
        console.log(id_val);
        var docRef = db.collection("cities").doc('id_val');

        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        // await db.collection('chat').doc(`${id_val}`).get().then(funtion(doc){
        //     console.log(doc.data()),
        // }).catch(function(err) {console.log(err);});

            
            
            
                        

        console.log('id is = '+id_val);
        
        db.collection('chat').doc(id_val).delete();
        // (RoomID==db.collection.where('db.collection('chat').id','==','id_val').doc().id && YourName==db.collection.where('db.collection('chat')','==','id_val').doc().name) ? db.collection('chat').doc(id_val).delete() : prompt('you can only delete your own message of same room');
        
    });
}



// getting chats
// doc.collection('chat).get().then(snapshot => {
    
//     snapshot.docs.forEach(doc => {
//         renderchat(doc);
//     });
// });


// adding chat to world chat
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('chat').add({
        name : YourName,
        message : form.message.value,
        id : form.id.value=="" ? RoomID : form.id.value,
        time : firebase.firestore.Timestamp.now()

    });
    console.log('we added '+form.message.value + ' of id = ' + (form.id.value=="" ? RoomID : form.id.value));
    form.message.value = '';
    form.id.value = '';
});




// real-time data-base listener
db.collection('chat').orderBy('time','desc').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();  
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderchat(change.doc);
        } else if (change.type == 'removed'){
            let li = chatList.querySelector('[data-id=' + change.doc.id + ']'); 
            chatList.removeChild(li);
        }
    });
});