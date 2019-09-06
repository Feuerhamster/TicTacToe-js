//get icons
const gameFieldIcons = {
    empty: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="65" height="65" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g id="Layer_1" fill="#ccd6e6"><g id="surface1"><path d="M86,164.11667l-78.11667,-78.11667l78.11667,-78.11667l78.11667,78.11667zM27.95,86l58.05,58.05l58.05,-58.05l-58.05,-58.05z"></path></g></g></g></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="65" height="65" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ee5253"><g id="surface1"><path d="M129.06999,30.26237l12.68164,12.66764l-98.82161,98.80762l-12.66764,-12.66765z"></path><path d="M141.73763,129.08399l-12.66765,12.66764l-98.80761,-98.83561l12.66764,-12.66765z"></path></g></g></g></svg>',
    o: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="65" height="65" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g id="Layer_1" fill="#ff9f43"><g id="surface1"><path d="M86,157.66667c-39.41667,0 -71.66667,-32.25 -71.66667,-71.66667c0,-39.41667 32.25,-71.66667 71.66667,-71.66667c39.41667,0 71.66667,32.25 71.66667,71.66667c0,39.41667 -32.25,71.66667 -71.66667,71.66667zM86,28.66667c-31.53333,0 -57.33333,25.8 -57.33333,57.33333c0,31.53333 25.8,57.33333 57.33333,57.33333c31.53333,0 57.33333,-25.8 57.33333,-57.33333c0,-31.53333 -25.8,-57.33333 -57.33333,-57.33333z"></path></g></g></g></svg>',

    miniX: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="55" height="55" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ee5253"><g id="surface1"><path d="M129.06999,30.26237l12.68164,12.66764l-98.82161,98.80762l-12.66764,-12.66765z"></path><path d="M141.73763,129.08399l-12.66765,12.66764l-98.80761,-98.83561l12.66764,-12.66765z"></path></g></g></g></svg>',
    miniO: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="55" height="55" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g id="Layer_1" fill="#ff9f43"><g id="surface1"><path d="M86,157.66667c-39.41667,0 -71.66667,-32.25 -71.66667,-71.66667c0,-39.41667 32.25,-71.66667 71.66667,-71.66667c39.41667,0 71.66667,32.25 71.66667,71.66667c0,39.41667 -32.25,71.66667 -71.66667,71.66667zM86,28.66667c-31.53333,0 -57.33333,25.8 -57.33333,57.33333c0,31.53333 25.8,57.33333 57.33333,57.33333c31.53333,0 57.33333,-25.8 57.33333,-57.33333c0,-31.53333 -25.8,-57.33333 -57.33333,-57.33333z"></path></g></g></g></svg>'
}

//set vars
var currentGame = false;
var mePlayer = false;
var ws = false;
var inQueue = false;

//load audio
var up3Sound = new Audio("./sounds/sound-up-3.mp3");
var down3Sound = new Audio("./sounds/sound-down-3.mp3");

var up2Sound = new Audio("./sounds/sound-up-2.mp3");
var down2Sound = new Audio("./sounds/sound-down-2.mp3");

var specialSound = new Audio("./sounds/sound-special-5.mp3");
var soundDown = new Audio("./sounds/sound-slow-down-3.mp3");
var soundDouble = new Audio("./sounds/sound-double-2.mp3");

//prepare game field
$("#game-field-1").html(gameFieldIcons.empty);
$("#game-field-2").html(gameFieldIcons.empty);
$("#game-field-3").html(gameFieldIcons.empty);
$("#game-field-4").html(gameFieldIcons.empty);
$("#game-field-5").html(gameFieldIcons.empty);
$("#game-field-6").html(gameFieldIcons.empty);
$("#game-field-7").html(gameFieldIcons.empty);
$("#game-field-8").html(gameFieldIcons.empty);
$("#game-field-9").html(gameFieldIcons.empty);

