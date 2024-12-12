document.getElementById('zona-y-horarios').addEventListener('click', () => {
    window.location.href = 'zona y horarios.html'; // Navega a otra página
  });

  document.getElementById('carta').addEventListener('click', () => {
    window.location.href = 'index.html'; // Navega a otra página
  });

  document.getElementById('carrito').addEventListener('click', () => {
    window.location.href = 'carrito.html'; // Navega a otra página
  });


  async function loadProducts() {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("Error fetching products");

      const products = await response.json();
      const container = document.getElementById("products-container");
      const categoriesContainer = document.getElementById("categories-container");

      // Carrito almacenado en localStorage
      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Agrupar productos por etiquetas
      const productsByTag = {};
      products.forEach((product) => {
        product.tags.forEach((tag) => {
          if (!productsByTag[tag]) {
            productsByTag[tag] = [];
          }
          productsByTag[tag].push(product);
        });
      });

      // Filtrar etiquetas con más de un producto
      const filteredTags = Object.entries(productsByTag).filter(([tag, products]) => products.length > 1);

      // Crear categorías dinámicamente
      filteredTags.forEach(([tag]) => {
        const categoryHTML = `
          <div class="category" onclick="scrollToCategory('${tag}')">
            <div class="category-icon">
              <img src="img/${tag}.png" alt="${tag}" class="icon">
            </div>
            <p class="category-text">${tag}</p>
          </div>
        `;
        categoriesContainer.innerHTML += categoryHTML;
      });

      // Mostrar solo etiquetas con más de un producto
      filteredTags.forEach(([tag, products]) => {
        // Agregar banner para la etiqueta
        const bannerHTML = `
          <div class="banner" id="${tag}">
            <img src="img/${tag}banner.png" alt="Banner" class="banner-image">
            <p class="banner-text">${tag}</p>
          </div>
        `;
        container.innerHTML += bannerHTML;

        // Agregar productos debajo del banner
        products.forEach((product) => {
          const productHTML = `
            <div class="product-card" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
              <p class="product-title">${product.name}</p>
              <p class="product-description">${product.description}</p>
              <p class="product-price">$${product.price}</p>
            </div>
          `;
          container.innerHTML += productHTML;
        });
      });

      // Agregar producto al carrito
      window.addToCart = function (product) {
        const existingProduct = cart.find((item) => item._id === product._id);
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Producto "${product.name}" agregado al carrito`);
      };
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  function scrollToCategory(tag) {
    const section = document.getElementById(tag);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  loadProducts();








// Mostrar el modal
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('hidden');
}

// Ocultar el modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('hidden');
}

// Evento para mostrar el modal de login
document.querySelector('.button').addEventListener('click', () => {
  showModal('loginModal');
});

// Evento para abrir el modal de registro desde el modal de login
document.querySelector('.extra-option.underline').addEventListener('click', () => {
  closeModal('loginModal'); // Cierra el modal de login
  showModal('registerModal'); // Abre el modal de registro
});











// Simulación de autenticación (usará fetch en producción)
async function loginUser(email, password) {
  try {
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Credenciales incorrectas");

    const data = await response.json();
    localStorage.setItem("user", JSON.stringify(data)); // Guarda el objeto completo del usuario
    updateUI(); // Actualiza la interfaz
    closeModal('loginModal'); // Cierra el modal de login
  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
}

// Función para registrar un nuevo usuario
async function registerUser(email, username, password, confirmPassword, address, phone) {
  try {
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password, address, phone }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al registrar usuario");
    }

    const data = await response.json();
    alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
    closeModal("registerModal"); // Cierra el modal de registro
    showModal("loginModal"); // Abre el modal de login
  } catch (error) {
    alert("Error al registrar usuario: " + error.message);
  }
}

// Evento para el botón de registro dentro del modal
document.querySelector('.register-button').addEventListener('click', () => {
  const email = document.querySelectorAll('.register-container .input-field')[0].value;
  const username = document.querySelectorAll('.register-container .input-field')[1].value;
  const password = document.querySelectorAll('.register-container .input-field')[2].value;
  const confirmPassword = document.querySelectorAll('.register-container .input-field')[3].value;
  const address = "Sin dirección"; // Puedes ajustar esto si el formulario tiene campo de dirección
  const phone = "Sin teléfono"; // Puedes ajustar esto si el formulario tiene campo de teléfono

  registerUser(email, username, password, confirmPassword, address, phone);
});







// Actualizar la interfaz según el estado del usuario
function updateUI() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    // Usuario logueado: muestra el nombre
    document.querySelector('.user-info').innerHTML = `
      <button onclick="logoutUser()">Cerrar sesión</button>
    `;
  } else {
    // Usuario no logueado: muestra el botón de entrar
    document.querySelector('.user-info').innerHTML = `
      <button class="button" onclick="showModal('loginModal')">Entrar</button>
    `;
  }
}

// Logout del usuario
function logoutUser() {
  localStorage.removeItem("user"); // Elimina el estado del usuario
  updateUI(); // Actualiza la interfaz
}

// Evento para el botón de login dentro del modal
document.querySelector('.login-button').addEventListener('click', () => {
  const email = document.querySelector('.input-field[type="email"]').value;
  const password = document.querySelector('.input-field[type="password"]').value;
  loginUser(email, password);
});

// Inicializar la interfaz al cargar la página
window.addEventListener('DOMContentLoaded', updateUI);

// Actualizar la interfaz según el estado del usuario
function updateUI() {
  const userInfo = document.querySelector('.user-info');

  if (!userInfo) {
    console.error('El elemento .user-info no existe en el DOM');
    return;
  }

  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    userInfo.innerHTML = `
      <button onclick="logoutUser()">Cerrar sesión</button>
    `;
  } else {
    userInfo.innerHTML = `
      <button class="button" onclick="showModal('loginModal')">Entrar</button>
    `;
  }
}
