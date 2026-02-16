import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';
import { WebAppAuthProvider } from 'msal-node-wrapper';

import dotenv from 'dotenv';
dotenv.config();

import models from './models.js'
//import apiv2Router from './routes/v2/apiv2.js';
import apiv3Router from './routes/v3/apiv3.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const azure_secret = process.env.AZURE_AUTH_SECRET;
const azure_client_id = process.env.AZURE_CLIENT_ID; // replace with your application's "client id" also sometimes called the "application id"
const azure_authority_id = "f6b6dd5b-f02f-441a-99a0-162ac5060bd2";


// add middleware
app.use((req, res, next) => {
    req.models = models
    next();
});

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "This is some secret key I am making up 05n5yf5398hoiueneue",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

// initialize the wrapper
const authProvider = await WebAppAuthProvider.initialize({
    auth: {
        authority: "https://login.microsoftonline.com/" + azure_authority_id,
        clientId: azure_client_id,
        clientSecret: azure_secret,
        redirectUri: "https://websitesharerdb.me/redirect",
    }
});

app.use(authProvider.authenticate({
    protectAllRoutes: false, // force user to authenticate for all routes
    acquireTokenForResources: { // acquire an access token for this resource
        "graph.microsoft.com": { // you can specify the resource name as you like
            scopes: ["User.Read"], // scopes for the resource that you want to acquire a token for
            routes: ["/profile"] // acquire a token before the user hits these routes
        },
    }
}));

// app.use('/api/v2', apiv2Router);
app.use('/api/v3', apiv3Router);


app.get('/signin', (req, res, next) => {
   	 return req.authContext.login({
   		 postLoginRedirectUri: "/", // redirect here after login
   	 })(req, res, next);
});
app.get('/signout', (req, res, next) => {
   	 return req.authContext.logout({
   		 postLogoutRedirectUri: "/", // redirect here after logout
   	 })(req, res, next);
});



app.use(authProvider.interactionErrorHandler()); // this middleware handles interaction required errors

export default app;