//set click event handler
$("#game-field-1").on("click", function(){
    chooseFiled(1);
});
$("#game-field-2").on("click", function(){
    chooseFiled(2);
});
$("#game-field-3").on("click", function(){
    chooseFiled(3);
});
$("#game-field-4").on("click", function(){
    chooseFiled(4);
});
$("#game-field-5").on("click", function(){
    chooseFiled(5);
});
$("#game-field-6").on("click", function(){
    chooseFiled(6);
});
$("#game-field-7").on("click", function(){
    chooseFiled(7);
});
$("#game-field-8").on("click", function(){
    chooseFiled(8);
});
$("#game-field-9").on("click", function(){
    chooseFiled(9);
});

function updateInviteListButton(addValue){
    var btntext = $("#inviteListButton").html();
    var pattern = /Einladungen \((\d+)\)/gi;
    var result = pattern.exec(btntext);

    if(result){
        var inviteCount = parseInt(result[1]) + addValue;
        if(inviteCount < 1){
            $("#inviteListButton").html("Einladungen");
        }else{
            $("#inviteListButton").html("Einladungen ("+inviteCount+")");
        }
        
    }else{
        if(addValue > 0){
            $("#inviteListButton").html("Einladungen ("+addValue+")");
        }else{
            $("#inviteListButton").html("Einladungen");
        }
    }

    
}

