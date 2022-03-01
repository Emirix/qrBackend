const express = require("express")
const router = express.Router()
const mysql = require("mysql");
const connectionData = require("../db")

const db = mysql.createConnection(connectionData)

// Restoran Bilgileri
router.post("/ekle",(req,res)=>{
   

    
var cart = req.body
var jsonStr = JSON.stringify(req.session.sepet );
sessionStorage.setItem( "cart", jsonStr );
// now the cart is {"item":"Product 1","price":35.50,"qty":2}
var cartValue = sessionStorage.getItem( "cart" );
var cartObj = JSON.parse( cartValue );
// original object

})


module.exports = router