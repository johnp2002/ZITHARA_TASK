const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/customers', async (req, res) => {
  try {
    const { name, age, phone, location } = req.body;
    const customer = await prisma.customer.create({
      data: { name, age, phone, location }
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error creating customer' });
  }
});

app.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customers' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
