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

// --- MEJORA 1 y 3: Unificación y accesibilidad en abrirModal/cerrarModal ---
function abrirModal(modal) {
  if (typeof modal === "string") modal = document.getElementById(modal);
  if (!modal) return;
  modal.style.display = 'block';
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('tabindex', '-1');
  modal.focus();
  document.body.style.overflow = 'hidden';
}
function cerrarModal(modal) {
  if (typeof modal === "string") modal = document.getElementById(modal);
  if (!modal) return;
  modal.style.display = 'none';
  modal.removeAttribute('aria-modal');
  modal.removeAttribute('role');
  modal.removeAttribute('tabindex');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function() {
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

  function abrirModalCategorias() {
    abrirModal('modal-categorias');
  }

  // Abrir modal desde menú o botón
  document.querySelectorAll('a[href="#productos"], .hero .btn').forEach(el => {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      abrirModalCategorias();
    });
  });

  // Cerrar modal al hacer clic fuera del contenido
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) cerrarModal(modal);
    });
  });

  // Mejora 4: Cerrar modal con tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
      document.querySelectorAll('.modal[style*="display: block"]').forEach(modal => {
        cerrarModal(modal);
      });
    }
  });

  // Mejora 5: Solo productos destacados en el HTML principal (haz esto en tu HTML)
});
  // ----------- MODALES DE CATEGORÍAS Y PRODUCTOS -----------
