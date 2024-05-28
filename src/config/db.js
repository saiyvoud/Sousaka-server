import mysql from "mysql";

var con = mysql.createConnection({
  host: "mysql-173974-0.cloudclusters.net",
  user: "admin",
  password: "pPTUYG0t",
  port: "10007",
  database: "finalproject2024",
});


con.connect((error) => {
  if (error) throw error;

  console.log("Connected to MySQL database!");
});

export default con;
