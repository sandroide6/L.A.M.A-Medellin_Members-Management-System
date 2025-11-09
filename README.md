# 🏍️ L.A.M.A Medellín – Members Management System

Sistema de gestión de miembros del capítulo **L.A.M.A. Medellín**, desarrollado con **React + Firebase + ASP.NET Core 9 Web API**.  
Centraliza la información de los miembros, mejora la administración interna y garantiza seguridad en el acceso mediante autenticación con Google y validación en backend.

🌐 **Frontend:** [https://lama-medellin.web.app](https://lama-medellin.web.app)  
⚙️ **Backend API:** [https://l-a-m-a-medell-n-members-management.onrender.com](https://l-a-m-a-medell-n-members-management.onrender.com)

---

## 🚀 Descripción

Este sistema fue creado para resolver la dispersión de datos y la falta de herramientas administrativas dentro del capítulo **L.A.M.A. Medellín**.  
Incluye autenticación segura, CRUD completo de miembros, almacenamiento en Firestore y exportación de datos.

---

## ✅ Características Principales

- 🔐 **Inicio de sesión con Google (Firebase Auth)**
- ✅ **Validación de tokens en backend** con Firebase Admin SDK
- 👥 **CRUD completo de miembros**
- 📋 **Lista de miembros con filtros básicos**
- 💾 **Base de datos en Firestore**
- 📤 **Exportación de datos en CSV**
- 🔒 **API privada protegida con middleware personalizado**

---

## 🏗️ Tecnologías Utilizadas

### 🖥️ Frontend
- React 19 + TypeScript  
- Firebase Authentication  
- Axios  


### ⚙️ Backend
- ASP.NET Core 9 Web API  
- Firebase Admin SDK  
- Google.Cloud.Firestore  
- Swagger / OpenAPI  
- Middleware personalizado para autenticación Firebase  


### 💾 Base de datos
✅ **Cloud Firestore** (única base de datos del proyecto)

### 🔹 Despliegue
- **Render** → Backend (.NET API)  
- **Firebase Hosting** → Frontend (React App)  
- **GitHub** → Control de versiones y CI/CD
- 
---

## 🧱 Arquitectura

React (Firebase Auth)
|
| -> Google Login
|
V
Obtención de ID Token
|
| -> Authorization: Bearer <token>
|
V
ASP.NET Core 9 Web API
|
| -> Middleware FirebaseAuthMiddleware
| -> Validación del token en Firebase Admin
|
V
Firestore (Cloud Firestore)

## ⚙️ Instalación y Configuración

### 1️⃣ Clonar el repositorio

git clone https://github.com/sandroide6/L.A.M.A-Medell-n-Members-Management-System.git
cd L.A.M.A-Medell-n-Members-Management-System

✅ Frontend (React)
Instalar dependencias
cd Lama_Frontend
npm install
npm run dev

Crear archivo .env
REACT_APP_FIREBASE_API_KEY=xxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxxx
REACT_APP_FIREBASE_PROJECT_ID=xxxx
REACT_APP_FIREBASE_APP_ID=xxxx

Ejecutar el frontend
npm start


✅ Backend (ASP.NET Core 9)
Instalar dependencias
cd Lama_Backend
dotnet restore
dotnet ef database update
dotnet run

Agregar credenciales de Firebase
Coloca tu archivo dentro del backend:
Lama_Backend/firebase-key.json

Ejecutar backend localmente
dotnet run



📦 L.A.M.A-Medellín-Members-Management-System
├── 📁 Lama_Backend
│ ├── Controllers/
│ ├── Data/
│ ├── Middlewares/
│ ├── Migrations/
│ ├── Models/
│ ├── Properties/
│ ├── Service/
│ ├── appsettings.json
│ ├── appsettings.Development.json
│ ├── Dockerfile
│ ├── Program.cs
│ ├── LAMA_API.csproj
│ └── LAMA_API.sln
│
└── 📁 Lama_Frontend
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── api.ts
│ └── main.tsx
├── public/
├── firebase.json
├── package.json
├── package-lock.json
└── tsconfig.json


🔒 Seguridad🔒
Autenticación en frontend con Firebase Auth

Validación de tokens en backend con Firebase Admin SDK

Middleware personalizado protege todas las rutas privadas

Firestore solo es accesible mediante el backend

🔒 Autenticación con Firebase
El sistema usa Firebase Authentication para validar usuarios.
Cada solicitud al backend incluye el token JWT del usuario autenticado:

Authorization: Bearer <token>

El backend valida este token antes de permitir el acceso a los endpoints.



🗺️ Roadmap
✅ Login con Google
✅ Validación backend
✅ CRUD miembros
✅ Exportación CSV



🌍 Demo en Producción
🔗 Frontend: https://lama-medellin.web.app
🔗 Backend: https://l-a-m-a-medell-n-members-management.onrender.com

