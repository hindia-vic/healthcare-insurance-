const express = require("express");
const app = express();
const port = 5000;


app.use(express.static('public', { 'Content-Type': 'text/javascript' }));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
})
app.get('/form',function(req,res){
    res.sendFile(__dirname+'/index.html');
})

app.listen(port, ()=>{
    console.log(`Listening at http://localhost:${port}`)
})