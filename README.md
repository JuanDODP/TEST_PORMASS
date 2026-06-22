Sistema de Agendamiento de Citas Médicas
API REST desarrollada con NestJS y MySQL para gestionar citas médicas entre doctores y pacientes.


Requisitos mínimos
Herramienta
Versión mínima
Node.js
18.x
npm
9.x
NestJS CLI
11.x
MySQL
8.x
Docker Desktop (opcional)
20.x



Instalación
1. Clonar el repositorio
git clone https://github.com/JuanDODP/TEST_PORMASS.git

cd TEST_PORMASS

2. Instalar dependencias
npm install
3. Configurar variables de entorno
Copia el archivo de ejemplo y renómbralo:

cp .env.example .env

Luego abre el archivo .env y llena los valores:

DB_HOST=localhost

DB_PORT=3307 este por lo regular es 3306

DB_USER=root

DB_PASSWORD=tu_password

DB_NAME=nombre_de_tu_base_de_datos

PORT=3000


4. Levantar la base de datos
Tienes dos caminos aquí, elige el que más te acomode.


Opción A — Con Docker Desktop (la más rápida)
Esta opción es la más sencilla porque no necesitas instalar MySQL en tu computadora. Docker se encarga de todo.

Si aún no tienes Docker Desktop, descárgalo desde su página oficial: https://www.docker.com/products/docker-desktop, instálalo como cualquier programa y ábrelo antes de continuar.

Con Docker Desktop corriendo, ejecuta este comando en la raíz del proyecto:

docker-compose up -d

Eso es todo. Docker va a descargar la imagen de MySQL y levantar la base de datos automáticamente en el puerto 3307. No tienes que crear nada manualmente.

Para confirmar que el contenedor está corriendo:

docker ps


Opción B — Sin Docker (MySQL instalado en tu máquina)
Si no quieres usar Docker, la alternativa es instalar MySQL directamente en tu sistema operativo. A NestJS y a TypeORM les da exactamente igual dónde esté alojada la base de datos, siempre y cuando las credenciales para conectarse sean correctas.

Paso 1 — Instalar MySQL

Tienes dos formas populares de hacerlo:

La forma oficial: Descarga el instalador de MySQL Community Server desde https://dev.mysql.com/downloads/installer/, ejecútalo y sigue los pasos. Durante el proceso te pedirá que definas una contraseña para el usuario root.
La forma fácil (paquetes todo en uno): Instala XAMPP (Windows/Mac/Linux), WAMP (Windows) o MAMP (Mac). Estos programas instalan MySQL automáticamente y te dan un panel de control con botones de Start/Stop para encender la base de datos con un clic.

Paso 2 — Crear la base de datos

A diferencia de Docker, aquí debes crear la base de datos tú mismo antes de arrancar el proyecto. Abre tu terminal o tu cliente visual (TablePlus, DBeaver, MySQL Workbench) y ejecuta:

CREATE DATABASE medical_db;

Paso 3 — Actualizar el archivo .env

Como estás usando MySQL nativo, el puerto por defecto es 3306 (no 3307 como en Docker). Tu .env debe quedar así:

DB_HOST=localhost

DB_PORT=3306

DB_USER=root

DB_PASSWORD=la_contraseña_que_definiste_al_instalar

DB_NAME=medical_db

PORT=3000

Con esto listo, ya puedes pasar directo al siguiente paso. No necesitas ejecutar docker-compose up -d.


5. Correr el proyecto
# Modo desarrollo (con hot reload)

npm run start:dev

# Modo producción

npm run start:prod

La API y la documentación Swagger estarán disponibles en: http://localhost:3000/api


Variables de entorno
Variable
Descripción
Ejemplo
DB_HOST
Host de la base de datos
localhost
DB_PORT
Puerto de la base de datos
3307 (Docker) / 3306 (local)
DB_USER
Usuario de MySQL
root
DB_PASSWORD
Contraseña de MySQL
mi_password
DB_NAME
Nombre de la base de datos
medical_db
PORT
Puerto en el que corre la API
3000



Endpoints disponibles
Doctors
Método
Endpoint
Descripción
POST
/api/doctors
Registrar un nuevo doctor
GET
/api/doctors/:id
Buscar un doctor por ID

Patients
Método
Endpoint
Descripción
POST
/api/patients
Registrar un nuevo paciente
GET
/api/patients/:id
Buscar un paciente por ID

Appointments
Método
Endpoint
Descripción
POST
/api/appointments
Agendar una nueva cita
GET
/api/appointments
Listar citas con filtros opcionales
GET
/api/appointments/:id
Buscar una cita por ID
PATCH
/api/appointments/:id/cancel
Cancelar una cita



Casos de uso
Doctores — POST /api/doctors
// Crear doctor exitosamente ✅

{

    "name": "Dr. Juan Pérez",

    "phone_number": "5512345678",

    "email": "doctor@example.com"

}

// Email duplicado → 400 ❌

