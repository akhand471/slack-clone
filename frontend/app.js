document.addEventListener('DOMContentLoaded', () => {
    if (document.body.contains(document.getElementById('login-form'))) {
        handleAuthPage(); // Renamed for clarity
    } else if (document.body.contains(document.getElementById('message-list'))) {
        const token = localStorage.getItem('token');
        if (token) {
            initializeChat(token);
        } else {
            window.location.href = 'login.html';
        }
    }
});

/**
 * Handles all logic for the authentication page (Login & Register).
 */
function handleAuthPage() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.querySelector('.tab-button[data-form="login"]');
    const registerTab = document.querySelector('.tab-button[data-form="register"]');

    // --- Tab Switching Logic ---
    registerTab.addEventListener('click', () => {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    loginTab.addEventListener('click', () => {
        registerTab.classList.remove('active');
        loginTab.classList.add('active');
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // --- Login Form Submission ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorMessage = document.getElementById('login-error-message');

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } else {
                errorMessage.textContent = data.msg || 'Login failed.';
            }
        } catch (error) {
            errorMessage.textContent = 'Server connection error.';
        }
    });

    // --- Register Form Submission ---
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const errorMessage = document.getElementById('register-error-message');

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = 'login.html';
            } else {
                errorMessage.textContent = data.msg || 'Registration failed.';
            }
        } catch (error) {
            errorMessage.textContent = 'Server connection error.';
        }
    });
}

/**
 * Initializes the chat functionality.
 */
function initializeChat(token) {
    const socket = io('http://localhost:3000');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messageList = document.getElementById('message-list');
    let currentChannel = 'general';

    socket.on('connect', () => {
        socket.emit('joinChannel', currentChannel);
    });

    const sendMessage = () => {
        const content = messageInput.value;
        if (content.trim()) {
            const message = { content, channel: currentChannel, token };
            socket.emit('sendMessage', message);
            messageInput.value = '';
        }
    };

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    socket.on('receiveMessage', (message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
            <span class="sender">${message.sender?.username || 'User'}</span>
            <span class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</span>
            <p>${message.content}</p>
        `;
        messageList.appendChild(messageElement);
        messageList.scrollTop = messageList.scrollHeight;
    });
}