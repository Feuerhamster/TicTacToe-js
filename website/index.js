const gameFieldIcons = {
    empty: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="65" height="65" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g id="Layer_1" fill="#ccd6e6"><g id="surface1"><path d="M86,164.11667l-78.11667,-78.11667l78.11667,-78.11667l78.11667,78.11667zM27.95,86l58.05,58.05l58.05,-58.05l-58.05,-58.05z"></path></g></g></g></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="65" height="65" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ee5253"><g id="surface1"><path d="M129.06999,30.26237l12.68164,12.66764l-98.82161,98.80762l-12.66764,-12.66765z"></path><path d="M141.73763,129.08399l-12.66765,12.66764l-98.80761,-98.83561l12.66764,-12.66765z"></path></g></g></g></svg>',
    o: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="65" height="65" viewBox="0 0 172 172" style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g id="Layer_1" fill="#ff9f43"><g id="surface1"><path d="M86,157.66667c-39.41667,0 -71.66667,-32.25 -71.66667,-71.66667c0,-39.41667 32.25,-71.66667 71.66667,-71.66667c39.41667,0 71.66667,32.25 71.66667,71.66667c0,39.41667 -32.25,71.66667 -71.66667,71.66667zM86,28.66667c-31.53333,0 -57.33333,25.8 -57.33333,57.33333c0,31.53333 25.8,57.33333 57.33333,57.33333c31.53333,0 57.33333,-25.8 57.33333,-57.33333c0,-31.53333 -25.8,-57.33333 -57.33333,-57.33333z"></path></g></g></g></svg>'

}

var currentGame = false;
var mePlayer = false;
var ws = false;

$("#game-field-1").html(gameFieldIcons.empty);
$("#game-field-2").html(gameFieldIcons.empty);
$("#game-field-3").html(gameFieldIcons.empty);
$("#game-field-4").html(gameFieldIcons.empty);
$("#game-field-5").html(gameFieldIcons.empty);
$("#game-field-6").html(gameFieldIcons.empty);
$("#game-field-7").html(gameFieldIcons.empty);
$("#game-field-8").html(gameFieldIcons.empty);
$("#game-field-9").html(gameFieldIcons.empty);

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

function gameServerConnection(){

    ws = new WebSocket("ws://localhost:2220");

    ws.onopen = ()=>{
        console.log("[ws] Connected");
        setTimeout(()=>{
            $("#connecting-indicator").fadeOut(500);
        },500);
        
    }
    ws.onmessage = function (event) {
        var data = JSON.parse(event.data);

        console.log(data);

        if(data.action == "successfulJoinedQueue"){

            $("#queue-screen").css("display", "flex").hide().fadeIn(500);
            $("#main-screen").css("display", "none");

        }else if(data.action == "newGame"){

            currentGame = data.data.gameId;
            mePlayer = data.data.you;

            $("#queue-screen").fadeOut(500);
            $("#game-field").css("display", "flex").hide().fadeIn(500);
            if(data.data.isCurrentPlayer){
                $("#game-headline").html("Du bist dran");
            }else{
                $("#game-headline").html("Der Gegner spielt...");
            }

        }else if(data.action == "forceEnd"){

            $("#game-field").fadeOut(500);
            $("#main-screen").css("display", "flex").hide().fadeIn(500);

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

                //currentGame = false;

                if(data.data.winner == mePlayer){
                    $("#game-headline").html("<span style='color: #10ac84'>Du hast Gewonnen</span>");
                }else if(data.data.winner == 3){
                    $("#game-headline").html("<span style='color: #ff9f43'>Unentschieden</span>");
                }else{
                    $("#game-headline").html("<span style='color: #ee5253'>Du hast Verloren</span>");
                }

            }
            

        }

    }

    ws.onclose = function (event) {
        $("#queue-screen").css("display", "flex").hide().fadeIn(500);
        console.warn("[ws] Connection failed");
        gameServerConnection();
    }

}


function enterQueue(){
    ws.send(JSON.stringify({ action: "joinQueue" }));
}
function chooseFiled(field){
    if(currentGame){
        ws.send(JSON.stringify({ action: "choice", data: { gameId: currentGame , field: field } }));
    }
}

gameServerConnection();