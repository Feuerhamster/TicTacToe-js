console.log("[JavaScript] Loading...");
//import modules
const WebSocket = require('ws');
var uniqid = require('uniqid');
const colors = require('colors');

//init server
console.log("[WebSocket] Starting server...".yellow);
var queue = [];
var games = {};
var users = {};
const wss = new WebSocket.Server({ port: 2220 });

console.log("[WebSocket] Server successful started".green);

//listen on connections
wss.on('connection', (ws, req) => {

    if(req.headers['sec-websocket-protocol'] && req.headers['sec-websocket-protocol'].length > 1 && req.headers['sec-websocket-protocol'].length < 20){

        //log new users
        console.log(colors.green("[WebSocket] New user: " + req.headers['sec-websocket-protocol']));
        users[req.headers['sec-websocket-key']] = ws;
        users[req.headers['sec-websocket-key']].currentGame = false;
        users[req.headers['sec-websocket-key']].username = req.headers['sec-websocket-protocol'];

        //send success message to the user
        ws.send(JSON.stringify({ action: "successfulJoinedServer", online: Object.keys(users).length}));

        //listen on messages
        ws.on('message', (msg) => {
            var msg = JSON.parse(msg);

            //handle actions

            if(msg.action == "joinQueue"){

                //check if user is already in a game
                if(!users[req.headers['sec-websocket-key']].currentGame){

                    //push the user in the queue and send him a success message
                    queue.push(req.headers['sec-websocket-key']);
                    ws.send(JSON.stringify({ action: "successfulJoinedQueue", inQueue: queue.length, online: Object.keys(users).length }));

                    console.log(colors.cyan("[GameHandler] "+users[req.headers['sec-websocket-key']].username+" joined queue"));

                    //start matchmaking
                    matchmaking();

                }else{
                    //send error message
                    ws.send(JSON.stringify({ error: "alreadyInGame" }));
                }
                

            }else if(msg.action == "choice"){

                //check if the field is set and a game exists
                if(msg.data.field && games[users[req.headers['sec-websocket-key']].currentGame]){
                    choiceField(users[req.headers['sec-websocket-key']].currentGame, req.headers['sec-websocket-key'], msg.data.field);
                }else{
                    //send error message
                    ws.send(JSON.stringify({ error: "fieldNotSetOrNoGame" }));
                }

            }else if(msg.action == "leaveGame"){
                
                //get the current game
                var thisgame = games[users[req.headers['sec-websocket-key']].currentGame];

                //send force end message to the other user
                if(users[thisgame.users["1"]] && thisgame.users["1"] != req.headers['sec-websocket-key']){
                    users[thisgame.users["1"]].send(JSON.stringify({action: "forceEnd"}));
                }
                if(users[thisgame.users["2"]] && thisgame.users["2"] != req.headers['sec-websocket-key']){
                    users[thisgame.users["2"]].send(JSON.stringify({action: "forceEnd"}));
                }

                //remove the current game
                users[thisgame.users["1"]].currentGame = false;
                users[thisgame.users["2"]].currentGame = false;

                delete games[thisgame.gameId];
                delete thisgame;

                //send success message
                ws.send(JSON.stringify({ action: "successfulLeftGame" }));

                console.log(colors.cyan("[GameHandler] "+users[req.headers['sec-websocket-key']].username+" left the game"));

            }else if(msg.action == "leaveQueue"){

                //check if user is in queue
                if(queue.indexOf(req.headers['sec-websocket-key']) != -1){

                    //remove user from queue
                    queue.splice(queue.indexOf(req.headers['sec-websocket-key']),1);
                    console.log(colors.cyan("[GameHandler] "+users[req.headers['sec-websocket-key']].username+" left queue"));

                }else{
                    //send error message
                    ws.send(JSON.stringify({ error: "notInQueue" }));
                }

            }

        });

        ws.on('close',function(reason, description){

            console.log(colors.red("[WebSocket] "+users[req.headers['sec-websocket-key']].username+" closed connection"));

            //if user is in queue, remove the user from the queue
            if(queue.indexOf(req.headers['sec-websocket-key']) != -1){

                queue.splice(queue.indexOf(req.headers['sec-websocket-key']),1);
                console.log("[GameHandler] User left queue".cyan);

            }

            //delete the game if a game is running
            if(users[req.headers['sec-websocket-key']].currentGame && games[users[req.headers['sec-websocket-key']].currentGame]){

                var thisgame = games[users[req.headers['sec-websocket-key']].currentGame];

                if(users[thisgame.users["1"]] && thisgame.users["1"] != req.headers['sec-websocket-key']){
                    users[thisgame.users["1"]].send(JSON.stringify({action: "forceEnd"}));
                }
                if(users[thisgame.users["2"]] && thisgame.users["2"] != req.headers['sec-websocket-key']){
                    users[thisgame.users["2"]].send(JSON.stringify({action: "forceEnd"}));
                }

                users[thisgame.users["1"]].currentGame = false;
                users[thisgame.users["2"]].currentGame = false;

                delete games[thisgame.gameId];
                delete thisgame;

            }

            //delete the user
            delete users[req.headers['sec-websocket-key']];

        });

    }else{

        if(!req.headers['sec-websocket-protocol']){

            ws.send(JSON.stringify({ error: "cannotSetUsername" }));
            console.log("[ Warning ] sec-websocket-protocol is empty. User kicked.".yellow);

        }else{

            ws.send(JSON.stringify({ error: "invalidUsername" }));

        }
        ws.close();
        console.log("[WebSocket] Connection closed".red);
    }
    
 
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
        var gameId = uniqid();

        //create game with game data
        var game = {
            currentField: [0,0,0,0,0,0,0,0,0]
        }

        game.users = {};

        game.users["1"] = player1;
        game.users["2"] = player2;
        game.currentPlayer = "1";

        games[gameId] = game;

        //send new game actions to players
        users[player1].send(JSON.stringify({action: "newGame", data: {isCurrentPlayer: true, you: 1, enemy: users[player2].username}}));
        users[player2].send(JSON.stringify({action: "newGame", data: {isCurrentPlayer: false, you: 2, enemy: users[player1].username}}));

        users[player1].currentGame = gameId;
        users[player2].currentGame = gameId;

        console.log(colors.cyan("[GameHandler] New game created: "+users[player1].username+"/"+users[player2].username));

    }

}

