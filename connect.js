
import mysql2 from "mysql2";

export const db = mysql2.createConnection({
  host: "localhost",
    user: "root",
    password: "ROOT",
    database: "accbook1",
});

// import { createPool } from "mysql";
// export const db = createPool({
//   host: "191.101.230.154",
//   user: "u747016719_acbok",
//   password: "K18~Srm^",
//   database: "u747016719_accbook",
//   connectionLimit: 1000,
// });




// .htaccess file code - 
// -----------------------------
// CODE START
// -----------------------------
// RewriteEngine On

// RewriteCond %{HTTPS} off

// RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]






// Certificate is saved at: /etc/letsencrypt/live/khataease.com/fullchain.pem
// Key is saved at:         /etc/letsencrypt/live/khataease.com/privkey.pem
// This certificate expires on 2024-04-19.
// These files will be updated when the certificate renews.
// Certbot has set up a scheduled task to automatically renew this certificate in the background.

// Deploying certificate
// Successfully deployed certificate for khataease.com to /etc/nginx/sites-enabled/default
// Congratulations! You have successfully enabled HTTPS on https://khataease.com