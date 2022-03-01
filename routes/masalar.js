const express = require("express")
const router = express.Router()
const mysql = require("mysql");
const connectionData = require("../db")

const db = mysql.createConnection(connectionData)

router.post("/",(req,res)=>{
    db.query(`INSERT INTO masalar (masa_no,to_id) VALUES (
        '${req.body.masa}',
        '${req.body.id}'
    )`)
    res.json(req.body)
})

router.delete("/:id",(req,res)=>{
    db.query(`DELETE FROM masalar WHERE id = '${req.params.id}' `,(err,result)=>{
        res.json("")
    })
})


router.post("/hesap/:id",(req,res)=>{
    db.query(`UPDATE masalar SET fiyat = '${req.body.fiyat}' WHERE id = '${req.params.id}'`,(err,result)=>{
        res.json(result)
    })
})

router.get("/:id",(req,res)=>{
    db.query(`SELECT * FROM masalar WHERE to_id = ${req.params.id}`,(err,result)=>{
        res.json(result);
    })
})


module.exports = router