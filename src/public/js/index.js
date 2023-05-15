const socket = io();
wsc.emit("Cliente 1 intentando conectar");
wsc.on("confirm", (data) =>{
    console.log(data);
})