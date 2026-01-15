// Funcionalidad para el formulario de newsletter
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    alert(`¡Gracias por suscribirte! Te enviaremos noticias a ${email}`);
    this.reset();
});

// Agregar efecto de scroll suave a los enlaces de navegación
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Simular reproducción de videos
document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('.video-title').textContent;
        alert(`Reproduciendo: ${title}`);
        // Aquí podrías agregar lógica para abrir un modal con video real
    });
});

// Agregar interactividad a las tarjetas de noticias
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('h3').textContent;
        console.log(`Abriendo artículo: ${title}`);
        // Aquí podrías redirigir a la página del artículo
    });
});

// Mostrar indicador de scroll en la navegación
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 5px 20px rgba(255, 215, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});