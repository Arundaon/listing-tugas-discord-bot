const mongoose = require('mongoose')
const connectDb = `mongodb+srv://ary:${process.env.dbKey}@tugas.xiech.mongodb.net/tugas-database?retryWrites=true&w=majority`
const Schema = mongoose.Schema;
const Tugas = mongoose.model('Tugas',new Schema({matkul:String,tugas:String
,tanggal:Number,bulan:Number}))
const discord = require('discord.js');
const client = new discord.Client();
mongoose.connect(connectDb,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{ console.log("connected to database")})
.catch(err=>console.log(err))
const fs = require('fs');
const { stringify } = require('querystring');
client.on("ready",()=>{
    console.log("Bot logged in as "+ client.user.tag);
    client.user.setActivity("with Tugas Kuliah");
})
client.on("message",(receivedMessage)=>{
if(receivedMessage.author == client.user){
    return
}
if(receivedMessage.content.startsWith("!")){
    processCommand(receivedMessage);
}
})
function processCommand(receivedMessage){
let message = receivedMessage.content.substr(1);
if(message.toLowerCase() == "show"){
    showTugas(receivedMessage)
}
else if(message.toLowerCase() == "ping"){
    receivedMessage.channel.send("pong")
}
else if(message.toLowerCase() == "help"){
    receivedMessage.channel
.send(`!ping **//untuk ping bot**
!help **//untuk melihat list command**
!add, matkul, tugas, tanggal/bulan **//untuk menambah tugas**
!show **//untuk melihat list tugas**
!delete, nomor **// untuk menghapus tugas**
**contoh :** 
!add, PemDas, contoh tugas, 17/8
!show
!delete, 5`)
}
else if (message.toLowerCase().startsWith('delete')){
    let [command,nomor] = message.split(',');
    if(command.trim() == "delete"){
        deleteTugas(nomor.trim(),receivedMessage);
        receivedMessage.channel.send(`Data berhasil dihapus`);
    }
    else{
        receivedMessage.channel.send(`Salah format uy`);
    }
    
}
else{
    let [command,matkul,tugas,deadline] = message.split(",");
    if(command.trim().toLowerCase() == "add"){
    let [tanggal,bulan] = deadline.split('/');
    let berapaHari = Math.ceil(parseFloat((new Date(`${bulan}/${tanggal}/${new Date().getFullYear()}`)-new Date)/(1000*60*60*24)));
        if(matkul == null || tugas == null || deadline == null){
            receivedMessage.channel.send("isikan sesuai format");
        }
        else{
            if(berapaHari>=0){
                addTugas(matkul,tugas,berapaHari,receivedMessage,tanggal,bulan);
            }
            else if(berapaHari<0){
                receivedMessage.channel.send("tanggal yang anda masukan itu udah kelewat :D")
            }
            else{
                receivedMessage.channel.send("tanggal/bulan tidak valid")
            }
        }
    }
    else{
        receivedMessage.channel.send(`perintah tidak valid, ketikkan "!help" untuk bantuan`);
    }
}
}
function addTugas(matkul,tugas,berapaHari,receivedMessage,tanggal,bulan){
    Tugas.create({matkul,tugas,tanggal,bulan})
    receivedMessage.channel.send(`Data berhasil dimasukkan`);
}
function showTugas(receivedMessage){
        let lines="";
        Tugas.find({},(err,res)=>{
            res.forEach((key,i)=>{
                if(hmin(key.tanggal,key.bulan)<0){
                    Tugas.deleteOne({_id:key._id},(err)=>{
                        if(err){console.log(err)}
                        console.log("berhasil mendelete tugas Hmin minus")
                    })
                }
            })
            res.sort((a, b) => {
                return hmin(a.tanggal,a.bulan) - hmin(b.tanggal,b.bulan)
            })
            res.forEach((key,i)=>{
                lines+=`${i+1}. ${key.matkul.trim()}, ${key.tugas.trim()}, H-${hmin(key.tanggal,key.bulan)}\n`
                
        })
        if(lines.length==0){
            receivedMessage.channel.send("hore, ngga ada tugas :D")
        }
        else{
            receivedMessage.channel.send(lines)
        }

        })
}
function deleteTugas(nomor,receivedMessage){
    Tugas.find({},(err,res)=>{
        res.forEach((e,i)=>{
            if(i+1 == nomor){
                Tugas.deleteOne({_id:e._id},(err)=>{
                    if(err){console.log(err)}
                })
            }
        })
    })
}
function hmin(tanggal,bulan){
return Math.ceil(parseFloat((new Date(`${bulan}/${tanggal}/${new Date().getFullYear()}`)-new Date)/(1000*60*60*24)));
}
client.login(process.env.token);