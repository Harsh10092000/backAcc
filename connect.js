
// import mysql2 from "mysql2";

// export const db = mysql2.createConnection({
//   host: "localhost",
//     user: "root",
//     password: "ROOT",
//     database: "accbook1",
// });


export const db = createPool({
  host: "191.101.230.154",
  user: "u747016719_acbok",
  password: "K18~Srm^",
  database: "u747016719_accbook",
  connectionLimit: 1000,
});