//import modules
const WebSocket = require('ws');
var uniqid = require('uniqid');

//init server
console.log("starting server...");
var queue = [];
var games = {};
var users = {};
const wss = new WebSocket.Server({ port: 2220 });

//listen on connections
wss.on('connection', (ws, req) => {

    //log new users
    console.log("new user: " + req.headers['sec-websocket-key']);
    users[req.headers['sec-websocket-key']] = ws;

    //listen on messages
    ws.on('message', (msg) => {
        var msg = JSON.parse(msg);

        //handle actions
        if(msg.action == "joinQueue"){

            queue.push(req.headers['sec-websocket-key']);
            console.log("Player joined queue");
            matchmaking();

        }else if(msg.action == "choice"){

            if(msg.data[0] && msg.data[1]){
                choiceField(msg.data[0], req.headers['sec-websocket-key'], msg.data[1]);
            }

        }

    });

    ws.on('close',function(reason, description){
        console.log("user left the connection");
    });
 
});

//matchmaking
function matchmaking(){

    //check if players are in the queue
    if(queue[0] && queue[1]){

        //get the players
        var player1 = queue[0];
        var player2 = queue[1];
        //delete players from matchmaking
        queue.shift();
        queue.shift();

        //generate uniqe game id
        var gameid = uniqid();

        //create game with game data
        var game = {
            currentField: [0,0,0,0,0,0,0,0,0]
        }

        game.users = {};

        game.users["1"] = player1;
        game.users["2"] = player2;
        game.currentPlayer = "1";

        games[gameid] = game;

        //send new game actions to players
        users[player1].send(JSON.stringify({newGame: gameid}));
        users[player2].send(JSON.stringify({newGame: gameid}));

        console.log("new game: ");
        console.log(game);

    }

}


//handle game
function choiceField(gameid, user, field){

    //check if game exists and if user is a part of this game
    if(games[gameid] && (games[gameid].users["1"] == user || games[gameid].users["2"] == user)){

        //check which user is me
        if(games[gameid].users["1"] == user){
            var me = 1;
        }else if(games[gameid].users["2"] == user){
            var me = 2;
        }

        //check if user is the current user
        if(games[gameid].currentPlayer == me){

            //check the range of the fields
            if(field > 0 && field < 10){

                //convert field number to array index
                field = field-1;
                
                //check if field is empty
                if(games[gameid].currentField[field] == 0){
                    
                    //set me to the field
                    games[gameid].currentField[field] = me;

                    //handle next player
                    if(me == 1){
                        games[gameid].currentPlayer = 2;
                        var isCurrentPlayer1 = false;
                        var isCurrentPlayer2 = true;
                    }else{
                        games[gameid].currentPlayer = 1;
                        var isCurrentPlayer1 = true;
                        var isCurrentPlayer2 = false;
                    }

                    //send messages to users
                    users[games[gameid].users["1"]].send(JSON.stringify({action: "updateGameField", data: [games[gameid].currentField, isCurrentPlayer1]}));
                    users[games[gameid].users["2"]].send(JSON.stringify({action: "updateGameField", data: [games[gameid].currentField, isCurrentPlayer2]}));

                }else{
                    users[user].send(JSON.stringify({error: "alreadySet"}));
                }

            }else{
                users[user].send(JSON.stringify({error: "invalidField"}));
            }
            
        }else{
            users[user].send(JSON.stringify({error: "notCurrentPlayer"}));
        }

    }else{
        users[user].send(JSON.stringify({error: "noGameFound"}));
    }

}