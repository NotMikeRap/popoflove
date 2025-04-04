// Profile data
const profiles = [
    { name: "Ana", age: 28, bio: "Me encanta viajar y la fotografía", img: "https://randomuser.me/api/portraits/women/45.jpg" },
    { name: "Carlos", age: 32, bio: "Fan del deporte y la música electrónica", img: "https://randomuser.me/api/portraits/men/34.jpg" },
    { name: "Lucía", age: 26, bio: "Amante de los libros y el café", img: "https://randomuser.me/api/portraits/women/25.jpg" },
    { name: "Pedro", age: 31, bio: "Apasionado por la cocina y el senderismo", img: "https://randomuser.me/api/portraits/men/46.jpg" },
    { name: "Elena", age: 29, bio: "Guitarrista y viajera", img: "https://randomuser.me/api/portraits/women/32.jpg" },
    { name: "Miguel", age: 33, bio: "Diseñador gráfico y amante del cine", img: "https://randomuser.me/api/portraits/men/22.jpg" }
];

// App state
let likedProfiles = [];
let currentIndex = 0;
let registeredUsers = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    if (currentUser) {
        showTinder();
        loadProfile();
    }
    
    // Set up navigation event listeners
    setupNavigationListeners();
});

// Welcome screen functions
function showRegister() {
    document.getElementById('welcomeSection').classList.add('hidden');
    document.getElementById('registerSection').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('welcomeSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}

// Registration form handler
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const birthdate = document.getElementById('birthdate').value;
    
    // Validar edad mínima de 18 años
    const userAge = calcularEdad(birthdate);
    if (userAge < 18) {
        showAlert('Debes ser mayor de 18 años para registrarte.');
        return;
    }
    
    // Check if email is already registered
    if (registeredUsers.some(user => user.email === email)) {
        showAlert('Este correo ya está registrado. Por favor inicia sesión.');
        showLogin();
        return;
    }

    const user = {
        firstName: document.getElementById('firstName').value,
        lastName1: document.getElementById('lastName1').value,
        lastName2: document.getElementById('lastName2').value,
        birthdate: birthdate,
        location: document.getElementById('location').value,
        email: email,
        hobbies: "Cine, Viajar, Música", // Default hobbies
        matches: [],
        profileImg: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 70)}.jpg`
    };

    registeredUsers.push(user);
    localStorage.setItem('users', JSON.stringify(registeredUsers));
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;

    showAlert('¡Registro exitoso!');
    showTinder();
    loadProfile();
});

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const user = registeredUsers.find(u => u.email === email);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showTinder();
        loadProfile();
    } else {
        showAlert('Usuario no registrado. Por favor, regístrate primero.');
        showRegister();
    }
});

// Function to show alert messages
function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert';
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    
    setTimeout(() => {
        alertBox.classList.add('fade-out');
        setTimeout(() => {
            alertBox.remove();
        }, 500);
    }, 2000);
}

// Tinder card functions
function showTinder() {
    hideAll();
    document.getElementById('tinderSection').classList.remove('hidden');
    renderCard();
    updateActiveNav('house');
}

function renderCard() {
    const container = document.getElementById('card-container');
    container.innerHTML = '';

    if (currentIndex >= profiles.length) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="ph ph-smiley-sad" style="font-size: 48px; color: #ccc;"></i>
                <p>No hay más perfiles disponibles.</p>
                <button onclick="resetProfiles()" class="action-btn">Ver de nuevo</button>
            </div>
        `;
        return;
    }

    const profile = profiles[currentIndex];
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.backgroundImage = `url(${profile.img})`;
    
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');
    cardInfo.innerHTML = `
        <h3>${profile.name}, ${profile.age}</h3>
        <p>${profile.bio}</p>
    `;
    
    card.appendChild(cardInfo);
    container.appendChild(card);
    
    // Add drag functionality
    enableDragFunctionality(card);
}

