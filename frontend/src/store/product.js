import { create } from "zustand";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      set({ products: data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: "Server unavailable or network error" });
    }
  },

  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill all fields" };
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error("Failed to create product");

      const data = await res.json();
      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: "Product created successfully" };
    } catch (error) {
      return { success: false, message: "Server error. Please try again." };
    }
  },

  updateProduct: async (id, updatedProduct) => {
    const prevState = get().products;

    const optimistic = prevState.map((p) =>
      p._id === id ? { ...p, ...updatedProduct } : p
    );
    set({ products: optimistic });

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();

      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? data.data : p
        ),
      }));

      return { success: true, message: "Product updated successfully" };
    } catch (error) {
      set({ products: prevState });
      return { success: false, message: "Server error during update" };
    }
  },

  deleteProduct: async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
      }));

      return { success: true, message: "Product deleted successfully" };
    } catch (error) {
      return { success: false, message: "Delete failed. Server error." };
    }
  },
}));
