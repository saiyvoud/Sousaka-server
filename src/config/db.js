import mysql from "mysql";

var con = mysql.createConnection({
  host: "mysql-167163-0.cloudclusters.net",
  user: "admin",
  password: "x6ciFMZh",
  port: "19823",
  database: "finalproject2024",
});


con.connect((error) => {
  if (error) throw error;

  console.log("Connected to MySQL database!");
});

export default con;
