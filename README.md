# DoDash

<<<<<<< HEAD
A minimalistic, dark-themed to-do list app – built for Docker and Unraid, but works everywhere.

---

## ✨ Features

- Dark mode design
- Multiple to-do lists
- Theme color picker
- Responsive UI (desktop & mobile)
- Completed tasks section
- Easy deployment via Docker

---

## 🚀 Quick Start

### Using Docker

```
docker run -d -p 3000:3000 deinusername/dodash:latest
```

App will be available at [http://localhost:3000](http://localhost:3000)  
Replace `localhost` with your server IP if deploying remotely.

### Using Docker Compose

```
docker-compose up --build
```

### Local Development

```
npm install
npm start
```

App will be available at [http://localhost:3000](http://localhost:3000)

---

## 🛠️ For Unraid Users

- Ready for integration via Community Applications as a custom template.
- See `/Dockerfile` and `/docker-compose.yml` for details.
- (Template XML example coming soon!)

---

## 📁 Folder Structure

- `src/` – Source code
- `public/` – Static files
- `Dockerfile` – For containerization
- `docker-compose.yml` – For multi-service Docker setups
- `package.json` / `package-lock.json` – Node dependencies
- `tsconfig.json` – TypeScript config (if used)

---

## 📦 License

MIT

---

> **DoDash** is open source! Contributions and forks are welcome.
=======
A minimalistic, dark-themed task management application with multiple lists and color customization.

## Features

- Dark mode design
- Multiple todo lists
- Color picker for theme customization
- Responsive design (works on desktop and mobile)
- Separate completed tasks section
- Docker support

## Running the Application

### Using Docker

1. Make sure you have Docker and Docker Compose installed
2. Clone this repository
3. Run the following commands:

```bash
# Build and start the container
docker-compose up --build

# The app will be available at http://localhost:3000
```

### Without Docker

1. Make sure you have Node.js installed
2. Clone this repository
3. Run the following commands:

```bash
# Install dependencies
npm install

# Start the development server
npm start

# The app will be available at http://localhost:3000
```
>>>>>>> 44f9ac27 (Initial project upload with Dockerfile)
