document.getElementById('zona-y-horarios').addEventListener('click', () => {
    window.location.href = 'zona y horarios.html'; // Navega a otra página
  });

  document.getElementById('carta').addEventListener('click', () => {
    window.location.href = 'index.html'; // Navega a otra página
  });

  document.getElementById('carrito').addEventListener('click', () => {
    window.location.href = 'carrito.html'; // Navega a otra página
  });

  const backendUrl = "https://obligatorio-proyecto-web-backend.onrender.com";


/*CARGAR CARRITO */


// Recuperar carrito de localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Cargar productos en el carrito dinámicamente
function loadCart() {
  const cartContainer = document.querySelector('.order-details-container');
  cartContainer.innerHTML = '<p class="order-title">Detalle del pedido</p>';

  if (cart.length === 0) {
    cartContainer.innerHTML += '<p>No hay productos en el carrito.</p>';
    return;
  }

  cart.forEach((item, index) => {
    const itemHTML = `
      <div class="order-item">
        <p class="item-quantity">${item.quantity}</p>
        <p class="item-description">${item.name}</p>
        <p class="item-price">$${item.price * item.quantity}</p>
        <img class="item-image" src="img/ph--trash.png" alt="Producto" onclick="removeFromCart(${index})">
      </div>
    `;
    cartContainer.innerHTML += itemHTML;
  });

  updateTotal();
}

// Eliminar producto del carrito
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

// Actualizar total del carrito
function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelector('.order-total').textContent = `$${total}`;
}

// Inicializar
loadCart();



/*REALIZAR PEDDIDO*/

const user = JSON.parse(localStorage.getItem("user"));

async function placeOrder() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userId) {
      alert("Debes iniciar sesión antes de realizar un pedido.");
      return;
    }

    const userId = user.userId;
    const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;
    const deliveryAddress = localStorage.getItem('deliveryAddress');
    const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon'));

    if (deliveryMethod === "home" && !deliveryAddress) {
      alert("Por favor, ingresa una dirección de entrega.");
      return;
    }

    const order = {
      userId,
      items: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      deliveryMethod,
      deliveryAddress: deliveryMethod === "home" ? deliveryAddress : null,
      coupon: appliedCoupon ? appliedCoupon.code : null, // Incluir el código del cupón si existe
    };

    const response = await fetch(`${backendUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al enviar el pedido");
    }

    alert("Pedido realizado con éxito");
    cart = [];
    localStorage.removeItem("cart");
    localStorage.removeItem("appliedCoupon"); // Limpiar el cupón después del pedido
    loadCart();
  } catch (error) {
    console.error("Error al realizar el pedido:", error);
    alert("Ocurrió un error al enviar el pedido. Inténtalo nuevamente.");
  }
}

  
  
  
  





/*DIRECCION */




// Manejar la opción de entrega
document.querySelectorAll('.radio-input[name="delivery"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const addressField = document.querySelector('.order-address-field');
      if (radio.value === 'home') {
        addressField.style.display = 'block'; // Mostrar campo para dirección
      } else {
        addressField.style.display = 'none'; // Ocultar campo para dirección
        document.querySelector('.order-input').value = ''; // Limpiar el campo de dirección
        localStorage.removeItem('deliveryAddress'); // Eliminar dirección del localStorage
      }
    });
  });
  
  // Botón para agregar dirección
  document.querySelector('.add-address-button').addEventListener('click', () => {
    const deliveryAddress = prompt('Por favor, ingresa tu dirección:');
    if (deliveryAddress) {
      document.querySelector('.order-input').value = deliveryAddress;
      localStorage.setItem('deliveryAddress', deliveryAddress); // Guardar en localStorage
    }
  });
  
  // Guardar automáticamente la dirección cuando se escribe en el campo
  document.querySelector('.order-input').addEventListener('input', (e) => {
    const deliveryAddress = e.target.value;
    if (deliveryAddress) {
      localStorage.setItem('deliveryAddress', deliveryAddress); // Guardar en localStorage
    } else {
      localStorage.removeItem('deliveryAddress'); // Eliminar si el campo está vacío
    }
  });





  /*CUPONES*/
  



// Lista de cupones disponibles (puede ser dinámica desde el backend)
const availableCoupons = {
  "DESCUENTO10": 10, // 10% de descuento
  "DESCUENTO20": 20, // 20% de descuento
  "DESCUENTO50": 50  // 50% de descuento
};

// Manejar la verificación del cupón
document.querySelector('.verify-button').addEventListener('click', () => {
  const couponInput = document.querySelector('.coupon-input').value.trim().toUpperCase();
  
  if (availableCoupons[couponInput]) {
    const discount = availableCoupons[couponInput];
    localStorage.setItem('appliedCoupon', JSON.stringify({ code: couponInput, discount }));
    alert(`Cupón válido! Se ha aplicado un descuento del ${discount}%.`);
    updateTotal(); // Actualizar el total con el descuento
  } else {
    alert("Cupón inválido. Por favor, verifica el código ingresado.");
    localStorage.removeItem('appliedCoupon'); // Eliminar cualquier cupón previamente aplicado
    updateTotal(); // Actualizar el total sin descuento
  }
});

// Modificar la función de actualizar el total para incluir el descuento
function updateTotal() {
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Verificar si hay un cupón aplicado
  const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon'));
  if (appliedCoupon) {
    const discount = (total * appliedCoupon.discount) / 100;
    total -= discount; // Aplicar el descuento
    document.querySelector('.order-total').textContent = `$${total.toFixed(2)} (Descuento: ${appliedCoupon.discount}%)`;
  } else {
    document.querySelector('.order-total').textContent = `$${total.toFixed(2)}`;
  }
}


  