function enableDragFunctionality(card) {
    let startX;
    let isDragging = false;
    
    card.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        card.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.05}deg)`;
        
        if (deltaX > 0) {
            card.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
        } else if (deltaX < 0) {
            card.style.boxShadow = '0 0 10px rgba(255, 90, 95, 0.5)';
        }
    });
    
    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaX = e.clientX - startX;
        
        if (deltaX > 100) {
            likeCurrentProfile();
        } else if (deltaX < -100) {
            dislikeCurrentProfile();
        } else {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    });
}

function resetProfiles() {
    currentIndex = 0;
    renderCard();
}

function likeCurrentProfile() {
    const current = profiles[currentIndex];
    likedProfiles.push(current);
    
    // Show match animation with 30% probability
    if (Math.random() < 0.3) {
        showMatch(current);
        // Add to matches
        if (currentUser) {
            currentUser.matches = currentUser.matches || [];
            currentUser.matches.push(current);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update users array
            const userIndex = registeredUsers.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                registeredUsers[userIndex] = currentUser;
                localStorage.setItem('users', JSON.stringify(registeredUsers));
            }
        }
    }
    
    nextProfile();
}

function dislikeCurrentProfile() {
    nextProfile();
}

function nextProfile() {
    currentIndex++;
    renderCard();
}

function showMatch(profile) {
    const matchOverlay = document.createElement('div');
    matchOverlay.className = 'match-overlay';
    
    matchOverlay.innerHTML = `
        <div class="match-content">
            <h2>¡Es un Match!</h2>
            <div class="match-images">
                <img src="${currentUser.profileImg}" alt="Tu foto">
                <img src="${profile.img}" alt="${profile.name}">
            </div>
            <p>Tú y ${profile.name} se han gustado mutuamente</p>
            <button class="action-btn">Enviar mensaje</button>
            <button class="action-btn secondary" onclick="closeMatch()">Seguir buscando</button>
        </div>
    `;
    
    document.body.appendChild(matchOverlay);
    setTimeout(() => {
        matchOverlay.classList.add('visible');
    }, 100);
}

function closeMatch() {
    const matchOverlay = document.querySelector('.match-overlay');
    if (matchOverlay) {
        matchOverlay.classList.remove('visible');
        setTimeout(() => {
            matchOverlay.remove();
        }, 300);
    }
}

// Profile functions
function showProfile() {
    loadProfile();
    hideAll();
    document.getElementById('profileSection').classList.remove('hidden');
    updateActiveNav('user');
}

function loadProfile() {
    if (!currentUser) return;

    document.getElementById('profileImage').src = currentUser.profileImg || 'https://via.placeholder.com/100';
    document.getElementById('profileName').textContent = `${currentUser.firstName} ${currentUser.lastName1} ${currentUser.lastName2}`;
    document.getElementById('profileAge').textContent = calcularEdad(currentUser.birthdate);
    document.getElementById('profileGenero').textContent = currentUser.genero;
    document.getElementById('profileOrientacion').textContent = currentUser.orientacion;
    document.getElementById('profileLocation').textContent = currentUser.location;
    document.getElementById('profileHobbies').textContent = currentUser.hobbies || 'Cine, Viajar, Música';

const genero = document.getElementById('profileGenero').value;
    const orientacion = document.getElementById('profileOrientacion').value
    
    // Display matches if any
    const matchesContainer = document.getElementById('profileMatches');
    if (matchesContainer) {
        matchesContainer.innerHTML = '';
        
        if (currentUser.matches && currentUser.matches.length > 0) {
            document.getElementById('noMatchesMessage').classList.add('hidden');
            matchesContainer.classList.remove('hidden');
            
            currentUser.matches.forEach(match => {
                const matchEl = document.createElement('div');
                matchEl.className = 'match-item';
                matchEl.innerHTML = `
                    <img src="${match.img}" alt="${match.name}">
                    <p>${match.name}, ${match.age}</p>
                `;
                matchesContainer.appendChild(matchEl);
            });
        } else {
            document.getElementById('noMatchesMessage').classList.remove('hidden');
            matchesContainer.classList.add('hidden');
        }
    }
}

// Show chat section
function showChat() {
    hideAll();
    document.getElementById('chatSection').classList.remove('hidden');
    renderChats();
    updateActiveNav('chat-circle');
}

function renderChats() {
    const chatList = document.getElementById('chatList');
    if (!chatList) return;
    
    chatList.innerHTML = '';
    
    if (!currentUser || !currentUser.matches || currentUser.matches.length === 0) {
        chatList.innerHTML = '<p class="empty-message">Todavía no tienes matches para chatear</p>';
        return;
    }
    
    currentUser.matches.forEach(match => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.innerHTML = `
            <img src="${match.img}" alt="${match.name}">
            <div class="chat-info">
                <h4>${match.name}</h4>
                <p>Toca para empezar a chatear</p>
            </div>
        `;
        chatList.appendChild(chatItem);
    });
}

// Show camera section
function showCamera() {
    hideAll();
    document.getElementById('cameraSection').classList.remove('hidden');
    updateActiveNav('camera');
}

// Show settings section
function showSettings() {
    hideAll();
    document.getElementById('settingsSection').classList.remove('hidden');
    updateActiveNav('gear');
}

// Function to update active navigation item
function updateActiveNav(icon) {
    document.querySelectorAll('.bottom-nav i').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll(`.bottom-nav .ph-${icon}`).forEach(item => {
        item.classList.add('active');
    });
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    likedProfiles = [];
    currentIndex = 0;
    
    hideAll();
    document.getElementById('welcomeSection').classList.remove('hidden');
}

// Set up navigation event listeners
function setupNavigationListeners() {
    // Remove any existing event listeners first
    document.querySelectorAll('.bottom-nav i').forEach(icon => {
        // Clone the element to remove all event listeners
        const parent = icon.parentNode;
        const newIcon = icon.cloneNode(true);
        parent.replaceChild(newIcon, icon);
    });
    
    // Add new event listeners
    document.querySelectorAll('.bottom-nav .ph-house').forEach(icon => {
        icon.addEventListener('click', showTinder);
    });
    
    document.querySelectorAll('.bottom-nav .ph-user').forEach(icon => {
        icon.addEventListener('click', showProfile);
    });
    
    document.querySelectorAll('.bottom-nav .ph-chat-circle').forEach(icon => {
        icon.addEventListener('click', showChat);
    });
    
    document.querySelectorAll('.bottom-nav .ph-camera').forEach(icon => {
        icon.addEventListener('click', showCamera);
    });
    
    document.querySelectorAll('.bottom-nav .ph-gear').forEach(icon => {
        icon.addEventListener('click', showSettings);
    });
}

// Utilities
function hideAll() {
    document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

// Set up event listeners for like/dislike buttons
document.getElementById('likeBtn').addEventListener('click', likeCurrentProfile);
document.getElementById('dislikeBtn').addEventListener('click', dislikeCurrentProfile);

// Agregar esta función al final de app.js

// Almacenamiento para mensajes de chat
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || {};

// Función para abrir el chat con un match específico
function openChat(match) {
    document.getElementById('chatSection').classList.add('hidden');
    document.getElementById('chatDetailSection').classList.remove('hidden');
    
    // Configurar la información del match en el chat
    document.getElementById('chatProfileName').textContent = match.name;
    document.getElementById('chatProfileImg').src = match.img;
    
    // Obtener el ID único para la conversación
    const chatId = `chat_${currentUser.email}_${match.name}`;
    
    // Cargar mensajes anteriores
    renderMessages(chatId);
    
    // Configurar el formulario de envío para este chat
    const messageForm = document.getElementById('messageForm');
    messageForm.onsubmit = function(e) {
        e.preventDefault();
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (message) {
            // Añadir mensaje al historial
            if (!chatMessages[chatId]) {
                chatMessages[chatId] = [];
            }
            
            chatMessages[chatId].push({
                sender: 'user',
                text: message,
                timestamp: new Date().toISOString()
            });
            
            // Guardar en localStorage
            localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
            
            // Mostrar mensaje
            renderMessages(chatId);
            
            // Limpiar input
            messageInput.value = '';
            
            // Simular respuesta después de 1-3 segundos
            setTimeout(() => {
                const responses = [
                    "¡Me encantaría conocerte mejor!",
                    "¿Qué te gusta hacer en tu tiempo libre?",
                    "¿Te gustaría quedar para tomar algo?",
                    "Eso suena genial, cuéntame más...",
                    "¡Qué interesante! 😊",
                    "Jaja, eres muy divertido/a",
                    "Me gusta tu forma de ver las cosas"
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                chatMessages[chatId].push({
                    sender: 'match',
                    text: randomResponse,
                    timestamp: new Date().toISOString()
                });
                
                localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
                renderMessages(chatId);
            }, Math.random() * 2000 + 1000);
        }
    };
    
    // Configurar botón para ver perfil
    document.getElementById('viewProfileBtn').onclick = function() {
        viewMatchProfile(match);
    };
    
    // Configurar botón para volver a la lista de chats
    document.getElementById('backToChatsBtn').onclick = function() {
        document.getElementById('chatDetailSection').classList.add('hidden');
        document.getElementById('chatSection').classList.remove('hidden');
    };
}

// Renderizar mensajes en la interfaz
function renderMessages(chatId) {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';
    
    if (!chatMessages[chatId] || chatMessages[chatId].length === 0) {
        messagesContainer.innerHTML = '<div class="no-messages">No hay mensajes. ¡Di hola!</div>';
        return;
    }
    
    chatMessages[chatId].forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sender === 'user' ? 'sent' : 'received'}`;
        
        // Formatear la hora del mensaje
        const timestamp = new Date(msg.timestamp);
        const timeString = timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${msg.text}
                <span class="message-time">${timeString}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
    });
    
    // Scroll al último mensaje
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Ver perfil de un match
function viewMatchProfile(match) {
    document.getElementById('chatDetailSection').classList.add('hidden');
    document.getElementById('matchProfileSection').classList.remove('hidden');
    
    // Configurar la información del perfil
    document.getElementById('matchProfileImg').src = match.img;
    document.getElementById('matchProfileName').textContent = match.name;
    document.getElementById('matchProfileAge').textContent = match.age;
    document.getElementById('matchProfileBio').textContent = match.bio;
    
    // Mostrar imágenes aleatorias como galería
    renderMatchGallery(match);
    
    // Configurar botón para volver al chat
    document.getElementById('backToChatBtn').onclick = function() {
        document.getElementById('matchProfileSection').classList.add('hidden');
        document.getElementById('chatDetailSection').classList.remove('hidden');
    };
}

