import { Router } from "express";
import Users from "../managers/users/users.dbClass.js";
import Products from "../managers/products/indexProducts.dbClass.js";
import productModel from "../managers/products/products.model.js";
import userModel from "../managers/users/users.model.js";
import cookieParser from "cookie-parser";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import initializePassport from "../auth/passport.strategies.js";
const users = new Users();
const manager = new Products();
initializePassport();
const mainRoutes = (io, store, baseUrl, productsPerPage) => {
    const router = Router();
    router.use(cookieParser());
    router.get('/', async (req, res) => {        

        store.get(req.sessionID, async (err, data) => {
            if (err) console.log(`Error al recuperar datos de sesión (${err})`);

            if (data !== null && (req.session.userValidated || req.sessionStore.userValidated)) {
    
                const options = {
                    limit: 3,
                    page: 1
                };
                const products = await productModel.paginate({}, options);

                const prevLink = products.hasPrevPage ? `/api/products/${products.prevPage}` : null;
                const nextLink = products.hasNextPage ? `/api/products/${products.nextPage}` : null;
                res.render("products", {
                    products: products.docs.map(product => product.toObject()),
                    prevLink: prevLink,
                    nextLink: nextLink,
                    cookieInfo: req.cookies // Información de la cookie
                  });

            } else {
                res.render('login', {
                    sessionInfo: req.session.userValidated !== undefined ? req.session : req.sessionStore
                });
            }
        }); 
    });

    router.get('/logout', async (req, res) => {
        req.session.userValidated = req.sessionStore.userValidated = false;

        req.session.destroy((err) => {
            req.sessionStore.destroy(req.sessionID, (err) => {
                if (err) console.log(`Error al destruir sesión (${err})`);

                // Se recarga la página base en el browser
                console.log('Sesión destruída');
                res.redirect(baseUrl);
            });
        })
    });

    router.post('/login', async (req, res) => {
        req.sessionStore.userValidated = false;
        const { login_email, login_password } = req.body; // Desestructuramos el req.body

        const user = await userModel.findOne({ userName: login_email });

        if (!user) {
            req.sessionStore.errorMessage = 'No se encuentra el usuario';
            res.redirect(baseUrl);
        } else if (!isValidPassword(user, login_password)) {
            req.sessionStore.errorMessage = 'Clave incorrecta';
            res.redirect(baseUrl);
            // res.redirect('http://localhost:3000/ae');
        } else {
            req.sessionStore.userValidated =  req.session.userValidated = true;
            req.sessionStore.errorMessage = '';
            req.sessionStore.firstName = user.firstName;
            req.sessionStore.lastName = user.lastName;
            const userData = {
                        id: user.id,
                        username: user.firstName,
                        lastname: user.lastName,
                        role: user.role
                    };
        res.cookie('userData', userData, { maxAge: 86400000, httpOnly: true });
        res.redirect(baseUrl);
            
        }
        
        
        // const { login_email, login_password } = req.body; // Desestructuramos el req.body
        // const user = await users.validateUser(login_email, login_password);

        // if (user === null) { // Datos no válidos
        //     req.session.userValidated = req.sessionStore.userValidated = false;
        //     req.session.errorMessage = req.sessionStore.errorMessage = 'Usuario o clave no válidos';
        // } else {
        //     req.session.userValidated = req.sessionStore.userValidated = true;
        //     req.session.errorMessage = req.sessionStore.errorMessage = '';
       
        //     const userData = {
        //         id: user.id,
        //         username: user.firstName,
        //         lastname: user.lastName,
        //         role: user.role
        //     };
    
        //     res.cookie('userData', userData, { maxAge: 86400000, httpOnly: true });
        // }  

        // // Se recarga la página base en el browser
        // res.redirect(baseUrl);
    });

    // router.post('/register', async (req, res) =>{
    //     const { firstName, lastName, userName, password} = req.body;
    //     if(!firstName || !lastName || !userName || !password) res.status(400).send("Faltan campos obligatorios");
    //     const newUser = { firstName: firstName, lastName: lastName, userName: userName, password: createHash(password)};
    //     console.log(newUser);   
    //     const process = userModel.create(newUser);
    //     res.status(200).send(process);

    // });
    router.get('/regfail', async (req, res) => {
        res.render('registration_err', {});
    });

router.post("/register", passport.authenticate("authRegistration", {failureRedirect: "/regfail"}), async (req, res) =>{
    const {firstName, lastName, userName, password} = req.body;
    if(!firstName || !lastName || !userName || !password) res.status(400).send("Faltan campos obligatorios");
    const newUser = { firstName: firstName, lastName: lastName, userName: userName, password: createHash(password)};
    const process = userModel.create(newUser);
    res.status(200).send({ message: "OK para carga", data: newUser});
})

    router.get('/register', async (req, res) => {
        res.render('registration', {});
    });
    router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
        // Vacío
    });

    router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

    return router;
}

export default mainRoutes;