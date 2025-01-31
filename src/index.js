import { ajax } from 'rxjs/ajax';
import { interval } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

// URL вашего API
const apiUrl = 'http://localhost:3000/messages/unread';
const pollInterval = 5000; // Интервал опроса в 5 секунд

function startMessagePoll() {
  interval(pollInterval).pipe(
    switchMap(() =>
      ajax.getJSON(apiUrl).pipe(
        map(response => {
          console.log("Получен ответ от сервера:", response);  // Добавляем лог
          return response.messages || [];  // Получаем массив сообщений
        }),
        catchError(() => {
          console.error('Ошибка при запросе сообщений');
          return []; // Возвращаем пустой массив в случае ошибки
        })
      )
    )
  ).subscribe(messages => {
    console.log("Полученные сообщения:", messages);  // Логируем полученные сообщения

    if (messages.length === 0) {
      console.log('Нет новых сообщений');
    } else {
      // Обновляем таблицу с новыми сообщениями
      messages.forEach(message => {
        const truncatedSubject = truncateSubject(message.subject);  // Обрезаем subject до 15 символов
        const formattedDate = formatDate(message.received);  // Форматируем дату

        // Добавляем строку в таблицу
        const table = document.getElementById('messagesTable');
        const row = table.insertRow(0); // Вставляем строку в начало таблицы
        row.innerHTML = `<td>${message.from}</td><td>${truncatedSubject}</td><td>${formattedDate}</td>`;
      });
    }
  });
}

// Функция для обрезки subject до 15 символов
function truncateSubject(subject) {
  return subject.length > 15 ? subject.slice(0, 15) + '...' : subject;
}

// Функция для форматирования даты
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000); // Преобразуем timestamp в миллисекунды
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

// Запускаем опрос сообщений
startMessagePoll();