// Renderizar galería de fotos del match
function renderMatchGallery(match) {
    const galleryContainer = document.getElementById('matchGallery');
    galleryContainer.innerHTML = '';
    
    // Generar algunas imágenes aleatorias para la galería
    const gender = match.img.includes('women') ? 'women' : 'men';
    const baseId = parseInt(match.img.split('/').pop());
    
    // Añadir 4 fotos a la galería (la principal y 3 aleatorias)
    galleryContainer.innerHTML += `<img src="${match.img}" alt="${match.name}" class="active">`;
    
    for (let i = 1; i <= 3; i++) {
        const imgId = (baseId + i * 10) % 99;
        galleryContainer.innerHTML += `
            <img src="https://randomuser.me/api/portraits/${gender}/${imgId}.jpg" alt="${match.name}">
        `;
    }
    
    // Hacer que las imágenes sean seleccionables
    const images = galleryContainer.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('click', function() {
            images.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('matchProfileImg').src = this.src;
        });
    });
}

// Enviar foto desde la cámara
function setupCameraFunctionality() {
    // Configurar el botón de acceso a la cámara
    document.querySelector('.camera-placeholder button').addEventListener('click', function() {
        // Simular selección de archivo
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.capture = 'camera';
        
        fileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    // Mostrar vista previa
                    document.querySelector('.camera-placeholder').innerHTML = `
                        <div class="captured-image">
                            <img src="${event.target.result}" alt="Foto capturada">
                            <div class="camera-actions">
                                <button class="action-btn" onclick="sharePhoto('${event.target.result}')">Compartir</button>
                                <button class="action-btn secondary" onclick="setupCameraFunctionality()">Descartar</button>
                            </div>
                        </div>
                    `;
                };
                
                reader.readAsDataURL(e.target.files[0]);
            }
        });
        
        fileInput.click();
    });
}

