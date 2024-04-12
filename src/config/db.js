import mysql from "mysql";

var con = mysql.createConnection({
  host: "mysql-169032-0.cloudclusters.net",
  user: "admin",
  password: "2WIIqUdY",
  port: "10005",
  database: "finalproject2024",
});


con.connect((error) => {
  if (error) throw error;

  console.log("Connected to MySQL database!");
});

export default con;
