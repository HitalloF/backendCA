const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// Conectar ao MongoDB
const uri = "mongodb://admin:123@localhost:27017/recifevivo?authSource=admin";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Modelo de usuário
const userSchema = new mongoose.Schema({
  email: String,
  senha: String,
});

const User = mongoose.model('User', userSchema);

// Rota de login
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });
    if (user && senha === user.senha) {
      console.log("User found:", user);
      console.log("Password match:", senha === user.senha);
      res.send('Login successful');
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Rota de registro
app.post('/register', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const newUser = new User({ email, senha });
    await newUser.save();
    console.log('cadastrado')
    res.status(201).send('Usuário cadastrado com sucesso!');

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).send('Erro ao registrar usuário');
  }
});


// listar users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('Erro ao buscar usuários: ' + error.message);
  }
});
// Rota para deletar usuário
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).send('Usuário deletado com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao deletar usuário: ' + error.message);
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
