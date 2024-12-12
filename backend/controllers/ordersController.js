const Order = require('../models/Order'); // Modelo de la orden

// Crear una nueva orden
exports.createOrder = async (req, res) => {
  try {
    const { items, total, changeFrom } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío." });
    }

    // Crear la orden
    const newOrder = new Order({
      items,
      total,
      changeFrom,
      createdAt: new Date(),
    });

    await newOrder.save();
    res.status(201).json({ message: "Orden creada con éxito", order: newOrder });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ message: "Error al procesar la orden" });
  }
};
