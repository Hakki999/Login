const express = require("express");
const app = express();
const session = require('express-session')
const bodyParser = require("body-parser");
const flash = require('connect-flash');
const jwt = require("jsonwebtoken");
const users = require("./db");
require("dotenv").config();
const cookieParser = require("cookie-parser");

app.set("view egine", 'ejs');
app.use(express.static(__dirname + "/views/"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRET_S,
    saveUninitialized: true,
    resave: true
}))
app.use(flash());
app.use(cookieParser());

function verifyJWT(req, res, next) {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({
        auth: false,
        message: 'No token provided.'
    });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(500).json({
            auth: false,
            message: 'Failed to authenticate token.'
        });

        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
    });
}

app.get("/", (req, res) => {

    res.render("./index.ejs", {
        message: req.flash("message")
    });
})

app.post("/login", (req, res) => {
    let tmn = req.body.login[0].length;
    let tms = req.body.login[1].length;
    if (tmn > 4 && tmn < 30 && tms > 4 && tms < 30) {
        users.find({
            nome: req.body.login[0],
            senha: req.body.login[1]
        }, (err, row) => {
            if (err) {
                console.log("Erro: ", err);
            } else {
                if (row[0]) {
                    let id = row[0].id;
                    let token = jwt.sign({
                        id
                    }, process.env.SECRET, {
                        expiresIn: 10
                    });
                    res.cookie("token", token, {
                        expire: 0 + Date.now()
                    })
                    res.redirect("/home");
                } else {
                    req.flash('message', 'Erro: Dados invalidos!!!');
                    res.redirect("/");
                }
            }
        })
    } else {
        req.flash('message', 'Erro: Dados invalidos!!!');
        res.redirect("/");
    }
})

app.get("/home", verifyJWT, (req, res, next) => {

    res.send("OI")
})


app.listen(process.env.PORT, err => {
    if (err) {
        console.log("Erro ao iniciar o server: ", err);
    } else {
        console.log("Servidor: ", process.env.PORT);
    }
})