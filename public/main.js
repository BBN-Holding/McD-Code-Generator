
const baseqrurl = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=';
function refetchCode() {
    fetch((document.URL + 'getcodes/')).then(codes => codes.json()).then(codes => {
        const random = Math.floor(Math.random()*codes.length);
        console.log(codes[random].coupon_code)
        document.getElementById('qrimg').src = baseqrurl + codes[random].coupon_code
        document.getElementById('code').innerHTML = codes[random].coupon_code
        document.getElementById('stats').innerHTML = codes.length + ' codes'
    })
}

refetchCode()

document.getElementById('used').addEventListener('click', () => {
    const code = document.getElementById('qrimg').src.replace(baseqrurl, '');
    fetch((document.URL + 'mark/'+code)).then(() => {
        refetchCode();
    })
})