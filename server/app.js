const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');
const cors = require('cors');
const chalk = require('chalk');
const dotenv = require('dotenv');
const initDatabase = require('./start/initDatabase');
const routes = require('./routes');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/api', routes);

const PORT = process.env.PORT || config.get('port') || 8080;
app.use('/images', express.static(path.join(__dirname, 'images')));
if (process.env.NODE_ENV === 'production') {
  console.log('production');
  app.use('/', express.static(path.join(__dirname, 'client')));
  app.use('/images', express.static(path.join(__dirname, 'images')));

  const indexPath = path.join(__dirname, 'client', 'index.html');

  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
}

async function start() {
  try {
    mongoose.connection.once('open', () => {
      initDatabase();
    });
    await mongoose.connect(
      "mongodb+srv://netninja:test1234@cluster0.dr9enon.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log(chalk.green('MongoDB connected.'));
    app.listen(PORT, () => console.log(chalk.green(`Server has been started on port ${PORT}...`)));
  } catch (error) {
    console.log(chalk.red(error.message));
    process.exit(1);
  }
}

start();

//Commentaires
//L'application initialise des bibliothèques qui seront utilisés: express pour la réalisation de 
//page web etf (les méthodes précisent le type de donnée qui vont etre utilisé), cors pour le controle
//des requetes entrantes sur le serveur, spécifie à la racine /api des routes utilisée pour les requetes
//réalisée au serveur, et spécifie à la racine '/' des routes pour le coté client. Par ailleurs, toutes type
//de requetes HTTP réalisée sur le client retourne la page d'accueil index.html.
//La fonction start se connecte à MongoDB puis lance initDatabase (réinitialise la bdd auprès de mongDB).