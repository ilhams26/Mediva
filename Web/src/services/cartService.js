
const CART_KEY = "mediva_cashier_cart";

// Mengambil data keranjang dari localStorage
export const getCart = () => {
  try {
    const cart = JSON.parse(
      localStorage.getItem(CART_KEY)
    );

    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
};

// Menyimpan data keranjang
export const saveCart = (cart) => {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );
};

// Menambahkan obat ke keranjang
export const addToCart = (medicine, quantity = 1) => {
  const cart = getCart();

  const medicineId =
    medicine.id ?? medicine.obat_id;

  const stok = Number(
    medicine.stok ?? medicine.stock ?? 0
  );

  const harga = Number(
    medicine.harga ?? medicine.price ?? 0
  );

  const qty = Number(quantity);

  if (
    !medicineId ||
    !Number.isInteger(qty) ||
    qty < 1
  ) {
    throw new Error(
      "Data obat atau jumlah tidak valid"
    );
  }

  const existing = cart.find(
    (item) =>
      String(item.obat_id) === String(medicineId)
  );

  const totalQty = (existing?.qty ?? 0) + qty;

  if (totalQty > stok) {
    throw new Error(
      "Jumlah obat melebihi stok yang tersedia."
    );
  }

  if (existing) {
    existing.qty = totalQty;
  } else {
    cart.push({
      obat_id: medicineId,
      nama: medicine.nama ?? medicine.name,
      harga,
      qty,
      stok,
    });
  }

  saveCart(cart);

  return cart;
};

// Mengubah jumlah obat
export const updateCartQuantity = (id, quantity) => {
  const cart = getCart();

  const updated = cart.map((item) =>
    String(item.obat_id) === String(id)
      ? {
          ...item,
          qty: Math.max(1, Number(quantity)),
        }
      : item
  );

  saveCart(updated);

  return updated;
};

// Menghapus obat dari keranjang
export const removeFromCart = (id) => {
  const updated = getCart().filter(
    (item) =>
      String(item.obat_id) !== String(id)
  );

  saveCart(updated);

  return updated;
};

// Mengosongkan keranjang
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};

// Menghitung total harga
export const getCartTotal = (cart) => {
  return cart.reduce(
    (total, item) =>
      total +
      Number(item.harga) * Number(item.qty),
    0
  );
};
