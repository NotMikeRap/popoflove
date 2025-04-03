const profiles = [
    { name: "Ana", img: "https://randomuser.me/api/portraits/women/45.jpg" },
    { name: "Carlos", img: "https://randomuser.me/api/portraits/men/34.jpg" },
    { name: "Lucía", img: "https://randomuser.me/api/portraits/women/25.jpg" },
    { name: "Pedro", img: "https://randomuser.me/api/portraits/men/46.jpg" }
];

let likedProfiles = [];
let currentIndex = 0;
let registeredUsers = JSON.parse(localStorage.getItem('users')) || [];

function showRegister() {
    document.getElementById('welcomeSection').classList.add('hidden');
    document.getElementById('registerSection').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('welcomeSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const user = {
        firstName: document.getElementById('firstName').value,
        lastName1: document.getElementById('lastName1').value,
        lastName2: document.getElementById('lastName2').value,
        birthdate: document.getElementById('birthdate').value,
        location: document.getElementById('location').value,
        email: document.getElementById('email').value
    };

    registeredUsers.push(user);
    localStorage.setItem('users', JSON.stringify(registeredUsers));

    currentUser = user;

    showTinder();
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const user = registeredUsers.find(u => u.email === email);

    if (user) {
        currentUser = user;
        showTinder();
    } else {
        alert('Usuario no registrado. Por favor, regístrate primero.');
        showRegister();
    }
});

function showTinder() {
    document.getElementById('registerSection').classList.add('hidden');
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('tinderSection').classList.remove('hidden');
    renderCard();
}

function renderCard() {
    const container = document.getElementById('card-container');
    container.innerHTML = '';

    if (currentIndex >= profiles.length) {
        container.innerHTML = '<p>No hay más perfiles disponibles.</p>';
        return;
    }

    const profile = profiles[currentIndex];
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.backgroundImage = `url(${profile.img})`;
    card.innerText = profile.name;

    container.appendChild(card);
}

document.getElementById('likeBtn').addEventListener('click', () => {
    likedProfiles.push(profiles[currentIndex]);
    nextProfile();
});

document.getElementById('dislikeBtn').addEventListener('click', () => {
    nextProfile();
});

function nextProfile() {
    currentIndex++;
    renderCard();
}


//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM















// Datos del usuario registrado
let currentUser = null;

// Simulamos el registro para capturar datos
document.getElementById('registerForm').onsubmit = function(e) {
    e.preventDefault();
    currentUser = {
        firstName: document.getElementById('firstName').value,
        lastName1: document.getElementById('lastName1').value,
        lastName2: document.getElementById('lastName2').value,
        birthdate: document.getElementById('birthdate').value,
        location: document.getElementById('location').value,
        email: document.getElementById('email').value
    };
    showTinder();
    loadProfile();
};

// Función para calcular edad
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

// Cargar datos al perfil
function loadProfile() {
    if (!currentUser) return;

    document.getElementById('profileName').textContent = `${currentUser.firstName} ${currentUser.lastName1} ${currentUser.lastName2}`;
    document.getElementById('profileAge').textContent = calcularEdad(currentUser.birthdate);
    document.getElementById('profileLocation').textContent = currentUser.location;

    // Puedes guardar foto de perfil en localStorage si más adelante quieres agregar subida de fotos
}

// Navegación entre secciones
function showTinder() {
    hideAll();
    document.getElementById('tinderSection').classList.remove('hidden');
}

function showProfile() {
    loadProfile();
    hideAll();
    document.getElementById('profileSection').classList.remove('hidden');
}

function hideAll() {
    document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
}
