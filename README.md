# 🩺 Sistema de Agendamiento de Citas Médicas

> API REST desarrollada con **NestJS** y **MySQL** para gestionar citas médicas entre doctores y pacientes.

---

# 📋 Requisitos Mínimos

| Herramienta | Versión mínima |
|------------|---------------|
| Node.js | 18.x |
| npm | 9.x |
| NestJS CLI | 11.x |
| MySQL | 8.x |
| Docker Desktop (Opcional) | 20.x |

---

# 🚀 Instalación

## 1️⃣ Clonar el repositorio

```bash
git clone <url-del-repositorio>

cd prueba_tecnica
```

---

## 2️⃣ Instalar dependencias

```bash
npm install
```

---

## 3️⃣ Configurar variables de entorno

Copia el archivo de ejemplo y renómbralo:

```bash
cp .env.template .env
```

Luego abre el archivo `.env` y configura los valores:

```env
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=promass_med_db
PORT=3000
```

---

# 🗄️ 4. Levantar la Base de Datos

Existen dos alternativas:

## 🐳 Opción A — Docker Desktop (Recomendada)

Esta opción es la más rápida porque no necesitas instalar MySQL manualmente.

Descarga Docker Desktop:

https://www.docker.com/products/docker-desktop

Una vez iniciado Docker, ejecuta:

```bash
docker-compose up -d
```

Verificar contenedor:

```bash
docker ps
```

---

## 💾 Opción B — MySQL Local

### Paso 1 — Instalar MySQL

Puedes utilizar:

- MySQL Community Server
- XAMPP
- WAMP
- MAMP

### Paso 2 — Crear Base de Datos

```sql
CREATE DATABASE promass_med_db;
```

### Paso 3 — Actualizar .env

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=promass_med_db
PORT=3000
```

---

# ▶️ 5. Ejecutar el Proyecto

### Desarrollo

```bash
npm run start:dev
```

### Producción

```bash
npm run start:prod
```

Swagger disponible en:

```text
http://localhost:3000/api
```

---

# ⚙️ Variables de Entorno

| Variable | Descripción | Ejemplo |
|-----------|------------|----------|
| DB_HOST | Host de la base de datos | localhost |
| DB_PORT | Puerto de la base de datos | 3307 |
| DB_USER | Usuario de MySQL | root |
| DB_PASSWORD | Contraseña de MySQL | mi_password |
| DB_NAME | Nombre de la base de datos | promass_med_db |
| PORT | Puerto de la API | 3000 |

---

# 🔗 Endpoints Disponibles

## 👨‍⚕️ Doctors

| Método | Endpoint | Descripción |
|----------|----------|------------|
| POST | `/api/doctors` | Registrar un nuevo doctor |
| GET | `/api/doctors/:id` | Buscar doctor por ID |

---

## 🧑‍💼 Patients

| Método | Endpoint | Descripción |
|----------|----------|------------|
| POST | `/api/patients` | Registrar un paciente |
| GET | `/api/patients/:id` | Buscar paciente por ID |

---

## 📅 Appointments

| Método | Endpoint | Descripción |
|----------|----------|------------|
| POST | `/api/appointments` | Crear cita |
| GET | `/api/appointments` | Listar citas |
| GET | `/api/appointments/:id` | Obtener cita |
| PATCH | `/api/appointments/:id/cancel` | Cancelar cita |

---

# 🧪 Casos de Uso

## 👨‍⚕️ Crear Doctor

### ✅ Correcto

```json
{
  "name": "Dr. Juan Pérez",
  "phone_number": "5512345678",
  "email": "doctor@example.com"
}
```

### ❌ Email Duplicado

```json
{
  "name": "Dr. Otro",
  "phone_number": "5599999999",
  "email": "doctor@example.com"
}
```

### ❌ Teléfono Duplicado

```json
{
  "name": "Dr. Otro",
  "phone_number": "5512345678",
  "email": "otro@example.com"
}
```

### ❌ Teléfono Inválido

```json
{
  "name": "Dr. Otro",
  "phone_number": "551234abcd",
  "email": "otro@example.com"
}
```

---

# 📅 Crear Cita

### ✅ Cita Válida

```json
{
  "date": "2027-01-01T10:00:00",
  "id_doctor": 1,
  "id_patient": 1
}
```

### ❌ Fecha en el pasado

```json
{
  "date": "2020-01-01T10:00:00",
  "id_doctor": 1,
  "id_patient": 1
}
```

### ❌ Hora ya pasada

```json
{
  "date": "2026-06-21T00:00:00",
  "id_doctor": 1,
  "id_patient": 1
}
```

---

# 📌 Reglas de Negocio

✅ Cada cita dura exactamente **30 minutos**

✅ Un doctor no puede tener citas traslapadas

✅ Un paciente no puede tener citas simultáneas

✅ Solo se permiten fechas futuras

✅ No se pueden cancelar citas iniciadas o finalizadas

✅ Las citas canceladas liberan el horario

✅ Zona horaria utilizada:

```text
America/Mexico_City
```

---

# 📖 Swagger

Accede a la documentación interactiva en:

```text
http://localhost:3000/api
```

---

<div align="center">

### 🩺 Promass Medical API

NestJS • TypeORM • MySQL • Swagger

</div>