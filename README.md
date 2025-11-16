# ESP32 Dashboard – Next.js + MongoDB + SSE

Plataforma web para monitorear temperatura y humedad enviadas por una placa **ESP32**.  
Incluye autenticación de usuarios, asociación de cada cuenta con un `deviceId`, almacenamiento de lecturas en **MongoDB** y alertas en tiempo (casi) real usando **Server‑Sent Events (SSE)**.

---

## 🧩 Características principales

- Login y registro de usuarios (usuario + contraseña).
- Asociación de un **`deviceId`** (por ejemplo, el ID fijo de la placa ESP32).
- Recepción periódica de lecturas de **humedad** y **temperatura** desde el ESP32 vía HTTP (`/api/telemetry`).
- Manejo de lecturas inválidas (NaN → `null`) sin romper el JSON.
- Cálculo del **promedio de temperatura** en el backend y comparación contra un umbral de alerta (`alertTemp`).
- Almacenamiento de:
  - Usuarios
  - Lecturas (humidity/temperature)
  - Alertas generadas
- **Alertas en tiempo real** hacia el frontend mediante SSE (`/api/alerts/stream`).
- Pantalla de **configuración de alerta** con slider para ajustar `alertTemp`.
- UI responsive pensada para **móvil** y **PC**.

---

## ✅ Requisitos para correr el proyecto

### Software

- **Node.js** ≥ 18 (se recomienda la LTS más reciente).
- **npm** o **pnpm** o **yarn** (ejemplos con npm).
- Una instancia de **MongoDB**:
  - Local en Docker **o**
  - MongoDB Atlas en la nube.
- Git (opcional, para clonar el repositorio).

### Hardware / Simulación

