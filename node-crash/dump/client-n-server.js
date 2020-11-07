// const http = require('http');
// const fs = require('fs');
// const server =http.createServer((req,res)=>{//dilakukan setiap ada request
//     let page = "./Website";
//     res.setHeader("Content-Type","text/html");
//     switch(req.url){
//         case "/":
//             page+="/home.html";
//             fs.readFile(page,(err,data)=>{
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
//                     res.write(data);
//                     res.end();
//                 }
//             })
//             break;
//             case "/about":
//             page+="/about.html";
//             fs.readFile(page,(err,data)=>{
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
//                     res.write(data);
//                     res.end();
//                 }
//             })
//             break;
//             default:
//             page+="/404.html"
//             fs.readFile(page,(err,data)=>{
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
//                     res.write(data);
//                     res.end();
//                 }
//             })
//         }
        
        
// })
// server.listen(3333,"localhost",()=>{
//     console.log("im listening");
// })