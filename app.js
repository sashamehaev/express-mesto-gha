const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  const _id = '1231122212';
  console.log(_id);
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