{

    "name": "Dr. Otro",

    "phone_number": "5599999999",

    "email": "doctor@example.com"

}

// Teléfono duplicado → 400 ❌

{

    "name": "Dr. Otro",

    "phone_number": "5512345678",

    "email": "otro@example.com"

}

// Teléfono con letras → 400 ❌

{

    "name": "Dr. Otro",

    "phone_number": "551234abcd",

    "email": "otro@example.com"

}


Pacientes — POST /api/patients
// Crear paciente exitosamente ✅

{

    "name": "María García",

    "phone_number": "5587654321",

    "email": "paciente@example.com"

}

// Email duplicado → 400 ❌

// Teléfono duplicado → 400 ❌

// Teléfono con letras → 400 ❌


Citas — POST /api/appointments
// Cita válida (base para las demás pruebas) ✅

{

    "date": "2027-01-01T10:00:00",

    "id_doctor": 1,

    "id_patient": 1

}

Validaciones de fecha:

// Fecha en el pasado → 400 ❌

{ "date": "2020-01-01T10:00:00", "id_doctor": 1, "id_patient": 1 }

// Fecha de hoy pero hora ya pasada → 400 ❌

{ "date": "2026-06-21T00:00:00", "id_doctor": 1, "id_patient": 1 }

Validaciones de traslape (con cita existente a las 10:00):

// Empieza antes y termina en medio → 409 ❌

{ "date": "2027-01-01T09:50:00", "id_doctor": 1, "id_patient": 2 }

// Misma hora exacta → 409 ❌

{ "date": "2027-01-01T10:00:00", "id_doctor": 1, "id_patient": 2 }

// Empieza en medio de la cita → 409 ❌

{ "date": "2027-01-01T10:15:00", "id_doctor": 1, "id_patient": 2 }

// Justo cuando termina la anterior → 201 ✅

{ "date": "2027-01-01T10:30:00", "id_doctor": 1, "id_patient": 2 }

// Completamente libre → 201 ✅

{ "date": "2027-01-01T11:00:00", "id_doctor": 1, "id_patient": 2 }

Validaciones de paciente:

// El paciente tampoco puede tener dos citas al mismo tiempo → 409 ❌

// Si el paciente 1 ya tiene cita a las 10:00, no puede tener otra a las 10:15

{ "date": "2027-01-01T10:15:00", "id_doctor": 2, "id_patient": 1 }

Doctor o paciente inexistente:

// Doctor no existe → 404 ❌

{ "date": "2027-01-01T10:00:00", "id_doctor": 9999, "id_patient": 1 }

// Paciente no existe → 404 ❌

{ "date": "2027-01-01T10:00:00", "id_doctor": 1, "id_patient": 9999 }


Citas — PATCH /api/appointments/:id/cancel
// Cancelar cita existente → 200 ✅

PATCH /api/appointments/1/cancel

// Cancelar una cita que ya fue cancelada → 400 ❌

PATCH /api/appointments/1/cancel  (segunda vez)

// Cancelar cita en proceso (empezó pero no ha terminado) → 400 ❌

// Ejemplo: son las 10:15 y la cita es a las 10:00 (termina a las 10:30)

// Cancelar cita que ya finalizó → 400 ❌

// Ejemplo: son las 11:00 y la cita era a las 10:00 (terminó a las 10:30)

// Cita no existe → 404 ❌

PATCH /api/appointments/9999/cancel

Una vez cancelada, el horario queda libre:

// Si la cita de las 10:00 fue cancelada, este horario vuelve a estar disponible ✅

{ "date": "2027-01-01T10:00:00", "id_doctor": 1, "id_patient": 2 }


Citas — GET /api/appointments
// Todas las citas → 200 ✅

GET /api/appointments

// Filtrar por doctor → 200 ✅

GET /api/appointments?doctor_id=1

// Filtrar por rango de fechas → 200 ✅

GET /api/appointments?start_date=2027-01-01&end_date=2027-01-31

// Filtro combinado → 200 ✅

GET /api/appointments?doctor_id=1&start_date=2027-01-01&end_date=2027-01-31

// Doctor inexistente → 404 ❌

GET /api/appointments?doctor_id=9999

// Fecha con formato inválido → 400 ❌

GET /api/appointments?start_date=fecha-invalida

// start_date mayor que end_date → 400 ❌

GET /api/appointments?start_date=2027-12-31&end_date=2027-01-01

// Sin resultados con los filtros dados → 404 ❌

GET /api/appointments?start_date=2000-01-01&end_date=2000-01-02


Reglas de negocio
Cada cita tiene una duración fija de 30 minutos
Un doctor no puede tener dos citas que se traslapen en el tiempo
Un paciente no puede tener dos citas al mismo tiempo
Solo se pueden agendar citas en fechas y horarios futuros
No se puede cancelar una cita que ya está en proceso o que ya finalizó
Las citas canceladas no bloquean la disponibilidad del doctor ni del paciente
El horario de la aplicación está basado en America/Mexico_City

