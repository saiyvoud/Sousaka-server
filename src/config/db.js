import mysql from "mysql";

var con = mysql.createConnection({
  host: "mysql-172431-0.cloudclusters.net",
  user: "admin",
  password: "PVpWruSr",
  port: "10025",
  database: "finalproject2024",
});


con.connect((error) => {
  if (error) throw error;

  console.log("Connected to MySQL database!");
});

export default con;
