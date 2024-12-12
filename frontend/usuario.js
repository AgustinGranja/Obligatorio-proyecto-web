
const backendUrl = "https://obligatorio-proyecto-web-backend.onrender.com";

// Obtener datos del usuario
async function fetchUserData() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.userId) {
    alert("Debes iniciar sesión para ver tus datos");
    return;
  }

  try {
    const response = await fetch(`${backendUrl}/api/users/${user.userId}`);
    if (!response.ok) throw new Error("Error al obtener datos del usuario");

    const userData = await response.json();
    console.log("Datos del usuario:", userData); // Verificar los datos aquí
    displayUserData(userData);
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    alert("Ocurrió un error al obtener tus datos");
  }
}
  
  // Mostrar datos del usuario en la página
  function displayUserData(user) {
    document.getElementById("user-name").textContent = `Nombre: ${user.username}`;
    document.getElementById("user-email").textContent = `Email: ${user.email}`;
    document.getElementById("user-phone").textContent = `Teléfono: ${user.phone}`;
    document.getElementById("user-address").textContent = `Dirección: ${user.address || "Sin dirección"}`;
  }
  
  
  // Actualizar datos del usuario
  async function updateUserData(field, value) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userId) {
      alert("Debes iniciar sesión para editar tus datos");
      return;
    }
  
    try {
      const response = await fetch(`${backendUrl}/api/users/${user.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
  
      if (!response.ok) throw new Error("Error al actualizar datos del usuario");
  
      const updatedUser = await response.json();
      alert("Datos actualizados con éxito");
      displayUserData(updatedUser);
    } catch (error) {
      console.error("Error al actualizar datos del usuario:", error);
      alert("Ocurrió un error al actualizar tus datos");
    }
  }
  
  // Eliminar cuenta del usuario
  async function deleteUserAccount() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userId) {
      alert("Debes iniciar sesión para eliminar tu cuenta");
      return;
    }
  
    try {
      const confirmDelete = confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
      if (!confirmDelete) return;
  
      const response = await fetch(`${backendUrl}/api/users/${user.userId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Error al eliminar cuenta");
  
      alert("Cuenta eliminada con éxito");
      localStorage.removeItem("user");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      alert("Ocurrió un error al eliminar tu cuenta");
    }
  }
  
  // Agregar eventos a los botones
  document.querySelector(".add-address-button").addEventListener("click", () => {
    const newAddress = prompt("Ingresa tu nueva dirección:");
    if (newAddress) {
      updateUserData("address", newAddress);
    }
  });
  
  document.querySelector(".delete-account-button").addEventListener("click", deleteUserAccount);
  
  // Inicializar datos del usuario
  fetchUserData();

  function editUserData(field) {
  const currentValue = document.getElementById(`user-${field}`).textContent.split(": ")[1];
  const newValue = prompt(`Ingresa el nuevo valor para ${field}:`, currentValue);

  if (newValue && newValue.trim() !== "") {
    updateUserData(field, newValue.trim());
  } else {
    alert("El valor ingresado no es válido.");
  }
}

  