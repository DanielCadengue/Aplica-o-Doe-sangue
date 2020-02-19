//configurando o servidor//
const express = require("express")
const server = express()

//configurar o servidor para apresentar os arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

//configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '22536807',
    host: 'Localhost',
    port: '5432',
    database: 'doe'
})



//configurando a template engine

const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCashe: true, //boolen ou booleano aceita dois valores , true ou false
})



//LIsta de doadores: vetor ou array




//configurar a apresentação da pagina//
server.get("/", function (req, res) {

    db.query("SELECT * FROM donors", function (err, result) {

        if (err) return res.send("erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })


})


server.post("/", function (req, res) {
    //pegar dados do formulario
    const name = req.body.name
    const blood = req.body.blood
    const email = req.body.email


    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatorios.")

    }

    //colocar valores dentro do banco de dados
    const query = `
    INSERT INTO donors ("name", "email", "blood") 
    VALUES($1, $2, $3)`

    const values = [name, email, blood]
    db.query(query, values, function (err) {

        //fluxo de erro
        if (err) return res.send("erro no banco de dados.")

        //fluxo ideal
        return res.redirect("/")

    })




})
//ligar o servidor e pemritir o acesso na porta 3000//
server.listen(3000, function () {
    console.log("iniciei o servidor")
})