const productosPorCategoria = {
  proteinas: [
    {
      nombre: "WHEY PURE 1LB 15 SERVICIOS VAINILLA",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 72000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "WHEY PURE 2LB 30 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 140000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "WHEY PURE 5LB 75 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 284000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "MASS EVOLUTION 2LB 6 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 45100,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "MASS EVOLUTION 4LB 13 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 79000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "MASS EVOLUTION 10LB 30 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 168000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "TNT 10LB 14 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 252000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "TNT 6LB 9 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 160000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "TNT 3LB 5 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 83000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "ISOFIT 2LB 28 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 175000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "ISOWHEY 2LB 30 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 170000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "THE WHEY OF IMN 3LB 16 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 90000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "PROTON WHEY 4LB 60 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 297600,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "PROTON WHEY 2LB 30 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 160000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "PROTON GAINER 3LB 6 SERVICIOS VAINILLA",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 85000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "PROTON GAINER 6LB 6 SERVICIOS VAINILLA",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 160000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "SMART GAINER 13LB 24 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 315000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "SMART GAINER 6LB 11 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 160000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "SMART GAINER 3LB 6 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 90000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "ISOBEST 2LB 28 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 240000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "BEST PROTEIN 2LB 28 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 199000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "BEST WHEY 2LB 28 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 150000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "BEST PROTEIN 4LB 55 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 370000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "BEST PROTEIN 1LB 14 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 100000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "BEST VEGAN 2LB 28 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 130000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "CAJA BIPRO CLASSIC 18 SOBRES VAINILLA",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 85000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "BIPRO CLASSIC 1LB 16 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 80000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "BIPRO CLASSIC 2LB 35 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 165000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "BIPRO CLASSIC 3LB 52 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 225000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "ISOCLEAN 2LB 36 SERVICIOS SABOR SURTIDO",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 175000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "BIPRO LITE 2LB 20 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 165000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "BIPRO RIPPED 2LB 20 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 165000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "MEGAPLEX LITE 2LB 25 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 155000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "BIPRO MASS 3LB 19 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPERCALORICA GANADOR DE PESO. Ideal para aumentar masa muscular y peso.",
      precio: 165000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "BIPRO COMPLEX 2LB 17 SERVICIOS SABOR VAINILLA",
      descripcion: "PROTEINA HIPOCALORICA LIMPIA. Suplemento ideal para recuperación y desarrollo muscular.",
      precio: 165000,
      imagen: "ruta-a-tu-imagen.jpg"
    }
  ],
  creatinas: [
    {
      nombre: "CREATINA ULTRA PURE 100 SERVICIOS SIN SABOR",
      descripcion: "CREATINA MONOHIDRATADA. Mejora el rendimiento físico y la fuerza.",
      precio: 130000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "CREA4 SMART 92 SERVICIOS FRUTOS ROJOS",
      descripcion: "CREATINA MONOHIDRATADA. Mejora el rendimiento físico y la fuerza.",
      precio: 77000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "CREATINA INSTICT 60 SERVICIOS SABOR UVA",
      descripcion: "CREATINA MONOHIDRATADA. Mejora el rendimiento físico y la fuerza.",
      precio: 70000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "CREATINA INSTICT 30 SERVICIOS SABOR UVA",
      descripcion: "CREATINA MONOHIDRATADA. Mejora el rendimiento físico y la fuerza.",
      precio: 41000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "TNT PARANOIA 24 SERVICIOS NARANJA",
      descripcion: "PREENTRENO. Aumenta la energía y el enfoque durante el entrenamiento.",
      precio: 105000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "CR2 60 SERVICIOS SABOR SURTIDO",
      descripcion: "CREATINA HCL Y MONOHIDRATO. Mejora el rendimiento físico y la fuerza.",
      precio: 99000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "CREATINA IMN 133 SERVICIOS SIN SABOR",
      descripcion: "CREATINA MONOHIDRATADA. Mejora el rendimiento físico y la fuerza.",
      precio: 119000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "CREATINA IMN 50 SERVICIOS SIN SABOR",
      descripcion: "CREATINA MONOHIDRATADA. Mejora el rendimiento físico y la fuerza.",
      precio: 49000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "ATOMIC HCL 60 SERVICIOS SABOR SURTIDO",
      descripcion: "CREATINA HCL. Mejora el rendimiento físico y la fuerza.",
      precio: 90000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "ATOMIC MONOHIDRATO 120 SERVICIOS SIN SABOR",
      descripcion: "CREATINA MONOHIDRATADA. Mejora el rendimiento físico y la fuerza.",
      precio: 115000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "LEGEND 30 SERVICIOS SABOR SURTIDO",
      descripcion: "CREATINA MONOHIDRATADA. Mejora el rendimiento físico y la fuerza.",
      precio: 80000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "CREATINA TIME 100 SERVICIOS SIN SABOR",
      descripcion: "CREATINA MONOHIDRATADA. Mejora el rendimiento físico y la fuerza.",
      precio: 98000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "CREATINA 3.000 100 SERVICIOS SIN SABOR",
      descripcion: "CREATINA MONOHIDRATADA. Mejora el rendimiento físico y la fuerza.",
      precio: 125000,
      imagen: "ruta-a-tu-imagen.jpg"
    },
    {
      nombre: "CREATINA 3.000 50 SERVICIOS SIN SABOR",
      descripcion: "CREATINA MONOHIDRATADA. Mejora el rendimiento físico y la fuerza.",
      precio: 70000,
      imagen: "ruta-a-tu-imagen.jpg"
    }
  ],
// ...dentro de productosPorCategoria
aminoacidos: [
  {
    nombre: "ARMY 30 SERVICIOS SABOR SURTIDO",
    descripcion: "AMINOÁCIDOS. Apoya la recuperación y el desarrollo muscular.",
    precio: 115000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "BCAAS 30 SERVICIOS PASTILLAS",
    descripcion: "AMINOÁCIDOS. Apoya la recuperación y el desarrollo muscular.",
    precio: 77000,
    imagen: "ruta-a-tu-imagen.jpg"
  }
],
preentrenos: [
  {
    nombre: "ULTIMATE 30 SERVICIOS SABOR SURTIDO",
    descripcion: "PREENTRENO. Aumenta la energía y el enfoque durante el entrenamiento.",
    precio: 120000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "ELECTRON 30 SERVICIOS SABOR SURTIDO",
    descripcion: "PREENTRENO. Aumenta la energía y el enfoque durante el entrenamiento.",
    precio: 125000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "INTENZE 30 SERVICIOS SABOR SURTIDO",
    descripcion: "PREENTRENO. Aumenta la energía y el enfoque durante el entrenamiento.",
    precio: 145000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "INTENZE 14 SERVICIOS SABOR SURTIDO",
    descripcion: "PREENTRENO. Aumenta la energía y el enfoque durante el entrenamiento.",
    precio: 75000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "INTENZE READY LATA",
    descripcion: "PREENTRENO. Aumenta la energía y el enfoque durante el entrenamiento.",
    precio: 10000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "INTENZE VITALY LATA",
    descripcion: "PREENTRENO. Aumenta la energía y el enfoque durante el entrenamiento.",
    precio: 10000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "INTENZE SACHET 12 SOBRE FRUTOS ROJOS",
    descripcion: "PREENTRENO. Aumenta la energía y el enfoque durante el entrenamiento.",
    precio: 68400,
    imagen: "ruta-a-tu-imagen.jpg"
  }
],
vitaminas: [
  {
    nombre: "OMEGA 3 1.200 MG 20 SERVICIOS CAPSULAS",
    descripcion: "OMEGA 3. Ácidos grasos esenciales para la salud cardiovascular y cerebral.",
    precio: 47000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "VITAMINA C 1000 MG CON ZINC 100 SERVICIOS CAPSULAS",
    descripcion: "VITAMINA C. Refuerza el sistema inmunológico y antioxidante.",
    precio: 63000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "SUPER MAGNESIO 50 SERVICIOS CAPSULAS",
    descripcion: "MAGNESIO ASPARTATO, LACTATO Y CITRATO. Apoya la función muscular y nerviosa.",
    precio: 77000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "ENZYMAX 60 SERVICIOS CAPSULAS",
    descripcion: "ENZIMAS DIGESTIVAS. Mejora la digestión y absorción de nutrientes.",
    precio: 83000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "MELATONINA 3MG 120 SERVICIOS CAPSULAS",
    descripcion: "MELATONINA. Ayuda a regular el sueño y el descanso.",
    precio: 50000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "VITAMINA D3+K2 100 SERVICIOS CAPSULAS",
    descripcion: "VITAMINA D3. Apoya la salud ósea y el sistema inmunológico.",
    precio: 78000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "VITAMINA E 1000 UI 50 SERVICIOS CAPSULAS",
    descripcion: "VITAMINA E. Antioxidante que protege las células del daño.",
    precio: 72000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "CALCIUM PLUS 60 SERVICIOS CAPSULAS",
    descripcion: "CALCIO VITAMINA D3. Apoya la salud ósea y dental.",
    precio: 42000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "B-COMPLEX WITH B-12 90 SERVICIOS PASTILLAS",
    descripcion: "VITAMINA B12. Apoya el metabolismo energético y el sistema nervioso.",
    precio: 45000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "COLLAGEN + BIOTINA 50 SERVICIOS CAPSULAS",
    descripcion: "COLAGENO BIOTINA. Favorece la salud de la piel, cabello y uñas.",
    precio: 73000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "COLLAGEN PEPTIDOS 60 SERVICIOS CAPSULAS",
    descripcion: "COLAGENO. Favorece la salud de la piel, articulaciones y huesos.",
    precio: 77000,
    imagen: "ruta-a-tu-imagen.jpg"
  }
],
otros: [
  {
    nombre: "GLUTAMINA FAST 60 SERVICIOS SIN SABOR",
    descripcion: "GLUTAMINA. Favorece la recuperación muscular y el sistema inmunológico.",
    precio: 77000,
    imagen: "ruta-a-tu-imagen.jpg"
  },
  {
    nombre: "ENZYMAX 60 SERVICIOS CAPSULAS",
    descripcion: "ENZIMAS DIGESTIVAS. Mejora la digestión y absorción de nutrientes.",
    precio: 83000,
    imagen: "ruta-a-tu-imagen.jpg"
  }
]
  };
function mostrarProductosCategoria(cat) {
  const modal = document.getElementById('modal-productos-categoria');
  const titulo = document.getElementById('titulo-categoria');
  const lista = document.getElementById('lista-productos-categoria');
  const nombres = {
    proteinas: "Proteínas",
    creatinas: "Creatinas",
    aminoacidos: "Aminoácidos",
    preentrenos: "Preentrenos",
    vitaminas: "Vitaminas y Salud",
    otros: "Otros"
  };
  titulo.textContent = nombres[cat] || cat;
  if (!productosPorCategoria[cat] || productosPorCategoria[cat].length === 0) {
    lista.innerHTML = "<p>No hay productos en esta categoría.</p>";
  } else {
    lista.innerHTML = productosPorCategoria[cat].map(p => `
      <div class="producto">
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p class="descripcion">${p.descripcion}</p>
        <p class="precio">$${p.precio.toLocaleString('es-CO')}</p>
        <button onclick="agregarAlCarrito('${p.nombre}', ${p.precio}, '${p.descripcion}')">Agregar al carrito</button>
      </div>
    `).join('');
  }
  cerrarModal('modal-categorias');
  abrirModal(modal);
}