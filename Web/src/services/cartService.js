const CART_KEY = 'mediva_cart';

export const getCart = () => {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
};

export const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (medicine, quantity = 1) => {
    const cart = getCart();

    const medicineID = medicine.id ?? medicine.obat_id;

    const existingIndex = cart.findIndex(
        item => Number(item.obat_id) === Number(medicineID)
    );

    if (existingIndex !== -1) {
        cart[existingIndex].qty += quantity;
    } else {
        cart.push({
            obat_id: medicineID,
            nama: medicine.nama ?? medicine.nama_obat ?? medicine.name,
            harga: Number(medicine.harga ?? medicine.price ?? 0),
            jenis: medicine.jenis ?? "umum",
            foto: medicine.foto ?? medicine.image ?? null,
            qty: quantity,
        });
    }

    saveCart(cart);
    return cart;
};

export const updateCartQuantity = (medicineId, quantity) => {
    const cart = getCart();

    const updatedCart = cart.map(item => 
        Number(item.obat_id) === Number(medicineId) 
        ? { ...item, qty: Math.max(1, quantity) } : item
    );

    saveCart(updatedCart);
    return updatedCart;
};

export const removeFromCart = (medicineId) => {
    const cart = getCart().filter(
        item => Number(item.obat_id) !== Number(medicineId)
    );

    saveCart(cart);
    return cart;
};

export const clearCart = () => {
    localStorage.removeItem(CART_KEY);
};

export const getCartTotal = (cart = []) => {
    return cart.reduce(
        (total, item) => total + (item.harga * item.qty), 0
    );
};