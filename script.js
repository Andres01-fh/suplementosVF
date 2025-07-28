let carrito = [];

function agregarAlCarrito(nombre, precio, descripcion) {
  carrito.push({ nombre, precio, descripcion });
  actualizarCarrito();
  mostrarCarrito();
  const carritoIcono = document.getElementById('abrir-carrito');
  carritoIcono.classList.add('agregado');
  setTimeout(() => carritoIcono.classList.remove('agregado'), 400);
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
        <div>
          <span><strong>${item.nombre}</strong></span><br>
          <span style="font-size:0.95em;color:#555;">${item.descripcion || ''}</span>
        </div>
        <span>$${item.precio.toLocaleString('es-CO')}</span>
        <button onclick="eliminarDelCarrito(${i})" style="background:none;border:none;color:#e65100;cursor:pointer;">✕</button>
      </div>`
    ).join('');
    total.textContent = `Total: $${calcularTotal().toLocaleString('es-CO')}`;
  }
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
  mostrarCarrito();
}

function abrirModal(modal) {
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function cerrarModal(modal) {
  modal.style.display = 'none';
  document.body.style.overflow = '';
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
    abrirModal(modalProductos);
  }

  if (productosBtn) productosBtn.addEventListener('click', abrirModalProductos);
  if (verProductosBtn) verProductosBtn.addEventListener('click', abrirModalProductos);

  cerrarProductos.onclick = function() {
    cerrarModal(modalProductos);
  };

  // Modal carrito
  const modalCarrito = document.getElementById('modal-carrito');
  const abrirCarrito = document.getElementById('abrir-carrito');
  const cerrarCarrito = document.getElementById('cerrar-carrito');
  const pagarBtn = document.getElementById('pagar-btn');
  const pseBtn = document.getElementById('pse-btn');

  if (abrirCarrito) {
    abrirCarrito.onclick = function() {
      mostrarCarrito();
      abrirModal(modalCarrito);
    };
  }
  if (cerrarCarrito) {
    cerrarCarrito.onclick = function() {
      cerrarModal(modalCarrito);
    };
  }

  window.onclick = function(event) {
    if (event.target == modalProductos) cerrarModal(modalProductos);
    if (event.target == modalCarrito) cerrarModal(modalCarrito);
  };

  if (pagarBtn) {
    pagarBtn.onclick = function() {
      if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
      }
      alert('Aquí iría la integración con el pago seguro electrónico.');
    };
  }

  if (pseBtn) {
    pseBtn.onclick = function() {
      if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
      }
      window.open('https://www.bancolombia.com/personas/soluciones-para-tu-negocio/pagos/pse', '_blank');
    };
  }

  const formContacto = document.getElementById('form-contacto');
  if (formContacto) {
    formContacto.onsubmit = function(e) {
      e.preventDefault();
      const nombre = this.querySelector('input[type="text"]').value;
      const correo = this.querySelector('input[type="email"]').value;
      const mensaje = this.querySelector('textarea').value;
      const numero = '573006308285';
      const resumen = carrito.length
        ? '\nPedido:\n' + carrito.map(item => `${item.nombre} - $${item.precio}\n${item.descripcion}`).join('\n') + `\nTotal: $${calcularTotal().toLocaleString('es-CO')}`
        : '';
      const texto = encodeURIComponent(
        `Nombre: ${nombre}\nCorreo: ${correo}\nMensaje: ${mensaje}${resumen}`
      );
      window.open(`https://wa.me/${numero}?text=${texto}`, '_blank');
    };
  }

  // Menú hamburguesa
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('header nav');
  if (menuToggle && nav) {
    menuToggle.onclick = function(e) {
      e.stopPropagation();
      nav.classList.toggle('abierto');
      if (nav.classList.contains('abierto')) {
        nav.style.zIndex = 2102;
      } else {
        nav.style.zIndex = 2100;
      }
    };
    nav.querySelectorAll('a').forEach(link => {
      link.onclick = () => nav.classList.remove('abierto');
    });
    document.addEventListener('click', function(e) {
      if (
        nav.classList.contains('abierto') &&
        !nav.contains(e.target) &&
        e.target !== menuToggle
      ) {
        nav.classList.remove('abierto');
      }
    });
  }

  // ----------- CATEGORÍAS DESPLEGABLES -----------
  const productosMenu = document.querySelector('nav a[href="#productos"]');
  const categoriasListado = document.getElementById('categorias-listado');
  if (productosMenu && categoriasListado) {
    productosMenu.addEventListener('click', function(e) {
      e.preventDefault();
      categoriasListado.style.display = categoriasListado.style.display === 'none' ? 'block' : 'none';
      categoriasListado.scrollIntoView({ behavior: 'smooth' });
    });
    categoriasListado.querySelectorAll('.categoria-link').forEach(link => {
      link.addEventListener('click', function() {
        categoriasListado.style.display = 'none';
      });
    });
  }

  actualizarCarrito();
});