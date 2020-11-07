let jason = {
    nomor0:{
        nomornya : 0
    },
    nomor4:{
        nomornya : 4
    },
    nomor5:{
        nomornya : 5
    },
    nomor3:{
        nomornya : 3
    },
    nomor1:{
        nomornya : 1
    },
    nomor2:{
        nomornya : 2
    },
}
let keynya = Object.keys(jason)
keynya.sort((a,b)=>{
    console.log(`sort a : ${jason[a].nomornya}, sort b : ${jason[b].nomornya}`)
    return jason[a].nomornya-jason[b].nomornya
})
keynya.forEach(e=>console.log(jason[e]))
// Object.keys(jason).forEach(e=>console.log(jason[e]))