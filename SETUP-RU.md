# Как запустить и настроить Taskflow 3.0

1. В терминале VS Code: `npm install`, затем `npm run dev`.
2. Создай проект в https://console.firebase.google.com/.
3. Firebase → Project settings → Your apps → Add web app.
4. Создай `.env.local` в корне проекта по примеру `.env.example`.
5. Скопируй туда значения `apiKey`, `authDomain`, `projectId`, `appId`.
6. Firebase → Authentication → Sign-in method → включи Email/Password и Google.
7. Authentication → Settings → Authorized domains → добавь домен сайта после публикации.
8. Перезапусти `npm run dev` после сохранения `.env.local`.
9. В браузере проверь Signup, Login, Google sign-in, Profile, Logout.
10. Проверь старые функции Tasks, Dashboard, поиск и фильтры. Для проверки сборки: `npm run build`.

Без настройки Firebase сами страницы открываются, но реальная авторизация не работает.
Это ожидаемо до создания собственного Firebase-проекта.

**Не загружай `.env.local` на GitHub.** Загрузить нужно `.env.example`.

**При публикации на Vercel:** внеси те же 4 переменные в Environment Variables,
перепубликуй проект и разреши домен Vercel в Firebase Authorized domains.

**Важно для защиты:**
- `AuthContext` хранит пользователя и методы авторизации;
- `onAuthStateChanged` следит за состоянием входа;
- `ProtectedRoute` не пускает гостя на `/profile`;
- `cache.js` кеширует API-ответы на 30 секунд;
- после Create / Update / Delete кеш очищается;
- `useItems` загружает данные и игнорирует устаревшие ответы.
