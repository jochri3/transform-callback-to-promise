const express = require('express');
const mysql = require('mysql');
const util = require('util');

const app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kda_test',
});

connection.query = util.promisify(connection.query);

connection.connect(function (err) {
  if (err) throw err;
  console.log('Connexion à la base de données établie');
});

//Utilisation de Asyn-await
app.get('/students', async (req, res) => {
  let data; //Pas besoin d'avoir une variable
  try {
    const resultats = await connection.query('select * from students');
    data = resultats; //Le but de cette variable est uniquement de montrer le fonctionnement de asyn-await
    return res.render('students/index', { students: data });
  } catch (error) {
    throw error;
  }
});

//Utilisation the ().then(res=>...).catch(error=>...)
app.get('/students/:id', (req, res) => {
  connection
    .query(`select * from students where id=${req.params.id}`)
    .then((result) => {
      return res.render('students/show', { student: result[0] });
    })
    .catch((error) => {
      throw error;
    });
});

app.listen(5000, () => console.log('Le serveur écoute sur le port 5000'));
