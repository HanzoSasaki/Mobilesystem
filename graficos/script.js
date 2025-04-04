function openModal(button) {
  const iframe = button.closest('.chart-section').querySelector('iframe');
  const modal = document.getElementById('chartModal');
  document.getElementById('modalIframe').src = iframe.src;
  modal.style.display = 'block';
}

function closeModal() {
  document.getElementById('chartModal').style.display = 'none';
  document.getElementById('modalIframe').src = '';
}

// Fechar modal ao clicar fora
window.onclick = function (event) {
  const modal = document.getElementById('chartModal');
  if (event.target === modal) {
    closeModal();
  }
}

// Smooth scroll para navegação
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});