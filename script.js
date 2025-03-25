// Função para adicionar efeitos de luz ao passar o mouse (opcional, caso precise de um efeito mais dinâmico)
const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.6)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    });
});

document.getElementById("previsao-link").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("popup-overlay").style.display = "block";
});

document.getElementById("close-popup").addEventListener("click", function() {
    document.getElementById("popup-overlay").style.display = "none";
});
