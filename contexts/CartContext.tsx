import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { Product, ProductVariant } from '@/data/products';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | {
      type: 'ADD_TO_CART';
      payload: { product: Product; variant: ProductVariant; quantity: number };
    }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: number; variantId: string } }
  | {
      type: 'UPDATE_QUANTITY';
      payload: { productId: number; variantId: string; quantity: number };
    }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

// ✅ Version key for safe storage
const CART_STORAGE_KEY = 'cart_v1';

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === action.payload.product.id &&
          item.variant.id === action.payload.variant.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      const { total, itemCount } = calculateTotals(newItems);
      return { items: newItems, total, itemCount };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(
        (item) =>
          !(
            item.product.id === action.payload.productId &&
            item.variant.id === action.payload.variantId
          )
      );
      const { total, itemCount } = calculateTotals(newItems);
      return { items: newItems, total, itemCount };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items
        .map((item) =>
          item.product.id === action.payload.productId &&
          item.variant.id === action.payload.variantId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);

      const { total, itemCount } = calculateTotals(newItems);
      return { items: newItems, total, itemCount };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (
    product: Product,
    variant: ProductVariant,
    quantity?: number
  ) => void;
  removeFromCart: (productId: number, variantId: string) => void;
  updateQuantity: (
    productId: number,
    variantId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // ✅ Load cart from localStorage when app mounts
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart) as CartState;
        dispatch({ type: 'LOAD_CART', payload: parsed });
      } catch (error) {
        console.error('❌ Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // ✅ Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('❌ Error saving cart to localStorage:', error);
    }
  }, [state]);

  const addToCart = (
    product: Product,
    variant: ProductVariant,
    quantity = 1
  ) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, variant, quantity },
    });
  };

  const removeFromCart = (productId: number, variantId: string) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { productId, variantId },
    });
  };

  const updateQuantity = (
    productId: number,
    variantId: string,
    quantity: number
  ) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, variantId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
