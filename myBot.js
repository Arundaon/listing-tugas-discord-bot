const mongoose = require('mongoose')
const connectDb = `mongodb+srv://ary:${process.env.dbKey}@tugas.xiech.mongodb.net/tugas-database?retryWrites=true&w=majority`
const Schema = mongoose.Schema;
//ganti schema tambah jam
const Tugas = mongoose.model('Tugas',new Schema({matkul:String,tugas:String
,tanggal:Number,bulan:Number,jam:Number,menit:Number}))
const discord = require('discord.js');
const client = new discord.Client();
mongoose.connect(connectDb,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{ console.log("connected to database")})
.catch(err=>console.log(err))
const fs = require('fs');
const { stringify } = require('querystring');
client.on("ready",()=>{
    console.log("Bot logged in as "+ client.user.tag);
    client.user.setActivity("!help",{type:"LISTENING"});
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
!add, matkul, tugas, tanggal/bulan, jam:menit **//untuk menambah tugas**
!show **//untuk melihat list tugas**
!delete, nomor **// untuk menghapus tugas**
**contoh :** 
!add, Pemdas, pengkondisian, 17/8, 23:59
!show
!delete, 5`)
}
else if (message.toLowerCase().startsWith('delete')){
    let [command,nomor] = message.split(',');
    if(command.trim() == "delete"){
        deleteTugas(nomor.trim(),receivedMessage);
        
    }
    else{
        receivedMessage.channel.send(`Salah format uy`);
    }
    
}
else{
    let [command,matkul,tugas,deadline,waktu] = message.split(",");
    if(command.trim().toLowerCase() == "add"){
    let [tanggal,bulan] = deadline.trim().split('/');
    let [jam,menit] = waktu.trim().split(':');
    let selisihWaktu = selisih(bulan,tanggal,jam,menit)
        if(matkul == null || tugas == null || deadline == null || waktu == null){
            receivedMessage.channel.send("isikan sesuai format");
        }
        else{
            if(selisihWaktu>=0){
                //ganti format input tanggalan dengan menambah jam
                addTugas(matkul.trim(),tugas.trim(),receivedMessage,tanggal.trim(),bulan.trim(),jam.trim(),menit.trim());
            }
            else if(selisihWaktu<0){
                receivedMessage.channel.send("tanggal yang anda masukan itu udah kelewat :D")
            }
            else{
                receivedMessage.channel.send("tanggal/bulan/jam/menit tidak valid")
            }
        }
    }
    else{
        receivedMessage.channel.send(`perintah tidak valid, ketikkan "!help" untuk bantuan`);
    }
}
}
function addTugas(matkul,tugas,receivedMessage,tanggal,bulan,jam,menit){

    Tugas.create({matkul,tugas,tanggal,bulan,jam,menit})
    .then(()=>{

        receivedMessage.channel.send(`Data berhasil dimasukkan`);

    })
    .catch((err)=>{

        receivedMessage.channel.send(`Data gagal dimasukkan`);
        console.log(err);

    })

}
function showTugas(receivedMessage){
        let lines="";
        
        
        Tugas.find({},(err,res)=>{prosesShow(res,err,lines,receivedMessage)})

}
function deleteTugas(nomor,receivedMessage){
    Tugas.find({},(err,res)=>{
        res.sort((a, b) => {
            return selisih(a.bulan,a.tanggal,a.jam,a.menit) - selisih(b.bulan,b.tanggal,b.jam,b.menit)
        })
        res.forEach((e,i)=>{
            if(i+1 == nomor){
                Tugas.deleteOne({_id:e._id},(err)=>{
                    if(err){console.log(err)}
                }).then(()=>{
                    receivedMessage.channel.send(`Data berhasil dihapus`);
                }).catch((err)=>{
                    receivedMessage.channel.send(`Data gagal dihapus`);
                    console.log(err);
                })
            }
        })
    })
}
function hmin(tanggal,bulan){
return Math.ceil(parseFloat((new Date(`${bulan}/${tanggal}/${new Date().getFullYear()}`)-new Date)/(1000*60*60*24)));
}
function selisih(bulan,tanggal,jam,menit){
    return Math.ceil(parseFloat((new Date(`${new Date().getFullYear()}-${stringPlusZero(bulan)}-${stringPlusZero(tanggal)}T${stringPlusZero(jam)}:${stringPlusZero(menit)}`)-new Date())/(1000*60)));
}
function stringPlusZero(number){
    let stringed = ""
        if(number<10){
    return "0"+number
    }
    return number
}

function whiteSpace(huruf,length,white=" "){
    let total = "";
    total+=huruf
    for(i=0;i<(length-huruf.length);i++){
        total+=white;
    }
    return total;
}
function prosesShow(res,err,lines,receivedMessage){
    if( res.length==0){
        receivedMessage.channel.send("hore, ngga ada tugas :D")
        return
        }
    res.forEach((key,i)=>{

        if(selisih(key.bulan,key.tanggal,key.jam,key.menit)<0){
            Tugas.deleteOne({_id:key._id},(err)=>{
                if(err){console.log(err)}
                console.log("berhasil mendelete tugas Hmin minus")
            })
        }
    })
    res.sort((a, b) => {
        return selisih(a.bulan,a.tanggal,a.jam,a.menit) - selisih(b.bulan,b.tanggal,b.jam,b.menit)
    })
    let terpanjang = {
        matkul : 6,
        tugas : 5,
        hmin : 3
    };
    res.forEach((key,i)=>{
        if(key.matkul.length > terpanjang.matkul){
            terpanjang.matkul = key.matkul.length
        }
        if(key.tugas.length > terpanjang.tugas){
            terpanjang.tugas = key.tugas.length
        }
        if(`${key.hmin}`.length > terpanjang.hmin){
            terpanjang.hmin = `${key.hmin}`.length
        }
    })
    let total = terpanjang.matkul+terpanjang.tugas+25;
    //11 = pembatas antara(3), spasi pengapit(8)
    lines+=">>> ```";
    lines+= `┌${whiteSpace("",total,"─")}┐\n`;
    lines+= `│ No │ ${whiteSpace("Matkul",terpanjang.matkul)} │ ${whiteSpace("Tugas",terpanjang.tugas)} │ ${whiteSpace("H-X",2+2)} │ ${whiteSpace("Jam",5)} │\n`;
    lines+= `│${whiteSpace("",total,"─")}│\n`;
    res.forEach((key,i)=>{
        
        let hmins = hmin(key.tanggal,key.bulan)
        lines+= `│ ${whiteSpace(stringPlusZero(i+1),2)} │ ${whiteSpace(key.matkul,terpanjang.matkul)} │ ${whiteSpace(key.tugas,terpanjang.tugas)} │ H-${whiteSpace(hmins.toString(),2)} │ ${whiteSpace(`${key.jam}:${key.menit}`,5)} │\n`;
        // lines+=`${i+1}. ${key.matkul}, ${key.tugas}, H-${hmin(key.tanggal,key.bulan)}, ${key.jam}:${key.menit}\n`
        
        
})
    lines+=`└${whiteSpace("",total,"─")}┘`
    lines+="```";
    
    receivedMessage.channel.send(lines)

}
client.login(process.env.token);
