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

    //log new users
    console.log(colors.green("[WebSocket] New user: " + req.headers['sec-websocket-key']));
    users[req.headers['sec-websocket-key']] = ws;

    //listen on messages
    ws.on('message', (msg) => {
        var msg = JSON.parse(msg);

        //handle actions

        if(msg.action == "joinQueue"){
 
            queue.push(req.headers['sec-websocket-key']);
            ws.send('{"action":"successfulJoinedQueue"}')
            console.log("[GameHandler] User joined queue".cyan);
            matchmaking();

        }else if(msg.action == "choice"){

            if(msg.data.gameId && msg.data.field){
                choiceField(msg.data.gameId, req.headers['sec-websocket-key'], msg.data.field);
            }

        }

    });

    ws.on('close',function(reason, description){

        console.log("[WebSocket] User closed connection".red);
        if(queue[req.headers['sec-websocket-key']]){
            delete queue[req.headers['sec-websocket-key']];
        }

        if(users[req.headers['sec-websocket-key']].currentGame && games[users[req.headers['sec-websocket-key']].currentGame]){

            var thisgame = games[users[req.headers['sec-websocket-key']].currentGame];

            if(users[thisgame.users["1"]] && thisgame.users["1"] != req.headers['sec-websocket-key']){
                console.log(thisgame.users["1"] + "/" + req.headers['sec-websocket-key'])
                users[thisgame.users["1"]].send(JSON.stringify({action: "forceEnd", data: {gameId: thisgame.gameId}}));
            }
            if(users[thisgame.users["2"]] && thisgame.users["2"] != req.headers['sec-websocket-key']){
                users[thisgame.users["2"]].send(JSON.stringify({action: "forceEnd", data: {gameId: thisgame.gameId}}));
            }

            delete games[thisgame.gameId];
            delete thisgame;

        }

        delete users[req.headers['sec-websocket-key']];

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
        users[player1].send(JSON.stringify({action: "newGame", data: {gameId: gameId, isCurrentPlayer: true, you: 1}}));
        users[player2].send(JSON.stringify({action: "newGame", data: {gameId: gameId, isCurrentPlayer: false, you: 1}}));

        users[player1].currentGame = gameId;
        users[player2].currentGame = gameId;

        console.log(colors.cyan("[GameHandler] New game created:"+gameId));

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
        users[games[gameId].users["1"]].currentGame = false;

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