// Variables globales
let musicPlaying = false;
let audioEnabled = false;

// Elementos del DOM
const musicControl = document.getElementById('musicControl');
const birthdayMusic = document.getElementById('birthdayMusic');
const acceptSound = document.getElementById('acceptSound');
const audioWarning = document.getElementById('audioWarning');
const acceptBtn = document.getElementById('acceptBtn');

// Crear burbujas flotantes
function createBubbles() {
    const bubblesContainer = document.getElementById('bubbles');
    const bubbleCount = 30;
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 45 + 15;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${Math.random() * 7 + 8}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        bubble.style.opacity = Math.random() * 0.5 + 0.3;
        
        bubblesContainer.appendChild(bubble);
    }
}

// Configurar audio
function setupAudio() {
    // Ajustar volúmenes
    birthdayMusic.volume = 0.3;
    acceptSound.volume = 0.7;
    
    // Control de música
    musicControl.addEventListener('click', function() {
        if (!audioEnabled) {
            enableAudio();
            return;
        }
        
        if (musicPlaying) {
            birthdayMusic.pause();
            musicControl.innerHTML = '<div class="music-icon">🎵</div>';
            musicPlaying = false;
        } else {
            birthdayMusic.play()
                .then(() => {
                    musicPlaying = true;
                    musicControl.innerHTML = '<div class="music-icon">🔊</div>';
                })
                .catch(error => {
                    console.error("Error al reproducir música:", error);
                    showAudioWarning();
                });
        }
    });
    
    // Verificar si el audio está bloqueado
    document.addEventListener('click', function() {
        if (!audioEnabled) {
            enableAudio();
        }
    }, { once: true });
    
    // Mostrar advertencia si el audio está bloqueado
    setTimeout(() => {
        if (!audioEnabled) {
            showAudioWarning();
        }
    }, 2000);
}

// Habilitar audio
function enableAudio() {
    // Intentar reproducir y pausar inmediatamente para desbloquear
    birthdayMusic.play()
        .then(() => {
            birthdayMusic.pause();
            audioEnabled = true;
            audioWarning.style.display = 'none';
            
            // También habilitar el sonido de aceptación
            acceptSound.play().then(() => {
                acceptSound.pause();
            }).catch(e => console.error("Error al habilitar sonido:", e));
        })
        .catch(error => {
            console.error("Error al habilitar audio:", error);
            showAudioWarning();
        });
}

// Mostrar advertencia de audio
function showAudioWarning() {
    audioWarning.style.display = 'block';
    audioWarning.addEventListener('click', function() {
        enableAudio();
        this.style.display = 'none';
    });
}

// Efecto de confeti con sonido especial
acceptBtn.addEventListener('click', function() {
    // Primero habilitar audio si no está habilitado
    if (!audioEnabled) {
        enableAudio();
    }
    
    // Reproducir sonido especial de aceptación
    if (audioEnabled) {
        acceptSound.currentTime = 0;
        acceptSound.play().catch(e => console.error("Error al reproducir sonido:", e));
    }
    
    // Efecto visual de confeti
    confetti({
        particleCount: 300,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#cd9c8e', '#f7f2ea', '#ffffff', '#ffd700', '#ff9e7d'],
        shapes: ['circle', 'square'],
        scalar: 1.2
    });
    
    // Mostrar el modal de agradecimiento
    document.getElementById('thanksModal').style.display = 'flex';
    
    // Reproducir música si no está sonando
    if (!musicPlaying && audioEnabled) {
        birthdayMusic.play()
            .then(() => {
                musicPlaying = true;
                musicControl.innerHTML = '<div class="music-icon">🔊</div>';
            })
            .catch(error => console.error("Error al reproducir música:", error));
    }
});

// Cerrar modal
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('thanksModal').style.display = 'none';
});

// Inicializar
window.addEventListener('DOMContentLoaded', function() {
    createBubbles();
    setupAudio();
    
    // Configuración especial para móviles
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        musicControl.innerHTML = '<div class="music-icon">Toca para música</div>';
    }
});