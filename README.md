## 📦 Projekto technologijos

- **Frontend**: React + Bootstrap
- **Backend**: Node.js (Express)
- **Duomenų bazė**: MongoDB (per Docker `mongodb` konteinerį)
- **Autentifikacija**: JWT (su email login)
- **Docker & Docker Compose**: visa infrastruktūra paleidžiama konteineriuose

---

## 🚀 Paleidimas

### 1. Reikalavimai

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### 2. Paleidimas

1. Atidarykite terminalą projekto šakninėje direktorijoje.
2. Paleiskite:

```bash
docker-compose up --build
```

3. Frontend aplikacija bus pasiekiama [http://localhost:3000](http://localhost:3000)  
   Backend API – per [http://localhost:3001](http://localhost:3001)

---

## 🔑 Funkcionalumas

- Naudotojo registracija / prisijungimas
- JWT token pagrindu veikianti autentifikacija
- Prekių sąrašas (visos, tik mano)
- Pridėti / redaguoti / trinti prekes
- Modal langas prekių įkėlimui
- Bootstrap UI + mobilus draugiškas dizainas
- Navigacija su paieškos lauku (UI)
