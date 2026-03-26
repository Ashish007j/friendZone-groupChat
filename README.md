# 🚀 FriendZone - Real-Time Group Chat Application

## 📌 Overview

**FriendZone** is a scalable, real-time **group chat application** built using modern full-stack technologies. It enables users to join chat rooms, communicate instantly, and experience seamless messaging with efficient backend architecture.

This project demonstrates strong expertise in **Java backend development**, **real-time communication**, and **RESTful API design**, making it highly relevant for product-based companies and modern software systems.

---

## 🛠️ Tech Stack

### 🔹 Backend

* **Java**
* **Spring Boot**
* **Spring WebSocket**
* **STOMP Protocol**
* **REST APIs**
* **Hibernate / JPA**

### 🔹 Frontend

* **React.js**
* **Tailwind CSS**
* **Axios**

### 🔹 Database

* **MongoDB**

### 🔹 Tools & Technologies

* **Git & GitHub**
* **Postman**
* **Maven**
* **WebSocket (Real-time communication)**

---

## ✨ Key Features

* 🔥 Real-time group chat using **WebSocket + STOMP**
* 👥 Create and join chat rooms instantly
* 💬 Seamless multi-user communication
* ⚡ Low-latency messaging system
* 🧠 Efficient state management in frontend
* 🔄 REST APIs for room management
* 🎯 Scalable backend architecture
* 🎨 Clean and responsive UI

---

## 🏗️ Architecture

The application follows a **client-server architecture**:

* **Frontend (React)** communicates with backend via:

  * REST APIs (room creation, joining)
  * WebSocket (real-time messaging)

* **Backend (Spring Boot)** handles:

  * WebSocket message broker
  * Room management logic
  * Message broadcasting

---

## 📂 Project Structure

```
friendZone-groupChat/
│── backend/
│   ├── controller/
│   ├── service/
│   ├── model/
│   ├── repository/
│   └── config/
│
│── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── services/
│
│── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 Clone Repository

```bash
git clone https://github.com/Ashish007j/friendZone-groupChat.git
cd friendZone-groupChat
```

---

### 🔹 Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

* Runs on: `http://localhost:8080`

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm start
```

* Runs on: `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| POST   | `/room/create` | Create a new chat room |
| POST   | `/room/join`   | Join an existing room  |

---

## 🔄 WebSocket Endpoint

```
/ws-chat
```

### Topics:

* `/topic/room/{roomId}` → Receive messages
* `/app/sendMessage` → Send messages

---

## 📸 Use Case Flow

1. User enters username & room ID
2. Creates or joins a chat room
3. Connects to WebSocket server
4. Sends/receives messages in real-time

---

## 💡 Highlights (Interview Ready)

* Implemented **real-time communication using WebSocket & STOMP**
* Designed **scalable chat room architecture**
* Built **RESTful APIs for room lifecycle management**
* Achieved **low latency messaging system**
* Clean separation of concerns using **MVC architecture**

---

## 🚀 Future Enhancements

* 🔐 User authentication (JWT / OAuth)
* 💬 One-to-one private chat
* 📁 File & image sharing
* 🔔 Notifications system
* 📱 Mobile responsiveness improvements
* 🌐 Deployment on AWS / Docker

---

## 📊 Why This Project Stands Out

* Real-world use case (chat system)
* Demonstrates **backend + frontend integration**
* Covers **WebSocket (high-demand skill)**
* Shows **system design understanding**
* Strong alignment with **product-based company requirements**

---

## 📬 Contact

**Ashish Kumar Jha**

* GitHub: https://github.com/Ashish007j
* LinkedIn: https://linkedin.com/in/Ashish007j

---

## ⭐ Support

If you like this project, please ⭐ the repository and share it!

---

> ⚡ *Built with passion to demonstrate real-time scalable systems using Java & modern web technologies.*
