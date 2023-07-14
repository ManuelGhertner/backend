import passport from 'passport';
import LocalStrategy from 'passport-local';
import GithubStrategy from 'passport-github2';
import userModel from "../managers/users/users.model.js";

// Concentramos lo relacionado a Passport en un archivo o directorio de estrategias.
// En este caso tenemos una llamada authRegistration para verificar que el mail a registrar no exista ya en bbdd
// pero lógicamente podríamos ir agregando otras.
// Al importar passport acá y exportarlo por defecto, con solo incluir passport desde este archivo lo tendremos
// disponible para utilizarlo donde sea necesario (ver app.js y main.routes.js)
const initializePassport = () =>{
    const verifyAuthRegistration = async (userName, password, done) => {
        try {
            const user = await userModel.findOne({ userName: userName });
    
            if (user === null) {
                // El mail no está registrado, todo ok para seguir
                return done(null);
            } else {
                return done(null, false, { message: 'El email ya se encuentra registrado' });
            }
        } catch(err) {
            return done(err.message);
        }
    };
    
    passport.use('authRegistration', new LocalStrategy({ usernameField: 'userName', passwordField: 'password' }, verifyAuthRegistration));
    
    
    
    
        // Estrategia Github
        // CUIDADO, DATOS SENSIBLES QUE DEBEN MANEJARSE POR EJEMPLO VIA VARIABLES DE ENTORNO
        // NO COMPARTIRLOS CON QUIENES NO SE DEBE NI UTILIZARLOS DIRECTAMENTE ESCRITOS AQUI
        // ESTE EJEMPLO ES SOLO ILUSTRATIVO, COLOCARLOS EN LUGAR SEGURO
        const githubData = {
            clientID: 'Iv1.24abb90ecc3ea09c',
            clientSecret: '83cf31439e26fdcd76548cfccf951db2552e246a',
            callbackUrl: 'http://localhost:3000/api/sessions/githubcallback',
            // scope: ['user:email'], 
        };
    
        const verifyAuthGithub = async (accessToken, refreshToken, profile, done) => {
            // Así como la estrategia local de passport opera con usuario y clave, la de
            // Github trabaja con un profile (perfil) devuelto por Github luego del proceso
            // de autenticación, con la cual podemos cotejar contra nuestros propios datos
            // y tomar también los que necesitmos para actualizar nuestra bbdd o mostrar.
            try {
                // console.log(userName);
                console.log("profile :", profile);
                console.log(profile._json.email);
                const user = await userModel.findOne({ userName: profile._json.email });
                console.log(user);
                // console.log("login :", profile._json.login);
                if (!user) {
                    // const [first, last] = fullName.split(' ');
                    // El callback done es el mecanismo utilizado por passport para retornar
                    // la respuesta de la autenticación
                    console.log("no hay user");
                    done(null, false);
                } else {
                    console.log(" hay user");
                    console.log(user);
                    done(null, user);
                }
            } catch (err) {
                return done(err.message);
            }
        }
    
        // Generamos una nueva estrategia GithubStrategy, con el nombre github
        // utilizando los datos y el callback configurados arriba
        passport.use('github', new GithubStrategy(githubData, verifyAuthGithub));
            // Recordar que passport necesita esta configuración de serializeUser
        // y deserializeUser para gestionar correctamente el pasaje de datos a session
    
    

    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (err) {
            done(err.message);
        }
    });

}


export default initializePassport;