import mysql from "mysql";

var con = mysql.createConnection({
  host: "mysql-168093-0.cloudclusters.net",
  user: "admin",
  password: "UCMIGYUh",
  port: "10016",
  database: "finalproject2024",
});


con.connect((error) => {
  if (error) throw error;

  console.log("Connected to MySQL database!");
});

export default con;