// Compartir foto
function sharePhoto(photoSrc) {
    // Mostrar selector de contactos
    document.getElementById('cameraSection').classList.add('hidden');
    document.getElementById('sharePhotoSection').classList.remove('hidden');
    
    // Mostrar vista previa de la foto
    document.getElementById('photoPreview').src = photoSrc;
    
    // Rellenar lista de matches para compartir
    const shareList = document.getElementById('shareContactList');
    shareList.innerHTML = '';
    
    if (currentUser && currentUser.matches && currentUser.matches.length > 0) {
        currentUser.matches.forEach(match => {
            const contact = document.createElement('div');
            contact.className = 'share-contact-item';
            contact.innerHTML = `
                <img src="${match.img}" alt="${match.name}">
                <span>${match.name}</span>
                <button class="share-btn" data-name="${match.name}">Enviar</button>
            `;
            shareList.appendChild(contact);
        });
        
        // Configurar botones de envío
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const matchName = this.getAttribute('data-name');
                const match = currentUser.matches.find(m => m.name === matchName);
                
                // Enviar foto al chat
                const chatId = `chat_${currentUser.email}_${matchName}`;
                
                if (!chatMessages[chatId]) {
                    chatMessages[chatId] = [];
                }
                
                chatMessages[chatId].push({
                    sender: 'user',
                    text: `<img src="${photoSrc}" class="chat-photo" alt="Foto compartida">`,
                    timestamp: new Date().toISOString(),
                    isImage: true
                });
                
                localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
                
                showAlert('Foto enviada a ' + matchName);
                
                // Volver a la cámara
                document.getElementById('sharePhotoSection').classList.add('hidden');
                document.getElementById('cameraSection').classList.remove('hidden');
                setupCameraFunctionality();
                
                // Simular respuesta después de 2 segundos
                setTimeout(() => {
                    const responses = [
                        "¡Qué buena foto! 😍",
                        "¡Me encanta! ¿Dónde fue tomada?",
                        "Te ves genial en esta foto",
                        "¡Wow! Gracias por compartir"
                    ];
                    
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    
                    chatMessages[chatId].push({
                        sender: 'match',
                        text: randomResponse,
                        timestamp: new Date().toISOString()
                    });
                    
                    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
                }, 2000);
            });
        });
    } else {
        shareList.innerHTML = '<p class="empty-message">No tienes matches para compartir fotos</p>';
    }
    
    // Configurar botón para cancelar
    document.getElementById('cancelShareBtn').addEventListener('click', function() {
        document.getElementById('sharePhotoSection').classList.add('hidden');
        document.getElementById('cameraSection').classList.remove('hidden');
        setupCameraFunctionality();
    });
}

