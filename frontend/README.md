# Buggy Insurance Frontend

SPA для Buggy Insurance — ЛК клиента и ЛК менеджера.

## Стек

- React 18 + TypeScript
- Vite
- React Router

## Запуск

```bash
# Установка зависимостей
npm install

# Режим разработки (порт 3000)
npm run dev

# Сборка
npm run build

# Превью production-сборки
npm run preview
```

## Конфигурация

Фронтенд использует Vite proxy: запросы к `/api` проксируются на бэкенд (по умолчанию `http://localhost:8080`). Настройка в `vite.config.ts`.

## Структура

- `/` — главная
- `/login`, `/register` — авторизация клиента
- `/products` — каталог страховок
- `/products/:type` — оформление заявки
- `/dashboard`, `/policies`, `/profile` — ЛК клиента (требуют авторизации)
- `/manager/login` — вход менеджера
- `/manager/dashboard`, `/manager/applications`, `/manager/statistics` — ЛК менеджера

## Тестовые данные (из ТЗ)

**Клиент:** client1@test.com / Test123!  
**Менеджер:** manager1@test.com / Manager123!
