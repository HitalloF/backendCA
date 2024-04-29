const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const uri = "mongodb://admin:123@localhost:27017/recifevivo?authSource=admin";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Failed to connect to MongoDB:', err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const newUser = new User({ email, senha });
    await newUser.save();
    res.status(201).send('Usuário cadastrado com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).send('Erro ao registrar usuário');
  }
});

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
