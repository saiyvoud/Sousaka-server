import mysql from "mysql";

var con = mysql.createConnection({
  host: "mysql-170040-0.cloudclusters.net",
  user: "admin",
  password: "Dno9q93D",
  port: "18948",
  database: "finalproject2024",
});


con.connect((error) => {
  if (error) throw error;

  console.log("Connected to MySQL database!");
});

export default con;