// Actualizar la función renderChats para hacer los elementos clicables
function renderChats() {
    const chatList = document.getElementById('chatList');
    if (!chatList) return;
    
    chatList.innerHTML = '';
    
    if (!currentUser || !currentUser.matches || currentUser.matches.length === 0) {
        chatList.innerHTML = '<p class="empty-message">Todavía no tienes matches para chatear</p>';
        return;
    }
    
    currentUser.matches.forEach(match => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        
        // Obtener el último mensaje si existe
        const chatId = `chat_${currentUser.email}_${match.name}`;
        let lastMessage = "Toca para empezar a chatear";
        
        if (chatMessages[chatId] && chatMessages[chatId].length > 0) {
            const last = chatMessages[chatId][chatMessages[chatId].length - 1];
            if (last.isImage) {
                lastMessage = "📸 Foto";
            } else {
                lastMessage = last.text.length > 25 ? last.text.substring(0, 25) + "..." : last.text;
            }
        }
        
        chatItem.innerHTML = `
            <img src="${match.img}" alt="${match.name}">
            <div class="chat-info">
                <h4>${match.name}</h4>
                <p>${lastMessage}</p>
            </div>
        `;
        
        chatItem.addEventListener('click', () => openChat(match));
        chatList.appendChild(chatItem);
    });
}

// Iniciar la funcionalidad de la cámara cuando se muestre
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cameraSection')) {
        setupCameraFunctionality();
    }
});
