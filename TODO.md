# TODO: Kanban-приложение на Next.js (с аналогиями для Vue3/Nuxt3 + TypeScript)

## 1. Инициализация проекта
- [x] Создать Next.js проект (`npx create-next-app@latest`)
- [x] Установить зависимости (`npm install`)

## 2. Базовая структура
- [ ] Главная страница с Kanban-доской `pages/index.tsx`
- [ ] Создать компоненты:
  - [ ] Колонка статуса (`<StatusColumn />`)
  - [ ] Карточка задачи (`<TaskCard />`)
  - [ ] Модальное окно для создания/редактирования задачи (`<TaskModal />`)
  
> **Аналогия:** Компоненты = SFC во Vue, только синтаксис JSX/TSX

## 3. Модель данных
- [ ] Описать интерфейс задачи (TypeScript interface)
- [ ] Описать интерфейс тега
- [ ] Описать список статусов (например: todo, in-progress, done)

> **Аналогия:** Интерфейсы как во Vue с TS

## 4. CRUD для задач
- [ ] Реализовать добавление задачи
- [ ] Реализовать редактирование задачи
- [ ] Реализовать удаление задачи
- [ ] Реализовать перемещение задачи между статусами (drag & drop или кнопки)

> **Аналогия:** useState/useReducer вместо reactive/ref, props и callbacks вместо emit

## 5. Система тегов
- [ ] Добавление/удаление тегов к задачам
- [ ] Фильтрация задач по тегам

## 6. Хранение данных
- [ ] Реализовать сохранение задач, тегов и статусов в LocalStorage (через custom hook, аналог composable/useStorage)
- [ ] Загрузка данных из LocalStorage при инициализации

## 7. UI/UX
- [ ] Адаптивная верстка
- [ ] Красивый и удобный интерфейс (можно использовать UI-библиотеку или TailwindCSS)

---

> **Аналогии:**
> - Компоненты и структура — как во Vue3, только с использованием Next.js (директории `app`, `components`, `hooks`).
> - Состояние — useState/useReducer вместо reactive/ref, custom hooks вместо composables.
> - TypeScript — интерфейсы для моделей данных, типизация props и hooks.
> - LocalStorage — через custom hook или напрямую через `window.localStorage`. 