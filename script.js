let carrito = [];

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  actualizarCarrito();
  mostrarCarrito();
}

function calcularTotal() {
  return carrito.reduce((total, producto) => total + producto.precio, 0);
}

function actualizarCarrito() {
  const contador = document.getElementById('contador-carrito');
  if (contador) contador.textContent = carrito.length;
}

function mostrarCarrito() {
  const modal = document.getElementById('modal-carrito');
  const lista = document.getElementById('carrito-lista');
  const total = document.getElementById('carrito-total');
  if (!lista || !total) return;

  if (carrito.length === 0) {
    lista.innerHTML = '<p>El carrito está vacío.</p>';
    total.textContent = '';
  } else {
    lista.innerHTML = carrito.map((item, i) =>
      `<div class="carrito-item">
        <span>${item.nombre}</span>
        <span>$${item.precio.toFixed(2)}</span>
        <button onclick="eliminarDelCarrito(${i})" style="background:none;border:none;color:#e65100;cursor:pointer;">✕</button>
      </div>`
    ).join('');
    total.textContent = `Total: $${calcularTotal().toFixed(2)}`;
  }
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
  mostrarCarrito();
}

document.addEventListener('DOMContentLoaded', function() {
  // Modal productos
  const modalProductos = document.getElementById('modal-productos');
  const cerrarProductos = document.getElementById('cerrar-modal');
  const productosBtn = document.querySelector('a[href="#productos"]');
  const verProductosBtn = document.querySelector('.hero .btn');
  const productosSection = document.querySelector('#productos');
  const productosModalLista = document.getElementById('productos-modal-lista');

  function abrirModalProductos(e) {
    e.preventDefault();
    productosModalLista.innerHTML = productosSection.innerHTML;
    modalProductos.style.display = 'block';
  }

  if (productosBtn) productosBtn.addEventListener('click', abrirModalProductos);
  if (verProductosBtn) verProductosBtn.addEventListener('click', abrirModalProductos);

  cerrarProductos.onclick = function() {
    modalProductos.style.display = 'none';
  };

  // Modal carrito
  const modalCarrito = document.getElementById('modal-carrito');
  const abrirCarrito = document.getElementById('abrir-carrito');
  const cerrarCarrito = document.getElementById('cerrar-carrito');
  const pagarBtn = document.getElementById('pagar-btn');

  if (abrirCarrito) {
    abrirCarrito.onclick = function() {
      mostrarCarrito();
      modalCarrito.style.display = 'block';
    };
  }
  if (cerrarCarrito) {
    cerrarCarrito.onclick = function() {
      modalCarrito.style.display = 'none';
    };
  }
  window.onclick = function(event) {
    if (event.target == modalProductos) modalProductos.style.display = 'none';
    if (event.target == modalCarrito) modalCarrito.style.display = 'none';
  };

  // Botón de pago seguro (simulado)
  if (pagarBtn) {
    pagarBtn.onclick = function() {
      if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
      }
      alert('Aquí iría la integración con el pago seguro electrónico.');
      // Aquí puedes integrar MercadoPago, PayU, Stripe, etc.
    };
  }

  // Formulario de contacto a WhatsApp
  const formContacto = document.getElementById('form-contacto');
  if (formContacto) {
    formContacto.onsubmit = function(e) {
      e.preventDefault();
      const nombre = this.querySelector('input[type="text"]').value;
      const correo = this.querySelector('input[type="email"]').value;
      const mensaje = this.querySelector('textarea').value;
      const numero = '573006308285'; // Cambia por tu número con código de país
      const texto = encodeURIComponent(`Nombre: ${nombre}\nCorreo: ${correo}\nMensaje: ${mensaje}`);
      window.open(`https://wa.me/${numero}?text=${texto}`, '_blank');
    };
  }

  actualizarCarrito();
});