import express from 'express';
import cors from 'cors';
import legoRoutes from './routes/legoRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Connection']
}));

app.use(express.json());

// lego routes:
app.use(legoRoutes);
// user routes:
app.use(userRoutes);

app.get('/', (req, res) => {
  // res.send('Hello World!')
  res.json({ msg: "hello world"});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


