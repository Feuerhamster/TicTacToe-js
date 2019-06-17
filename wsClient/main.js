const readline = require("readline");
const WebSocket = require("ws")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ws = new WebSocket('ws://localhost:2220');

ws.on('open', function open() {

    console.log("connected")

    rl.on("line", (input)=>{
        ws.send(input);
    });

    ws.on('message', (msg)=>{
        msg = JSON.parse(msg);
        console.log(msg);
    });

});

ws.on('error',(err)=>{
    console.error(err);
});