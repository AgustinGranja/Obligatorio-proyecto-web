
const backendUrl = "https://obligatorio-proyecto-web-backend.onrender.com";

let orders = []; // Lista de pedidos obtenidos del backend

// Obtener pedidos del backend
async function fetchOrders() {
  try {
    const response = await fetch(`${backendUrl}/api/orders`);
    if (!response.ok) throw new Error("Error al obtener pedidos");

    orders = await response.json();
    displayOrders("all"); // Mostrar todos los pedidos inicialmente
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    alert("Ocurrió un error al cargar los pedidos");
  }
}

// Mostrar pedidos según el filtro de estado
function displayOrders(statusFilter) {
  const container = document.getElementById("orders-container");
  container.innerHTML = ""; // Limpiar el contenedor

  const filteredOrders = orders.filter(order =>
    statusFilter === "all" ? true : order.status === statusFilter
  );

  filteredOrders.forEach(order => {
    const orderHTML = `
      <div class="order-card">
        <p><strong>ID:</strong> ${order._id}</p>
        <p><strong>Cliente:</strong> ${order.userId}</p>
        <p><strong>Total:</strong> $${order.total}</p>
        <p class="order-status"><strong>Estado:</strong> ${order.status}</p>
        <select class="update-status" data-order-id="${order._id}">
          <option value="pendiente" ${order.status === "pendiente" ? "selected" : ""}>Pendiente</option>
          <option value="en_proceso" ${order.status === "en_proceso" ? "selected" : ""}>En Proceso</option>
          <option value="completado" ${order.status === "completado" ? "selected" : ""}>Completado</option>
        </select>
      </div>
    `;
    container.innerHTML += orderHTML;
  });

  // Agregar evento a los selectores de estado
  document.querySelectorAll(".update-status").forEach(select => {
    select.addEventListener("change", updateOrderStatus);
  });
}

// Actualizar el estado del pedido
async function updateOrderStatus(event) {
  const orderId = event.target.getAttribute("data-order-id");
  const newStatus = event.target.value;

  try {
    const response = await fetch(`${backendUrl}/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error("Error al actualizar estado del pedido");

    const updatedOrder = await response.json();
    alert(`Estado del pedido actualizado a: ${updatedOrder.status}`);
    fetchOrders(); // Recargar los pedidos
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    alert("Ocurrió un error al actualizar el estado del pedido");
  }
}

// Agregar eventos a los filtros
document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    const statusFilter = button.getAttribute("data-status");
    displayOrders(statusFilter);
  });
});

// Inicializar la página
fetchOrders();
