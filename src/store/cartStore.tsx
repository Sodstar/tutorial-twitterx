import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast"; // Import toast

// Define cart item type
interface CartItem {
  _id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

// Define Zustand store state & actions
interface CartState {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

// Create Zustand store with localStorage persistence
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        console.log(product)
        set((state) => {
          const existingItem = state.cart.find((item) => item._id === product._id);
          if (existingItem) {
            toast.success("Барааны тоо нэмэгдлээ! "+product._id);
            return {
              cart: state.cart.map((item) =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          } else {
            toast.success("Сагсанд нэмэдлээ!");
            return { cart: [...state.cart, { ...product, quantity: 1 }] };
          }
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),
    }),
    { name: "shopping-cart" } // Store cart in localStorage
  )
);