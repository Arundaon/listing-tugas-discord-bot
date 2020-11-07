//task :
//- kirim tugases ke json & read ke tugases
const discord = require('discord.js');
const mongoose = require('mongoose')
const Tugas = mongoose.model("Tugas")
const connectDb = `mongodb+srv://ary:${process.env.mongopas}@tugas.xiech.mongodb.net/tugas-database?retryWrites=true&w=majority`
let storage;
const client = new discord.Client();
mongoose.connect(connectDb,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{ console.log("connected to database")
    storage = Tugas.find({},(err,result)=>{
storage= result;
console.log(storage)
})})
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
// receivedMessage.channel.send("Hello "+ receivedMessage.author.toString()+", you send : '"+receivedMessage.content+"'");
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
    receivedMessage.channel.send("duar")
}
else if(message.toLowerCase() == "help"){
    receivedMessage.channel
.send(`!add, matkul, tugas, deadline **//untuk menambah tugas**
!show **//untuk melihat list tugas**
!delete, nomor **// untuk menghapus tugas**`)
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
    tugases.push({
        matkul,tugas,berapaHari
    })
    fs.readFile('./tes.json','utf-8',(err,data)=>{
        let storage = JSON.parse(data);
        let i = 0
        while(storage.hasOwnProperty('tugas'+i)){i++}
        storage['tugas'+i] = {
            matkul,tugas,tanggal,bulan
        } 
        fs.writeFile('./tes.json',JSON.stringify(storage),(err)=>{
        })
    })
    receivedMessage.channel.send(`Data berhasil dimasukkan`);
}
function showTugas(receivedMessage){
    fs.readFile('./tes.json','utf-8',(err,data)=>{
        let storage = JSON.parse(data);
        let lines="";
        let keys = Object.keys(storage)
        keys.forEach((key,i)=>{
            if(hmin(storage[key].tanggal,storage[key].bulan)<0){
                
                delete storage[key];
            }
        })
        
        keys.sort((a, b) => {
            return hmin(storage[a].tanggal,storage[a].bulan) - hmin(storage[b].tanggal,storage[b].bulan)
        });
        
        keys.forEach((key,i)=>{
            lines+=`${i+1}. ${storage[key].matkul.trim()}, ${storage[key].tugas.trim()}, H-${hmin(storage[key].tanggal,storage[key].bulan)}\n`
        })
        fs.writeFile('./tes.json',JSON.stringify(storage),(err)=>{})
        receivedMessage.channel.send(lines)
    })
}
function deleteTugas(nomor,receivedMessage){
    fs.readFile('./tes.json','utf-8',(err,data)=>{
        let storage = JSON.parse(data);
        delete storage[Object.keys(storage)[nomor-1]];
        fs.writeFile('./tes.json',JSON.stringify(storage),(err)=>{})
    })
}
function hmin(tanggal,bulan){
return Math.ceil(parseFloat((new Date(`${bulan}/${tanggal}/${new Date().getFullYear()}`)-new Date)/(1000*60*60*24)));
}
function urutinHmin(objek){
    let all={};
Object.keys(objek).forEach((namaSubObjek)=>{
hmin(objek[namaSubObjek].tanggal,objek[namaSubObjek].bulan);
})
}
client.login(process.env.token);