//create connect function
function gameServerConnection(username){

    //connect to gameserver
    ws = new WebSocket("ws://localhost:2220?username="+username);

    //on open function
    ws.onopen = ()=>{
        console.log("[ws] Connected");
        ws.send(JSON.stringify({ action: "setUsername", data:{ username: username } }));
    }

    //on message function
    ws.onmessage = function (event) {
        var data = JSON.parse(event.data);

        //check the action
        if(data.action == "successfulJoinedServer"){

            setTimeout(()=>{
                $("#loginform").css("display", "none");
                $("#mainMenuBox").css("display", "flex");
                $("#connecting-indicator").fadeOut(500);
            },500);

            $("#main-online-counter").html(data.online);

        }else if(data.action == "successfulSetUsername"){

            $("#user-nickname").html(data.data.usernaem);

        }else if(data.action == "successfulJoinedQueue"){

            inQueue = true;

            $("#queue-screen").css("display", "flex").hide().fadeIn(500);
            $("#main-screen").css("display", "none");
            $("#game-field").css("display", "none");

            $("#queue-online-counter").html(data.online);
            $("#queue-user-counter").html(data.inQueue);

        }else if(data.action == "newGame"){

            mePlayer = data.data.you;

            currentGame = true;
            inQueue = false;

            //play sound
            up3Sound.play();

            $("#game-field-1").html(gameFieldIcons.empty);
            $("#game-field-2").html(gameFieldIcons.empty);
            $("#game-field-3").html(gameFieldIcons.empty);
            $("#game-field-4").html(gameFieldIcons.empty);
            $("#game-field-5").html(gameFieldIcons.empty);
            $("#game-field-6").html(gameFieldIcons.empty);
            $("#game-field-7").html(gameFieldIcons.empty);
            $("#game-field-8").html(gameFieldIcons.empty);
            $("#game-field-9").html(gameFieldIcons.empty);

            $("#backButton").css("display", "none");
            $("#newGameButton").css("display", "none");

            $("#queue-screen").fadeOut(500);
            $("#game-field").css("display", "flex").hide().fadeIn(500);

            $("#enemy-name").html(data.data.enemy);
        
            if(mePlayer == 1){ 
                $("#you-symbol").html(gameFieldIcons.miniX);
            }else{
                $("#you-symbol").html(gameFieldIcons.miniO);
            }

            if(data.data.isCurrentPlayer){
                $("#game-headline").html("Du bist dran");
            }else{
                $("#game-headline").html("Der Gegner spielt...");
            }

        }else if(data.action == "forceEnd"){

            //play sound
            down3Sound.play();

            $("#game-field").fadeOut(500);

            $("#forceEnd-screen").css("display", "flex").hide().fadeIn(500);
            setTimeout(()=>{
                $("#forceEnd-screen").fadeOut(500);
                $("#main-screen").css("display", "flex").hide().fadeIn(500);
            },2000);
            

        }else if(data.action == "updateGame"){

            for(i = 0; data.data.gameField.length >= i; i++){

                field = i+1;

                if(data.data.gameField[i] == 1){
                    $("#game-field-"+field).html(gameFieldIcons.x)
                }else if(data.data.gameField[i] == 2){
                    $("#game-field-"+field).html(gameFieldIcons.o);
                }

            }

            if(!data.data.winner){

                if(data.data.isCurrentPlayer){
                    $("#game-headline").html("Du bist dran");
                }else{
                    $("#game-headline").html("Der Gegner spielt...");
                }

            }else{

                currentGame = false;

                if(data.data.winner == 1){
                    $("#game-headline").html("<span style='color: #10ac84'>Du hast Gewonnen</span>");
                    specialSound.play();
                }else if(data.data.winner == 3){
                    $("#game-headline").html("<span style='color: #ff9f43'>Unentschieden</span>");
                    soundDouble.play();
                }else{
                    $("#game-headline").html("<span style='color: #ee5253'>Du hast Verloren</span>");
                    soundDown.play();
                }

                $("#gameFinishButtons").fadeIn(1000);

            }
            

        }else if(data.action == "userdata"){
            
            //clear user list
            $("#userlist").html("");

            //loop all users
            data.data.forEach(user => {
                //append to userlist
                $("#userlist").append('<li><strong>'+user+'</strong><span class="flex-spacer"></span><span onclick="invite(\''+user+'\')" class="inviteButton">Einladen</span></li>');
            });


        }else if(data.action == "successfulInvited"){
            $('#inviteModal').fadeIn('fast');
            $('#partnerName').html(data.data.user);

        }else if(data.action == "invited"){

            //update list button
            updateInviteListButton(1);
            //play sound
            up2Sound.play();

        }else if(data.action == "inviteData"){

            //clear user list
            $("#inviteList").html("");

            //loop all users
            data.data.forEach(user => {
                //append to userlist
                $("#inviteList").append('<li><strong>'+user+'</strong><span class="flex-spacer"></span><span onclick="acceptInvite(\''+user+'\', this)" class="inviteButton" style="margin-right: 10px; color: #10ac84">Annehmen</span> <span onclick="denyInvite(\''+user+'\', this)" class="inviteButton" style="color: #ee5253">Ablehnen</span></li>');
            });

        }else if(data.action == "successfulDenied"){
            //update list button
            updateInviteListButton(-1);
        }else if(data.action == "inviteDenied"){

            updateInviteListButton(-1);

            //play sound
            down2Sound.play();

            $('#inviteModal').fadeOut("fast", function(){
                alert("Dein Partner hat die Einladung abgelehnt");
            });
            
        }else if(data.action == "inviteRevoked"){
            updateInviteListButton(-1);
        }else if(data.action == "inviteAccepted"){

            $("#usermodal").fadeOut("fast");
            $("#inviteModal").fadeOut("fast");

        }else if(data.error == "invalidUsername"){

            sessionStorage.setItem('username', 'INVALID');
            window.location.href = document.URL;

        }else if(data.error == "alreadyInvited"){

            alert("Du hast bereits einen Spieler eingeladen");

        }else if(data.error == "invalidUser"){

            alert("Du kannst diesen Spieler nicht einladen");

        }

    }

    //on close function
    ws.onclose = function (event) {
        $("#connecting-error").css("display", "flex").hide().fadeIn(500);
        console.error("[ws] Connection failed");
    }

}

