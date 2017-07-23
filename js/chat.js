var config = {
  apiKey: "AIzaSyCgOmb-Ik5rG0z_Ut5wAe9iYf2cYXrVswc",
  authDomain: "firechat2-7189d.firebaseapp.com",
  databaseURL: "https://firechat2-7189d.firebaseio.com/",
  projectId: "firechat2-7189d",
  storageBucket: "",
  messagingSenderId: "1502928649717827"
};
firebase.initializeApp(config);

var user = "";

var scrollDown = ()=>{
    var messagesDiv = document.getElementById("messages");
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

document.addEventListener("keydown", function(e) {
     if (e.keyCode === 13)
         sendMessage(user);
     }
 );

function sendMessage(user) {
    firebase.database().ref().push({
        user: user.displayName,
        message: $("#message-input").val(),
        photo: user.photoURL
    })
    .then(res=>{
        console.log(res);
        $("#message-input").val("");
     });

     scrollDown();
}

document.getElementById("send-message").addEventListener("click", ()=>sendMessage(user));

function loadMessages(user) {
    firebase.database().ref().on('value', function(snapshot) {
        console.log(snapshot.val());

        $("#messages").html("");

        var values = snapshot.val();
        for (var msgId in values) {
            var msg = values[msgId];
            console.log(msg);
            $("#messages").append(`
                <div class="message-container">
                    <img class="user-photo" src=${msg.photo} alt=${msg.user} />
                    <div class="text">
                        <p class="user-name">${msg.user}</p>
                        <p class="message">${msg.message}</p>
                    </div>
                </div>
            `);
        }
    });
    scrollDown();
    
}

function login() {
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log('got here');

        var token = result.credential.accessToken;
        user = result.user;

       $('#login-screen').fadeOut(function() {
            $("#chat-screen").css("display", "block");
        });

       loadMessages(user);
       scrollDown();
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " - " + errorMessage);
    });
}

$('#login-btn').click(login)
