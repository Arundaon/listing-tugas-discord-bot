const express = require("express");
const app = express();
//register view engine
app.set('view engine', 'ejs');
//where is the view ?
app.set('views','Website');
//server listen to request
app.listen(1945);
//listening
console.log("listening");

app.use(express.static('public')) //making browser acessible folder
app.get("/",(req,res)=>{ 
    res.render("home")
})
app.get("/about",(req,res)=>{
    res.render("about")
})
app.use((req,res)=>{
    res.render("404")
    res.status(404);
})