document.addEventListener("keydown", function(event){

    var keys = {
        103: 1,
        104: 2,
        105: 3,
        100: 4,
        101: 5,
        102: 6,
        97: 7,
        98: 8,
        99: 9
    }

    if(keys[event.keyCode]){
        chooseFiled(keys[event.keyCode]);
    }else{
        if(event.keyCode == 13){
            enterQueue();
        }else if(event.keyCode == 96){

            if(inQueue){
                leaveQueue();
            }else{
                back();
            }
        }
    }

});

function enterQueue(){
    if(ws){
        ws.send(JSON.stringify({ action: "joinQueue" }));
    }  
}
function chooseFiled(field){
    if(currentGame){
        ws.send(JSON.stringify({ action: "choice", data: { gameId: currentGame , field: field } }));
    }
}
function back(){
    if(currentGame){
        console.log("leaving game");
        ws.send(JSON.stringify({ action: "leaveGame" }));
    }
    $("#game-field").hide();
    $("#main-screen").css("display", "flex").hide().fadeIn(500);
}

function leaveQueue(){
    console.log("leaving queue");
    if(ws){
        ws.send(JSON.stringify({ action: "leaveQueue" }));
    }
    $("#queue-screen").hide();
    $("#main-screen").css("display", "flex").hide().fadeIn(500);
}

var design = "light";
function switchDesign(){

    if(design == "light"){

        if(typeof(Storage) != "undefined"){
            sessionStorage.design = "dark";
        }

        design = "dark";
        document.getElementById("stylelink").href="./css/style-dark.css";
        $('#styleSwitcher').html("[Light Design]");

    }else{

        if(typeof(Storage) != "undefined"){
            sessionStorage.design = "light";
        }

        design = "light";
        document.getElementById("stylelink").href="./css/style.css";
        $('#styleSwitcher').html("[Dark Design]");

    }

}

//handle user login
$("#loginform").submit(function(event){

    $("#connecting-indicator").css("display", "flex");

    event.preventDefault();
    var username = $(this)[0][0].value;

    if(typeof(Storage) != "undefined"){
        sessionStorage.username = username;
    }

    $("#user-nickname").html(username);
    $("#loginBox").css("display", "none");

    //start connect function
    gameServerConnection(username);

});

if(typeof(Storage) != "undefined" && sessionStorage.username){

    if(sessionStorage.username != "INVALID"){

        $("#connecting-indicator").css("display", "flex");
        $("#user-nickname").html(sessionStorage.username);
        gameServerConnection(sessionStorage.username);

    }else{

        sessionStorage.removeItem('username');
        $("#loginError").html("Der Benutzername ist ungültig oder schon vergeben");

    }
    
}

if(typeof(Storage) != "undefined" && sessionStorage.design){
    if(design == "light"){
        sessionStorage.design = "dark";
        design = "dark";
        document.getElementById("stylelink").href="style-dark.css";
        $('#styleSwitcher').html("[Light Design]");

    }else{
        design = "light";
        document.getElementById("stylelink").href="style.css";
        $('#styleSwitcher').html("[Dark Design]");

    }
}

function showUsers(){
    $("#usermodal").fadeIn("fast");
    ws.send(JSON.stringify({ action: "getUsers" }));
}

function showInvites(){
    $("#inviteListModal").fadeIn("fast");
    ws.send(JSON.stringify({ action: "getInvites" }));
}

function invite(user){
    ws.send(JSON.stringify({ action: "invite", data: { user: user } }));
}

function revokeInvite(){
    ws.send(JSON.stringify({ action: "revokeInvite" }));
}

function denyInvite(user, element){
    ws.send(JSON.stringify({ action: "denyInvite", data: { user: user } }));
    element.parentNode.remove();
    updateInviteListButton(-1);
}

function acceptInvite(user, element){
    ws.send(JSON.stringify({ action: "acceptInvite", data: { user: user } }));
    element.parentNode.remove();
    updateInviteListButton(-1);
    $("#inviteListModal").fadeOut("fast");
}