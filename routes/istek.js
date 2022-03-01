const express = require("express")
const router = express.Router()
const mysql = require("mysql");
const connectionData = require("../db")

const db = mysql.createConnection(connectionData)

router.delete("/sil/:id",(req,res)=>{
    db.query(`DELETE FROM istekler WHERE id = '${req.params.id}' `,(err,result)=>{
        if(err) throw err;  
        console.log("inserrted")
        
        res.json(req.body)
    })
})

router.post("/kisayol",(req,res)=>{
    db.query(`INSERT INTO istekler (slug,text) VALUES (
        '${req.body.slug}',
        '${req.body.text}'
    ) `,(err,result)=>{
        if(err) throw err;  
        console.log("inserrted")
        
        res.json(req.body)
    })
})

router.get("/list/:slug",(req,res)=>{
    db.query(`SELECT * FROM istekler WHERE slug = '${req.params.slug}'`,(err,result)=>{
        if(err) throw err;
        
        res.json(result)
    })
})

router.get("/talepler/:slug",(req,res)=>{
    db.query(`SELECT * FROM arzular WHERE NOT durum = 'tamam' AND to_slug = '${req.params.slug}'` ,(err,result)=>{
        if(err) throw err;
        
        res.json(result)
    })
})


router.put("/guncelle/:id",(req,res)=>{
    db.query(`UPDATE arzular SET durum = '${req.body.durum}' WHERE id = '${req.params.id}' ` ,(err,result)=>{
        if(err) throw err;
        
        res.json(result)
    })
})

router.post("/",(req,res)=>{
    db.query(`INSERT INTO arzular (istek,masa,to_slug) VALUES (
        '${req.body.istek}',
        '${req.body.masa}',   
        '${req.body.slug}'     
    ) `,(err,result)=>{
        if(err) throw err;  
        console.log("inserrted")
        
        res.json(req.body)
    })
})


module.exports = router