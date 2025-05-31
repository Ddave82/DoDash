# DoDash

A minimalistic, dark-themed to-do list app – built for Docker and Unraid, but works everywhere.

## ✨ Features

- Dark mode design
- Multiple to-do lists
- Theme color picker
- Responsive UI (desktop & mobile)
- Completed tasks section
- Easy deployment via Docker

## 🚀 Quick Start

### Using Docker

```bash
docker run -d -p 3000:3000 deinusername/dodash:latest
```

App will be available at [http://localhost:3000](http://localhost:3000)  
Replace `localhost` with your server IP if deploying remotely.

### Using Docker Compose

```bash
docker-compose up --build
```

### Local Development

```bash
npm install
npm start
```

App will be available at [http://localhost:3000](http://localhost:3000)

## 🛠️ For Unraid Users

- Ready for integration via Community Applications as a custom template
- See `Dockerfile` and `docker-compose.yml` for configuration details
- Template XML example coming soon!

## 📁 Project Structure

```
├── src/                    # Source code
├── public/                 # Static files
├── Dockerfile              # Container configuration
├── docker-compose.yml      # Multi-service Docker setup
├── package.json           # Node.js dependencies
├── package-lock.json      # Dependency lock file
└── tsconfig.json          # TypeScript configuration
```

## 📦 License

MIT

---

**DoDash** is open source! Contributions and forks are welcome.
