# 🏍️ L.A.M.A Medellín - Sistema de Gestión de Miembros

Sistema web completo para la gestión de miembros del club de motociclistas L.A.M.A Medellín. Incluye administración de datos personales, información de motos, documentación, estadísticas avanzadas y generación de reportes.

🌐 **Frontend:** [https://lama-medellin.web.app](https://lama-medellin.web.app)  
⚙️ **Backend API:** [https://l-a-m-a-medell-n-members-management.onrender.com](https://l-a-m-a-medell-n-members-management.onrender.com)

---

## 📋 Características Principales

### 🎯 Gestión de Miembros
- **Registro Completo**: Captura de datos personales, información de contacto, emergencia, y datos del club
- **Información de Motos**: Registro detallado de marca, modelo, año, cilindraje, placa
- **Documentación**: Seguimiento de fechas de expedición de licencias de conducción y SOAT
- **Validaciones Inteligentes**: Solo 5 campos obligatorios (nombre, apellido, cédula, celular, correo) para facilitar el registro

### 📊 Estadísticas y Reportes
- **Dashboard de Estadísticas**: Visualización de métricas clave con gráficos interactivos
  - Total de miembros
  - Edad promedio
  - Cilindraje promedio
  - Licencias y SOATs vigentes
  - Distribución por ciudad y marca de moto
- **Reportes Personalizados**: Filtros avanzados por tipo, ciudad, rango, estatus
- **Exportación**: Generación de archivos PDF y CSV con datos completos

### 🎨 Interfaz Moderna
- **Navegación por Tabs**: Acceso rápido a Inicio, Registro, Listado, Estadísticas y Reportes
- **Diseño Responsive**: Optimizado para desktop, tablet y móvil
- **Tema Dark**: Interfaz moderna con gradientes y efectos visuales

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.2** con TypeScript
- **Firebase Authentication** para seguridad
- **Firestore Database** para almacenamiento de datos
- **jsPDF** y **jspdf-autotable** para generación de reportes
- **Axios** para comunicación con el backend
- **CSS3** con diseño responsive y animaciones

### Backend
- **ASP.NET Core 9.0** (C#)
- **Firestore SDK** para acceso a la base de datos
- **CORS** configurado para integración frontend-backend
- **API RESTful** con endpoints CRUD completos

### Despliegue
- **Render** → Backend (.NET API)  
- **Firebase Hosting** → Frontend (React App)  
- **GitHub** → Control de versiones

---

## 🚀 Instalación y Configuración Local

### Prerrequisitos
- **Node.js** 18 o superior
- **.NET SDK 9.0** o superior
- **Cuenta de Firebase** con proyecto configurado
- **Git** para clonar el repositorio

### 1. Clonar el Repositorio
```bash
git clone https://github.com/sandroide6/L.A.M.A-Medell-n-Members-Management-System.git
cd L.A.M.A-Medell-n-Members-Management-System
```

### 2. Configuración de Firebase

#### Crear Proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto llamado "LAMA-Medellin" (o el nombre que prefieras)
3. Habilita **Authentication** → Sign-in method → **Google**
4. Crea una base de datos **Firestore** en modo producción

#### Obtener Credenciales
1. En Project Settings → General, encuentra la configuración de tu aplicación web
2. Copia las credenciales de configuración

#### Configurar Frontend
Crea el archivo `Lama_Fronted/.env` con el siguiente contenido:

```env
REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
REACT_APP_FIREBASE_APP_ID=tu-app-id
REACT_APP_BACKEND_URL=http://localhost:8000
```

#### Configurar Backend
Crea el archivo `Lama_Backend/firebase-key.json` con las credenciales de la cuenta de servicio:

1. En Firebase Console → Project Settings → Service Accounts
2. Click en "Generate new private key"
3. Descarga el archivo JSON y renómbralo a `firebase-key.json`
4. Copia el archivo a la carpeta `Lama_Backend/`

**⚠️ IMPORTANTE**: Nunca subas `firebase-key.json` a control de versiones. Ya está incluido en `.gitignore`.

### 3. Instalar Dependencias

#### Frontend
```bash
cd Lama_Fronted
npm install
```

#### Backend
```bash
cd Lama_Backend
dotnet restore
```

### 4. Ejecutar en Desarrollo

#### Ejecutar Manualmente

**Terminal 1 - Backend:**
```bash
cd Lama_Backend
ASPNETCORE_URLS=http://localhost:8000 dotnet run
```
El backend estará disponible en `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd Lama_Fronted
npm start
```
El frontend estará disponible en `http://localhost:5000`

### 5. Acceder a la Aplicación
1. Abre tu navegador en `http://localhost:5000`
2. Click en "Iniciar sesión con Google"
3. Autoriza la aplicación con tu cuenta de Google
4. Comienza a gestionar miembros

---

## 🌐 Despliegue en Producción

### Backend en Render

#### 1. Preparación
1. Crea una cuenta en [Render.com](https://render.com)
2. Asegúrate de tener tu archivo `firebase-key.json` listo

#### 2. Crear Web Service
1. En Render Dashboard, click en "New +" → "Web Service"
2. Conecta tu repositorio de GitHub/GitLab
3. Configura el servicio:

**Build & Deploy:**
```
Name: lama-backend
Runtime: .NET
Branch: main
Root Directory: Lama_Backend
Build Command: dotnet publish -c Release -o out
Start Command: dotnet out/LAMA_API.dll
```

**Environment:**
- Selecciona "Free" o el plan que prefieras
- Region: Elige la más cercana (por ejemplo, Oregon)

#### 3. Variables de Entorno
En la sección "Environment", agrega:

```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:8000
GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/firebase-key.json
```

#### 4. Configurar Secreto (firebase-key.json)
1. En tu servicio de Render, ve a "Environment"
2. Click en "Secret Files"
3. Crea un nuevo archivo secreto:
   - **Filename**: `firebase-key.json`
   - **Contents**: Pega todo el contenido de tu archivo `firebase-key.json`

#### 5. Deploy
1. Click en "Create Web Service"
2. Render automáticamente construirá y desplegará tu backend
3. Una vez desplegado, copia la URL (ejemplo: `https://lama-backend.onrender.com`)



### Frontend en Firebase Hosting

#### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Configurar Producción
Actualiza `Lama_Fronted/.env.production`:

```env
REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
REACT_APP_FIREBASE_APP_ID=tu-app-id
REACT_APP_BACKEND_URL=https://tu-backend-url.onrender.com
```

**⚠️ IMPORTANTE**: Actualiza `REACT_APP_BACKEND_URL` con la URL de tu backend en Render.

#### 3. Construir para Producción
```bash
cd Lama_Fronted
npm run build
```

#### 4. Inicializar Firebase
```bash
firebase login
firebase init hosting
```

Configuración:
- Public directory: `build`
- Configure as single-page app: `Yes`
- Set up automatic builds: `No`
- Overwrite index.html: `No`

#### 5. Desplegar
```bash
firebase deploy --only hosting
```

Firebase te dará una URL como: `https://tu-proyecto.web.app`

### Actualizar Backend en Producción
Después de desplegar el frontend, actualiza la configuración de CORS en `Lama_Backend/Program.cs`.

Agrega las URLs de tu frontend en producción a la lista `allowedOrigins`:

```csharp
var allowedOrigins = new List<string>
{
    "http://localhost:3000",
    "http://localhost:5000",
    "https://tu-proyecto.web.app",           // ⬅️ Agrega tu URL de Firebase Hosting
    "https://tu-proyecto.firebaseapp.com"    // ⬅️ Agrega tu URL alternativa
};
```

Luego, haz commit y push. Render automáticamente re-desplegará.

**Nota**: Asegúrate de reemplazar `tu-proyecto` con el nombre real de tu proyecto de Firebase.

---

## 📱 Uso del Sistema

### Inicio
- Vista de bienvenida con descripción del sistema
- Accesos rápidos a registro y listado
- Características principales del sistema

### Registro de Miembros
1. Click en la tab "Registro"
2. Llena los campos obligatorios:
   - Nombre
   - Apellido
   - Cédula
   - Celular
   - Correo Electrónico
3. Completa información opcional según disponibilidad
4. Click en "Guardar"

### Listado de Miembros
- Visualiza todos los miembros en una tabla completa
- Filtra por ciudad o busca por texto
- Edita o elimina miembros
- Exporta a Excel (CSV)

### Estadísticas
- Visualiza métricas clave del club
- Gráficos de distribución por ciudad y marca
- Exporta estadísticas en PDF o CSV

### Reportes
- Filtra por tipo de reporte, ciudad, rango, estatus
- Busca miembros específicos
- Genera reportes en PDF o CSV con datos completos

---

## 🔒 Seguridad

- **Autenticación**: Firebase Authentication con Google OAuth
- **Validación de Tokens**: Backend valida tokens de Firebase en cada petición
- **Base de Datos**: Firestore con reglas de seguridad
- **Backend**: CORS configurado solo para orígenes autorizados
- **Credenciales**: Almacenadas en variables de entorno y archivos secretos

---

## 🐛 Solución de Problemas

### El frontend no puede conectarse al backend
- Verifica que `REACT_APP_BACKEND_URL` en `.env` apunte a la URL correcta
- Asegúrate de que el backend esté corriendo
- Revisa la consola del navegador para errores CORS

### Error "Firebase config is missing"
- Verifica que todas las variables `REACT_APP_FIREBASE_*` estén configuradas en `.env`
- Reinicia el servidor de desarrollo después de cambiar `.env`

### Backend: Error "Could not load file or assembly"
- Ejecuta `dotnet restore` en la carpeta `Lama_Backend`
- Verifica que tengas .NET 9.0 instalado

### Error al exportar PDF/CSV
- Asegúrate de que las dependencias `jspdf` y `jspdf-autotable` estén instaladas


### Render: Backend no inicia
- Verificar que `firebase-key.json` esté configurado correctamente en Secret Files
- Revisa los logs en el dashboard de Render
- Asegúrate de que `GOOGLE_APPLICATION_CREDENTIALS` apunte a `/etc/secrets/firebase-key.json`

verificar la consola del navegador para errores específicos
---

## 📝 Estructura del Proyecto

```
L.A.M.A-Medell-n-Members-Management-System/
├── Lama_Fronted/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Inicio.tsx
│   │   │   ├── MiembroForm.tsx
│   │   │   ├── MiembrosList.tsx
│   │   │   ├── Estadisticas.tsx
│   │   │   └── Reportes.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   └── LoginPage.tsx
│   │   ├── App.tsx
│   │   ├── firebaseConfig.ts
│   │   ├── styles.css
│   │   └── index.css
│   ├── package.json
│   └── .env (crear)
│
├── Lama_Backend/
│   ├── Controllers/
│   │   └── MiembrosController.cs
│   ├── MODELS/
│   │   └── Miembro.cs
│   ├── Services/
│   │   └── FirestoreService.cs
│   ├── Middleware/
│   │   └── FirebaseAuthMiddleware.cs
│   ├── Program.cs
│   ├── LAMA_API.csproj
│   └── firebase-key.json 
│
└── README.md



**Desarrollado por Eldestructor🏍️**
