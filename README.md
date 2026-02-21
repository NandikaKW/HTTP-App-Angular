# 🚀 HttpApp – Angular HTTP CRUD Application

A modern **Angular 14 CRUD Application** that demonstrates REST API integration using Angular’s `HttpClient`.
This project showcases clean architecture, component-based design, API communication, reactive forms, and Angular Material UI implementation.

---
## 📌 Project Overview

This application performs full **CRUD (Create, Read, Update, Delete)** operations using a public REST API and implements:

* 📄 View all posts (with pagination)
* 🔎 Search & filter posts
* 🔍 Find a post by ID
* ➕ Create a new post
* ✏️ Update an existing post
* 🗑️ Delete a post with confirmation modal
* 🎬 Interactive home page with embedded video

### 🌐 API Used

```
https://jsonplaceholder.typicode.com/posts
```

---

## 🛠️ Tech Stack

* **Angular CLI 14.2.13**
* TypeScript
* Angular Router
* Angular HTTP Client
* Reactive Forms
* Angular Material
* RxJS
* REST API (JSONPlaceholder)

---

## 🧱 Application Architecture

```
src/app/
│
├── components/
│   ├── home/       → Landing page
│   ├── all/        → Display all posts (pagination + search)
│   ├── find/       → Find post by ID
│   ├── new/        → Create post
│   ├── update/     → Update post
│   ├── delete/     → Delete post
│
├── services/
│   └── post.service.ts   → Handles all HTTP requests
│
├── app-routing.module.ts
└── app.module.ts
```

---

## 🔄 CRUD Implementation

### 🔹 Read (GET)

* Fetch all posts
* Fetch single post by ID
* Client-side pagination
* Search filtering logic

### 🔹 Create (POST)

* Reactive form validation
* Success popup message
* Snackbar error handling

### 🔹 Update (PUT)

* Load data into form
* Update via API call
* Success confirmation UI

### 🔹 Delete (DELETE)

* Confirmation modal before deletion
* Success feedback message

---

## 🧭 Application Routes

| Route     | Description    |
| --------- | -------------- |
| `/`       | Home Page      |
| `/all`    | View All Posts |
| `/find`   | Find Post      |
| `/new`    | Create Post    |
| `/update` | Update Post    |
| `/delete` | Delete Post    |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/NandikaKW/HTTP-App-Angular.git
```

### 2️⃣ Navigate to Project

```bash
cd http-app
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Run Development Server

```bash
ng serve
```

Open in browser:

```
http://localhost:4200/
```

---

## 📦 Build for Production

```bash
ng build
```

Build output will be generated inside:

```
dist/
```

---

## 🧪 Running Tests

### Unit Tests

```bash
ng test
```

### End-to-End Tests

```bash
ng e2e
```

---

## 🧠 What This Project Demonstrates

* Scalable Angular component architecture
* Service-based API integration
* HTTP request handling with Observables
* Reactive Form validation
* Client-side pagination implementation
* Search and filtering logic
* Angular Material UI integration
* Routing configuration & navigation

---

## ⚠️ Important Note

This application uses **JSONPlaceholder**, a fake REST API.

* POST, PUT, and DELETE requests simulate changes.
* Data is not permanently stored.
* Built for learning and demonstration purposes.

## 📬 Contact

If you’d like to connect or collaborate:

## 👨‍💻 Developer

**Nandika Kaweesha**
*MERN & MEAN Stack Developer | Frontend Developer*

---


