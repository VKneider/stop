let sentences = {
  
    "verifyUser": "SELECT COUNT(*) AS count FROM users WHERE email = $",
    "getUserData":"SELECT * FROM users WHERE email = $1",
    "getHashPassword":"SELECT password FROM users WHERE email = $1",
    "getUsers":"SELECT * FROM users",
    "getMethods":"SELECT * FROM methods",
    "insertUser":"INSERT INTO users (email, password, id_profile) VALUES ($1, $2, $3)",
    "updateCode":"UPDATE users SET code = $1 WHERE email = $2",
  
  }

  export default sentences;