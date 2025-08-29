#  Slack Clone - Full-Stack Messaging Application

A real-time messaging application inspired by Slack, built from the ground up with Node.js, Express, MongoDB, and vanilla JavaScript. This project replicates core Slack features like channels, real-time messaging, and user authentication.



---

##  Features

* **User Authentication:** Secure user registration and login system using JWT (JSON Web Tokens).
* **Real-Time Messaging:** Instant messaging within channels powered by WebSockets (Socket.IO).
* **Channel-Based Chat:** Users can join channels to communicate with other members. (Future: Create/join/leave channels).
* **Persistent Storage:** All users, messages, and channels are stored in a MongoDB database.
* **Modern UI:** A clean, responsive, and modern user interface inspired by Slack's design.

---

##  Tech Stack

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose
* **Real-Time Communication:** Socket.IO
* **Authentication:** JSON Web Tokens (JWT) & bcrypt.js

### Frontend
* **Core:** HTML5, CSS3, JavaScript (ES6+)
* **Real-Time Communication:** Socket.IO Client
* **Development:** VS Code with Live Server

---

## ~ Setup and Installation

Follow these steps to get the project running on your local machine.

### Prerequisites
* Node.js and npm installed.
* A running MongoDB instance (local or a free cloud instance from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)).
* Git installed.

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/slack-clone.git](https://github.com/your-username/slack-clone.git)
    cd slack-clone
    ```

2.  **Set up the Backend:**
    ```bash
    # Navigate to the backend folder
    cd backend

    # Install dependencies
    npm install

    # Create a .env file and add your variables
    touch .env
    ```
    Add the following content to your `backend/.env` file:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    PORT=3000
    ```

3.  **Set up the Frontend:**
    The frontend uses vanilla HTML, CSS, and JS and requires no build steps. The easiest way to run it is with the **Live Server** extension in VS Code.

4.  **Run the Application:**
    * **Start the backend server:** In the `backend` directory, run:
        ```bash
        node server.js
        ```
        The server should now be running on `http://localhost:3000`.

    * **Start the frontend:** In VS Code, right-click the `frontend/login.html` file and select "Open with Live Server". This will open the application in your browser.

---

##  License

This project is licensed under the MIT License.