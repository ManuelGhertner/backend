import { Router } from "express";
import Users from "../managers/users/users.dbClass.js";
import { __dirname } from "../utils.js";

const routerDbusers = (io) => {
    const router = Router();
    const manager = new Users();

    // const validate = async (req, res, next) => {
    //     if (req.session.userValidated) {
    //         next();
    //     } else {
    //         res.status(401).send({ status: 'ERR', error: 'No tiene autorización para realizar esta solicitud' });
    //     }
    // }
       
    router.get('/users/:id?', async (req, res) => { 
        try {
            if (req.params.id === undefined) {
                const users = await manager.getUsers();
                res.status(200).send({ status: 'OK', data: users });
            } else {
                const user = await manager.getUserById(req.params.id);
                res.status(200).send({ status: 'OK', data: user });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: 'No se encuentra el usuario' });
        }
    });
    
    router.post('/users',  async (req, res) => {
        try {
            await manager.addUser(req.body);
            io.emit('new_user', req.body);
    
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send({ status: 'ERR', error: 'No se puede agregar el usuario' });
        }
    });
    
    router.put('/users/:id',  async (req, res) => {
        try {
            await manager.updateUser(req.params.id, req.body);
        
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: 'No se puede actualizar el usuario' });
        }
    });
    
    router.delete('/users/:id', async(req, res) => {
        try {
            await manager.deleteUser(req.params.id);
        
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });

    return router;
}

export default routerDbusers;







// import {Router} from "express";
// const routerDbusers = Router();

// routerDbusers.get("/login", async (req, res) =>{
//     try{
//         let data;
//         if(req.session.counter){
//             req.session.counter++;
//             data = `Este sitio fue visitado ${req.session.counter} veces`;
//         } else {
//             req.session.counter = 1;
//             data = "Bienvenido, gracias por su primera visita!"
//         }
//         res.status(200).send({ status: "OK", data: data});
//     } catch (err){
//         res.status(500).send({ status: "ERR", error: err.message});
//     }
// })

// routerDbusers.get("/logout", async (req, res) =>{
//     try{
//         req.session.destroy((err) =>{
//             if (err){
//                 res.status(200).send({status: "OK", data: "Error al cerrar sesion"});
//             } else{
//                 res.status(200).send({status: "OK", data: "Usuario deslogueado"})
//             }
//         }
//         )
//     }catch (err){
//         res.status(500).send({status: "ERR", error: err.message});
//     }
// })
// export default routerDbusers;