- Placa **ESP32** real **o** simulada en [Wokwi](https://wokwi.com/).
- Sensor **DHT22** (temperatura y humedad) conectado al ESP32 en pines configurados en el firmware.

---

## 📂 Estructura de carpetas

Estructura simplificada del proyecto:

```text
esp32-dashboard/
├─ app/
│  ├─ (auth)/
│  │  ├─ login/
│  │  │  └─ page.tsx        # Pantalla de login
│  │  └─ register/
│  │     └─ page.tsx        # Pantalla de registro + deviceId
│  ├─ (app)/
│  │  ├─ layout.tsx         # Layout privado (navbar, logout, AlertListener)
│  │  ├─ dashboard/
│  │  │  └─ page.tsx        # Dashboard principal del usuario
│  │  ├─ realtime/
│  │  │  └─ page.tsx        # Vista del último promedio en “tiempo real”
│  │  └─ settings/
│  │     └─ page.tsx        # Configuración de alertTemp (slider)
│  ├─ api/
│  │  ├─ auth/
│  │  │  ├─ register/
│  │  │  │  └─ route.ts     # POST /api/auth/register
│  │  │  └─ login/
│  │  │     └─ route.ts     # POST /api/auth/login
│  │  ├─ telemetry/
│  │  │  └─ route.ts        # POST /api/telemetry (ESP32)
│  │  ├─ user/
│  │  │  └─ alert/
│  │  │     └─ route.ts     # GET/POST /api/user/alert (alertTemp)
│  │  └─ alerts/
│  │     └─ stream/
│  │        └─ route.ts     # GET /api/alerts/stream (SSE)
│  └─ page.tsx              # Landing / redirección
├─ lib/
│  ├─ db.ts                 # Conexión a MongoDB (MONGODB_URI)
│  └─ auth.ts               # Manejo de JWT: signToken, verifyToken, etc.
├─ models/
│  ├─ User.ts               # Esquema de usuario
│  ├─ Reading.ts            # Esquema de lecturas de telemetría
│  └─ Alert.ts              # Esquema de alertas de temperatura
├─ components/
│  └─ AlertListener.tsx     # Cliente SSE que escucha alertas y muestra un banner
├─ public/                  # Recursos estáticos (iconos, etc.)
├─ styles/                  # Configuración de estilos, Tailwind, etc.
├─ tailwind.config.ts       # Configuración Tailwind CSS
├─ next.config.mjs          # Configuración Next.js
├─ package.json
├─ tsconfig.json
└─ .env.local               # Variables de entorno (NO se commitea)
```

### Descripción de las carpetas clave

- **app/**  
  Implementación con App Router (Next.js 13+).  
  Se separa en:
  - `(auth)`: pantallas públicas (login / registro).
  - `(app)`: pantallas privadas (requieren usuario autenticado).
  - `api/`: rutas de API (auth, telemetría, alertas, configuración).

- **lib/**  
  Código reutilizable:
  - `db.ts`: inicializa y reutiliza la conexión a MongoDB.
  - `auth.ts`: helpers para firmar/verificar JWT y extraer usuario del request.

- **models/**  
  Esquemas de Mongoose:
  - `User`: `{ username, passwordHash, deviceId, alertTemp }`.
  - `Reading`: lecturas con arrays de humedad y temperatura.
  - `Alert`: eventos cuando el promedio supera el umbral.

- **components/**  
  Componentes compartidos.  
  `AlertListener` abre una conexión SSE y escucha eventos `tempAlert` para mostrar alertas en cualquier página privada.

---

## 🔐 Variables de entorno

Crear un archivo **`.env.local`** en la raíz del proyecto:

```env
MONGODB_URI=mongodb+srv://USER:PASS@cluster/esp32-dashboard?retryWrites=true&w=majority
JWT_SECRET=un-secreto-largo-y-aleatorio
```

Ejemplo para desarrollo con Mongo local (Docker):

```env
MONGODB_URI=mongodb://localhost:27017/esp32-dashboard
JWT_SECRET=un-secreto-largo-y-aleatorio
```

---

## 🧱 Levantar MongoDB en local (opcional)

Si no usás Atlas y preferís Docker:

```bash
docker run --name esp32-mongo -p 27017:27017 -d mongo:6
```

La URI de conexión local sería:

```text
mongodb://localhost:27017/esp32-dashboard
```

---

## 🛠️ Instalación y ejecución del proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/esp32-dashboard.git
cd esp32-dashboard
```

*(Si ya tenés la carpeta local, podés saltar este paso.)*

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear el archivo `.env.local` con:

```env
MONGODB_URI=...
JWT_SECRET=...
```

Asegurate de que la cadena `MONGODB_URI` apunte al cluster/local correcto.

### 4. Verificar conexión a MongoDB

Podés correr un simple comando de prueba (ej: desde una ruta API o utilizando Mongo Compass) para confirmar que el URI es válido.  
Si al hacer login/registro ves errores tipo `MongoServerError: bad auth`, revisá:

- usuario/contraseña del cluster Atlas
- IPs permitidas en "Network Access"
- nombre de base de datos en la URI (después del `/`)

### 5. Correr el proyecto en desarrollo

```bash
npm run dev
```

Abrí tu navegador en:

```text
http://localhost:3000
```

---

## 🔄 Flujo de uso de la app web

1. **Registro** (`/register`)
   - Crear un usuario indicando:
     - `username`
     - `password`
     - `deviceId` (ej: `ABC123DEF4`)
   - Se crea el usuario en MongoDB con un `alertTemp` por defecto (por ejemplo, 30 °C).

2. **Login** (`/login`)
   - Iniciar sesión con `username` + `password`.
   - Se genera un JWT que se guarda en `localStorage`.
   - El usuario es redirigido a `/dashboard`.

3. **Dashboard** (`/dashboard`)
   - Muestra información general del dispositivo asociado.
   - Puede mostrar lecturas más recientes y estado del sistema.

4. **Realtime** (`/realtime`)
   - Realiza peticiones al backend para obtener el promedio más reciente.
   - Permite ver si el sistema está en alerta.

5. **Settings** (`/settings`)
   - Slider para ajustar el `alertTemp` del usuario.
   - Se hace `GET /api/user/alert` para leer el valor actual.
   - Se hace `POST /api/user/alert` para salvar el nuevo valor.

6. **Alertas en tiempo real**
   - `AlertListener` abre una conexión SSE a `/api/alerts/stream?token=...`.
   - Cuando el backend genera una alerta (promedio > alertTemp), se crea un documento `Alert` y el SSE la envía al cliente.
   - El frontend muestra un banner de alerta visible en cualquier página privada.

---

## 📡 Integración con el ESP32

El firmware del ESP32:

- Lee periódicamente el **DHT22** (humedad y temperatura).
- Guarda las muestras en buffers durante ~1 minuto.
- En cada ciclo de minuto:
  - Imprime los arrays en el Serial.
  - Construye un JSON con este formato:

    ```json
    {
      "id": "ABC123DEF4",
      "humidity": [40.12, null, 41.05, 39.87],
      "temperature": [23.5, 23.7, null, 24.0]
    }
    ```

    - Los valores inválidos se envían como `null` (no `NaN`) para que el JSON sea válido.

  - Envía ese JSON por POST a:

    ```text
    POST /api/telemetry
    Content-Type: application/json
    ```

- El backend:
  - Normaliza los arrays (ignora `null` para el promedio).
  - Calcula `avgTemperature`.
  - Compara con `alertTemp` del usuario.
  - Si corresponde, crea un `Alert`.
  - Devuelve algo como:

    ```json
    {
      "ok": true,
      "isAlert": true,
      "avgTemperature": 38.7,
      "readingId": "65b0f2c9aef12a..."
    }
    ```

- El ESP32 loguea en Serial lo importante:
  - `isAlert`
  - `avgTemperature`
  - `readingId`

---

## 🚀 Despliegue en producción (resumen)

Una posible configuración:

- **Frontend + Backend**: desplegados en [Vercel](https://vercel.com/) con el propio repo de Next.js.
- **Base de datos**: MongoDB Atlas (cluster gratuito).
- **ESP32 real** configurado para apuntar a la URL pública de tu app:

  ```text
  const char* SERVER_URL = "https://tu-app.vercel.app/api/telemetry";
  ```

Asegurate de:

- Configurar las mismas variables de entorno (`MONGODB_URI`, `JWT_SECRET`) en el panel de Vercel.
- Permitir el tráfico desde la IP del ESP32 a tu cluster Atlas (si hace falta).

---

## 🔧 Extensiones futuras

- Histórico de datos con gráficos (Recharts, Chart.js, etc.).
- Soporte para múltiples `deviceId` por usuario.
- Web Push Notifications para alertas importantes.
- Migración de SSE a WebSockets o Pusher para más escala.
- IA simple para detección de anomalías térmicas.

---

## 📜 Licencia

Proyecto orientado a uso educativo / académico.  
Adaptar o extender según las necesidades de tu materia, cátedra o proyecto personal.
