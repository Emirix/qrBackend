const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const connectionData = require("../db");

const db = mysql.createConnection(connectionData);

function generateKey() {
  return `${Math.random()}_${new Date().getMinutes()}:${new Date()}_${Math.random()}`
    .split(" ")
    .join("");
}

router.post("/onay",(req,res)=>{
    db.query(`UPDATE paket SET odeme = 'tamam' WHERE key_id = '${req.body.key}'`,(err,result)=>{
    })

    db.query(`UPDATE siparisler SET odeme = 'tamam' WHERE key_id = '${req.body.key}'`,(err,result)=>{
    })

    res.send("")
});

router.get("/paket",(req,res)=>{
    db.query("SELECT * FROM paket WHERE NOT durum = 'tamam' AND odeme = 'tamam' ",(err,result)=>{
        res.json(result)
    })
})

router.post("/durum",(req,res)=>{
    db.query(`UPDATE paket SET durum = '${req.body.durum}'  WHERE id = '${req.body.id}'`,(err,result)=>{
        if(err) throw err;
        res.json(result)

    })
})

router.post("/paket", (req, res) => {
  let urunler = JSON.parse(req.body.urunler);
  let total = 0;
  for (var i = 0; i < urunler.length; i++) {
    total += urunler[i].subtotal;
  }

  const key = generateKey();

  db.query(
    `INSERT INTO paket (data,ad_soyad,telefon,adres,total,key_id,odeme,durum) VALUES (
        '${req.body.urunler}',
        '${req.body.ad}',
        '${req.body.telefon}',
        '${req.body.adres}',
        '${total}',
        '${key}',
        'yapilmadi',
        'yeni'
    )`,
    (err, result) => {
      res.json(key);
    }
  );
});




router.post("/yeni", (req, res) => {
  let total = 0;
  for (var i = 0; i < req.body.length; i++) {
    total += req.body[i].subtotal;
  }
  const key = generateKey()
  req.body.siparis.forEach((val) => {
    db.query(
      `INSERT INTO siparisler (key_id,masa,odeme,durum,fiyat,to_id,isim,foto,note,adet,paket) VALUES (
        '${key}',
        '${val.masa}',
        'yapilmadi',
        'yeni',
        '${val.subtotal}',
        '${val.nere}',
        '${val.isim}',
        '${val.foto}',
        '${val.not}',
        '${val.adet}',
        '${req.body.paket}'
       
    ) `,
      (err, result) => {
        if (err) throw err;
        console.log("inserrted");
      }
    );
  });
  res.json(key);

});

module.exports = router;
