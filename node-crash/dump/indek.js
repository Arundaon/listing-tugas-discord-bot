var fs = require('fs');
//readFile
// fs.readFile("./dummy/teks1.txt",(err,data)=>{
//     if(err){
//         console.log("terjadi kesalahan");
//     }
//     else{
//         console.log("sukses euy");
//         console.log(data.toString());
//     }
// // })
//writeFile
// fs.writeFile('./dummy/teks11.html','<html><head></head><body>Hello wurld</body></html>',()=>{
//     console.log("teks teredit");
// })
//dir
var url = "./sumfolder";
if(!fs.existsSync(url)){
    console.log('didnt exist n create');
    fs.mkdir(url,()=>{console.log('yeeh succed')})
}
else{
    console.log('exist n delet');
    fs.rmdir(url,()=>{console.log('yeeh succed')})
}