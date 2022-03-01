const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const mysql = require("mysql");
const connectionData = require("../db");
const db = mysql.createConnection(connectionData);

// Restoran Bilgileri
router.get("/:slug", (req, res) => {
  db.query(
    `SELECT * FROM restoran WHERE slug = '${req.params.slug}'`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
      

    }
  );
});

router.put("/:slug", (req, res) => {
  db.query(
    `UPDATE restoran SET restoran_adi = '${req.body.ad}', aciklama = '${req.body.aciklama}', telefonp = '${req.body.telefon}' WHERE slug = '${req.params.slug}'`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

router.put("/odeme/:slug", (req, res) => {
  db.query(
    `UPDATE restoran SET odeme = '${req.body.val}' WHERE slug = '${req.params.slug}' `,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

router.put("/check/:slug", (req, res) => {
  db.query(
    `UPDATE restoran SET ${req.body.col} = '${req.body.val}' WHERE slug = '${req.params.slug}'`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

router.post("/kategori", (req, res) => {
  db.query(
    `INSERT INTO kategoriler (to_id,name,slug,anchor) VALUES ('${
      req.body.admin_id
    }','${req.body.kategori}','${req.body.admin_slug}','${Cevir(
      req.body.kategori.toLowerCase()
    )}')`,
    (err, result, fields) => {
      if (err) throw err;
      console.log(result);
      
      res.json(result);
    }
  );
});

router.delete("/kampanya/:id",(req,res)=>{
    db.query(`DELETE FROM kampanya WHERE urun_id = '${req.params.id}'`,(err,result)=>{
        
      res.json(result)
    })
})

router.post("/kampanya", (req, res) => {
    db.query(
      `INSERT INTO kampanya (urun_id,slug) VALUES ('${req.body.id}','${req.body.slug}') `,
      (err, result) => {
        
        res.json(result);
      }
    );
  });

router.get("/kampanya/:slug", (req, res) => {
  db.query(
    `SELECT * FROM kampanya    
    INNER JOIN urunler ON kampanya.urun_id = urunler.id WHERE kampanya.slug = '${req.params.slug}'`,
    (err, result) => {
      
      res.json(result);
    }
  );
});

router.get("/urunler/:slug", (req, res) => {
  db.query(
    `SELECT * FROM urunler WHERE slug = '${req.params.slug}' ORDER BY ${
      req.query.order || "id DESC"
    }`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

function Cevir(text) {
  var trMap = {
    çÇ: "c",
    ğĞ: "g",
    şŞ: "s",
    üÜ: "u",
    ıİ: "i",
    öÖ: "o",
  };
  for (var key in trMap) {
    text = text.replace(new RegExp("[" + key + "]", "g"), trMap[key]);
  }
  return text
    .replace(/[^-a-zA-Z0-9\s]+/gi, "")
    .replace(/\s/gi, "-")
    .replace(/[-]+/gi, "-")
    .toLowerCase();
}

router.post("/urunler/", (req, res) => {
  db.query(
    `INSERT INTO urunler (anchor,isim,aciklama,resim,fiyat,slug,sure,malzemeler,kucuk,kategori_id) VALUES 
   ('${Cevir(req.body.kategori)}','${req.body.isim}','${
      req.body.aciklama
    }','resim','${req.body.fiyat}','${req.body.slug}','${req.body.sure}','${
      req.body.malzemeler
    }','${Number(req.body.kucuk)}','${Number(req.body.kategori_id)}') `,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

// TEKİL ÜRÜN
router.get("/urun/:id", (req, res) => {
  db.query(
    `SELECT * FROM urunler WHERE id = '${req.params.id}'`,
    (err, result) => {
      if (err) throw err;
      db.query(
        `SELECT * FROM urunler WHERE slug = '${result[0].slug}' AND kucuk = '0' ORDER BY RAND() LIMIT 2`,
        (err2, result2) => {
          if (err2) throw err2;
          result[0].other = result2;
          
          res.json(result);
        }
      );
    }
  );
});

// KATEGORİLER
router.get("/kategoriler/:slug", (req, res) => {
  db.query(
    `SELECT * FROM kategoriler WHERE slug = '${req.params.slug}'`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

router.put("/kategoriler/:id", (req, res) => {
  db.query(
    `UPDATE kategoriler SET name = '${req.body.isim}' WHERE id= '${req.params.id}'`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

// YORUMLAR GE T

router.get("/yorumlar/:id", (req, res) => {
  db.query(
    `SELECT * FROM yorumlar WHERE to_id = '${req.params.id}' AND onay != 'bekliyor' LIMIT ${req.query.limit}`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

router.get("/ikramlar/:id", (req, res) => {
  db.query(
    `SELECT * FROM ikramlar WHERE slug = '${req.params.id}'`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

router.delete("/kategori/:id", (req, res) => {
  db.query(
    `DELETE FROM kategoriler WHERE id = '${req.params.id}'`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

// YORUMLAR POST
router.post("/yorumlar/:id", (req, res) => {
  db.query(
    `INSERT INTO yorumlar (to_id,yorum, ip,onay,star) VALUES ('${req.params.id}', '${req.body.yorum}','${req.ip}','bekliyor','${req.body.yildiz}')`,
    (err, result) => {
      if (err) throw err;
      
      res.sendStatus(201);
    }
  );
});

// Kısayollar
router.get("/kisayollar/:slug", (req, res) => {
  db.query(
    `SELECT * FROM istekler WHERE slug = '${req.params.slug}'`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

// SEARCH
router.get("/ara/:slug", (req, res) => {
  db.query(
    `SELECT * FROM urunler WHERE isim LIKE '%${req.query.search}%' OR aciklama LIKE '%${req.query.search}%' AND slug   = '${req.params.slug}'`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

router.get("/islemdeki-siparisler/:id", (req, res) => {
  db.query(
    `SELECT * FROM siparisler WHERE NOT durum = 'tamam'  AND to_id   = '${req.params.id}'`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

router.post("/durum", (req, res) => {
  db.query(
    `UPDATE paket SET durum = '${req.body.durum}'  WHERE id = '${req.body.id}'`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

router.put("/yorum/:id", (req, res) => {
  db.query(
    `UPDATE yorumlar SET onay = '${req.body.durum}'  WHERE id = '${req.params.id}'`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

router.delete("/yorum/:id", (req, res) => {
  db.query(
    `DELETE FROM yorumlar WHERE id = '${req.params.id}'`,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

router.get("/yorumlar/all/:id", (req, res) => {
  db.query(
    `SELECT * FROM yorumlar WHERE to_id = '${req.params.id}' AND onay='bekliyor' `,
    (err, result) => {
      if (err) throw err;
      
      res.json(result);
    }
  );
});

module.exports = router;
