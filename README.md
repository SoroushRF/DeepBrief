# 🧠 DeepBrief

[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Go](https://img.shields.io/badge/Go-1.21-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://golang.org/)
[![Gemini 2.5](https://img.shields.io/badge/Gemini_2.5-FLASH_LITE-8E75B2?style=for-the-badge&logo=google-bard&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Google Cloud Run](https://img.shields.io/badge/Cloud_Run-Deployed-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/run)
[![Manifest V3](https://img.shields.io/badge/Chrome-Manifest_V3-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)

> **"Like a university professor in your pocket."**

**DeepBrief** is a premium Chrome extension that transforms complex technical jargon into clear, multi-tiered explanations instantly. Powered by Google's state-of-the-art **Gemini 2.5 Flash Lite**, it delivers context-aware insights directly on any webpage.

---

## ✨ Luxury Features

| Feature | Description |
| :--- | :--- |
| **⚡ Instant Explanations** | Right-click any text to get an immediate AI breakdown. |
| **🧠 3-Mode Intelligence** | Switch between **Concise** (Dictionary), **Simple** (ELI5), and **Deep Dive** (Context). |
| **🎨 Glassmorphism UI** | A stunning, frosted-glass interface that feels native to modern OS aesthetics. |
| **📋 Smart Actions** | One-click copy, smooth transitions, and keyboard-accessible navigation. |
| **🔒 Enterprise Security** | API keys are proxy-shielded in a Go backend; no data is ever stored. |

---

## 🏗️ Architecture

A secure, decoupled architecture ensures speed, privacy, and scalability.

```mermaid
graph LR
    A[Chrome Extension] -- HTTPS --> B[Go Backend Cloud Run]
    B -- API Key --> C[Gemini 2.5 AI Model]
    C -- JSON --> B
    B -- JSON --> A
```

**Why this design?**
- **Security:** Client never sees the API key.
- **Speed:** Go backend on Cloud Run responds in milliseconds.
- **Privacy:** State-less request handling.

---

## 🛠️ Tech Stack

### 🖥️ Frontend (Extension)
- **Core:** ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
- **Styling:** ![CSS3](https://img.shields.io/badge/CSS3-Modern-1572B6?style=flat-square&logo=css3&logoColor=white)
- **Isolation:** ![Shadow DOM](https://img.shields.io/badge/Web_Components-Shadow_DOM-E34F26?style=flat-square&logo=html5&logoColor=white)
- **Framework:** ![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-4285F4?style=flat-square&logo=google-chrome&logoColor=white)

### ☁️ Backend (API)
- **Language:** ![Go](https://img.shields.io/badge/Go-1.21-00ADD8?style=flat-square&logo=go&logoColor=white)
- **AI Model:** ![Gemini](https://img.shields.io/badge/Google_AI-Gemini_2.5-8E75B2?style=flat-square&logo=google-bard&logoColor=white)
- **Infrastructure:** ![Google Cloud Run](https://img.shields.io/badge/Google_Cloud-Run-4285F4?style=flat-square&logo=google-cloud&logoColor=white)
- **Container:** ![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=flat-square&logo=docker&logoColor=white)

---

## 🚀 Status & Roadmap

The project is currently **Completed** and ready for production use.

- [x] **Phase 1:** Backend API Development
- [x] **Phase 2:** Cloud Deployment (Google Cloud Run)
- [x] **Phase 3:** Extension Core (Manifest V3)
- [x] **Phase 4:** Luxury UI Implementation (Tabs, Glassmorphism)
- [x] **Phase 5:** Final Polish & Documentation

---

## 📦 Installation (Local)

1.  **Clone the Repo:**
    ```bash
    git clone https://github.com/SoroushRF/DeepBrief.git
    cd DeepBrief
    ```

2.  **Run Backend:**
    ```bash
    cd backend
    cp .env.example .env # Add your GEMINI_API_KEY
    go run main.go
    ```

3.  **Load Extension:**
    - Go to `chrome://extensions/`
    - Enable **Developer Mode**
    - Click **Load Unpacked**
    - Select the `extension` folder

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👤 Author

**Soroush Raouf**
- GitHub: [@SoroushRF](https://github.com/SoroushRF)

---

<center>
  <i>Built with ❤️ using Go, Gemini AI, and pure Web Technologies</i>
</center>
