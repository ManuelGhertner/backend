const express = require ("express");
const data = require ("../Json/products.json")
const PUERTO = 8080;

const server = express();


server.get("/products",  (req, res)=>{
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = limit ? data.slice(0,limit) : [];
    res.send(products)

});

server.get("/products/:pid", (req,res) =>{
    const id = parseInt(req.params.pid);
    const product = data.find(product => product.id === id );
    if(product){
        res.send(product);
    }   else {
        res.status(404).send('Producto no encontrado');
      }
})

server.listen(PUERTO, () =>{
    console.log("servidor express activo");
})