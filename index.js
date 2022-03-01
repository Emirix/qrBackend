const express = require("express");
const app = express();
const dotenv = require("dotenv");
const restoranRouter = require("./routes/restoran");
const sepetRouter = require("./routes/sepet");
const siparisRouter = require("./routes/siparis");
const masaRouter = require("./routes/masalar");
const istekRouter = require("./routes/istek");
const cors = require("cors");
const session = require("express-session");
var bodyParser = require("body-parser");
const connectionData = require("./db");
const mysql = require("mysql");

const http = require("http");
const socketIo = require("socket.io");
const appServer = http.createServer(app); // express'i kullanan http server oluşturuluyor
const channel = socketIo(appServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const db = mysql.createConnection(connectionData);
app.use(
  session({
    secret: "qrmenu",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(bodyParser.json());

app.use(express.static("public"));

app.use(cors());
dotenv.config();

app.post("/login", (req, res) => {
  const nick = req.body.nick;
  const pass = req.body.pass;

  db.query(
    `SELECT * FROM restoran WHERE nick = '${nick}' AND sifre = '${pass}'`,
    (err, result) => {
      if (result.length == 0) {
        res.status(401).send("hata");
      } else {
        res.status(200).send(result[0]);
      }
    }
  );
});
app.use("/restoran", restoranRouter);
app.use("/masalar", masaRouter);
app.use("/sepet", sepetRouter);
app.use("/siparis", siparisRouter);
app.use("/istek", istekRouter);

channel.on("connection", (socket) => {
  console.log(
    `${Date(Date.now()).toLocaleString()}: yeni bir istemci bağlandı`
  );

  socket.on("input siparis", (data) => {
    console.log("Yeni sipariş geldi");
    socket.broadcast.emit("output siparis", data);
  });

  socket.on("input paket", (data) => {
    console.log("Yeni sipariş geldi");
    socket.broadcast.emit("output paket", data);
  });

  socket.on("input mesaj", (data) => {
    console.log("Yeni mesaj geldi" + data.masa + " " + data.mesaj);
    socket.broadcast.emit("output mesaj", data);
  });

  socket.on("input istek", (data) => {
    console.log("Yeni istek geldi ");
    socket.broadcast.emit("output istek", data);
  });

  socket.on("disconnect", () => {
    console.log(
      `${Date(Date.now()).toLocaleString()} istemci bağlantıyı kapattı`
    );
  });
});

appServer.listen(process.env.BACKEND_PORT, () => {
  console.log("Server çalışıyor. Port: " + process.env.BACKEND_PORT);
});
