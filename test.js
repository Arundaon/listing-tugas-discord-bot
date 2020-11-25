console.log(selisih(11,13,23,59));;;;;;;;;;;
function selisih(bulan,tanggal,jam,menit){
    return parseFloat((new Date(`${new Date().getFullYear()}-${bulan}-${tanggal}T${jam}:${menit}`)-new Date)/(1000*60*60));
}