//handle game
function choiceField(gameId, user, field){

    //check if game exists and if user is a part of this game
    if(games[gameId] && (games[gameId].users["1"] == user || games[gameId].users["2"] == user)){

        //check which user is me
        if(games[gameId].users["1"] == user){
            var me = 1;
        }else if(games[gameId].users["2"] == user){
            var me = 2;
        }

        //check if user is the current user
        if(games[gameId].currentPlayer == me){

            //check the range of the fields
            if(field > 0 && field < 10){

                //convert field number to array index
                field = field-1;

                //check if field is empty
                if(games[gameId].currentField[field] == 0){

                    //set me to the field
                    games[gameId].currentField[field] = me;

                    //handle next player
                    if(me == 1){
                        games[gameId].currentPlayer = 2;
                        var isCurrentPlayer1 = false;
                        var isCurrentPlayer2 = true;
                    }else{
                        games[gameId].currentPlayer = 1;
                        var isCurrentPlayer1 = true;
                        var isCurrentPlayer2 = false;
                    }

                    var winner = checkWinner(games[gameId].currentField);

                    //check if a user has won
                    if(winner != 0){
                        finishGame(gameId, winner);
                    }else{
                        //send messages to users

                        users[games[gameId].users["1"]].send(JSON.stringify({action: "updateGame", data: {gameField: games[gameId].currentField, isCurrentPlayer: isCurrentPlayer1}}));
                        users[games[gameId].users["2"]].send(JSON.stringify({action: "updateGame", data: {gameField: games[gameId].currentField, isCurrentPlayer: isCurrentPlayer2}}));

                    }
                    
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

function checkWinner(field){

    //array to string
    field = field.join('');

    //set regex
    var p1Regex = /111[0-2]{6}|[0-2]{3}111[0-2]{3}|[0-2]{6}111|1[0-2]{2}1[0-2]{2}1[0-2]{2}|[0-2]{1}1[0-2]{2}1[0-2]{2}1[0-2]{1}|[0-2]{2}1[0-2]{2}1[0-2]{2}1|1[0-2]{3}1[0-2]{3}1|[0-2]{2}1[0-2]{1}1[0-2]{1}1[0-2]{2}/g
    var p2Regex = /222[0-2]{6}|[0-2]{3}222[0-2]{3}|[0-2]{6}222|2[0-2]{2}2[0-2]{2}2[0-2]{2}|[0-2]{1}2[0-2]{2}2[0-2]{2}2[0-2]{1}|[0-2]{2}2[0-2]{2}2[0-2]{2}2|2[0-2]{3}2[0-2]{3}2|[0-2]{2}2[0-2]{1}2[0-2]{1}2[0-2]{2}/g
    //set winner
    var winner = 0;

    //check if someone has won
    if(field.match(p1Regex)){
        winner = 1;
    }else if(field.match(p2Regex)){
        winner = 2;
    }else{
        if(!field.match(/0/g)){
            winner = 3;
        }else{
            winner = 0;
        }
    }
    return winner;

}

function finishGame(gameId, winner){

    if(winner != 0){

        users[games[gameId].users["1"]].currentGame = false;
        users[games[gameId].users["2"]].currentGame = false;

        if(winner == 1){

            //send messages to users
            users[games[gameId].users["1"]].send(JSON.stringify({action: "updateGame", data: {gameField: games[gameId].currentField, isCurrentPlayer: false, winner: 1}}));
            users[games[gameId].users["2"]].send(JSON.stringify({action: "updateGame", data: {gameField: games[gameId].currentField, isCurrentPlayer: false, winner: 2}}));


        }else if(winner == 2){

            //send messages to users
            users[games[gameId].users["1"]].send(JSON.stringify({action: "updateGame", data: {gameField: games[gameId].currentField, isCurrentPlayer: false, winner: 2}}));
            users[games[gameId].users["2"]].send(JSON.stringify({action: "updateGame", data: {gameField: games[gameId].currentField, isCurrentPlayer: false, winner: 1}}));

        }else{

            //send messages to users
            users[games[gameId].users["1"]].send(JSON.stringify({action: "updateGame", data: {gameField: games[gameId].currentField, isCurrentPlayer: false, winner: 3}}));
            users[games[gameId].users["2"]].send(JSON.stringify({action: "updateGame", data: {gameField: games[gameId].currentField, isCurrentPlayer: false, winner: 3}}));


        }

        delete games[gameId];

    }else{
        console.error("ERROR: Winner=true but finish game says no");
    }

}