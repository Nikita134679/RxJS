const express = require('express');
const cors = require('cors');  // Подключаем CORS
const faker = require('faker');
const app = express();
const port = 3000;

// Разрешаем все источники для CORS (можно уточнить конкретные домены)
app.use(cors());

app.get('/messages/unread', (req, res) => {
  const messages = [];
  for (let i = 0; i < 5; i++) {
    messages.push({
      id: faker.datatype.uuid(),
      from: faker.internet.email(),
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      received: faker.date.recent().getTime() / 1000,
    });
  }
  res.json({
    status: 'ok',
    timestamp: Math.floor(Date.now() / 1000),
    messages: messages,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
