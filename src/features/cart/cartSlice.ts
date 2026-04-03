import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { loadCart, saveCart } from "../../utils/firestore";
import { calculateBill } from "../../utils/billing";
// import type { Product } from "../products/productsSlice";
// import { useAppSelector } from "../../app/hooks";
import { type RootState } from "../../app/store";



type CartState = {
  items: Record<string, number>;
  status: "idle" | "loading" | "error";
  error?: string;
  budget: number | null;
  budgetExceeded: boolean;
};

const initialState: CartState = {
  items: {},
  status: "idle",
  budget: null,
  budgetExceeded: false,
};

export const fetchCart = createAsyncThunk<Record<string, number>, string | undefined>(
  "cart/fetchCart",
  async (userId = "default") => {
    const items = await loadCart(userId);
    return items;
  }
);

export const addItemToCart = createAsyncThunk<Record<string, number>, { item: string; userId?: string }, {state: RootState}>(
  "cart/addItemToCart",
  async (
    payload,
    { dispatch, getState }
  ) => {
    const state = getState() as RootState;
    const currentItems = state.cart.items;
    const products = state.products.products;
    const budget = state.cart.budget;

    const updatedItems = {
      ...currentItems,
      [payload.item]: (currentItems[payload.item] || 0) + 1,
    };

    const { total } = calculateBill(updatedItems, products);

    if (budget !== null && total > budget) {
      dispatch(setBudgetExceeded(true));
      return currentItems;
    }

    dispatch(setBudgetExceeded(false));
    dispatch(addItem(payload.item));
    await saveCart({ ...currentItems, [payload.item]: (currentItems[payload.item] || 0) + 1 }, payload.userId ?? "default");

    return updatedItems;
  }
);

export const decrementItemFromCart = createAsyncThunk<Record<string, number>, { item: string; userId?: string }, {state: RootState}>(
  "cart/decrementItemFromCart",
  async (
    payload,
    { dispatch, getState }
  ) => {
    dispatch(decrementItem(payload.item));

    const state = getState() as RootState;
    const { items, budget } = state.cart;
    const { products } = state.products;

    if (budget !== null) {
      const { total } = calculateBill(items, products);
      if (total <= budget) {
        dispatch(setBudgetExceeded(false));
      }
    }

    await saveCart(state.cart.items, payload.userId ?? "default");

    return state.cart.items;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      state.items[action.payload] =
        (state.items[action.payload] || 0) + 1;
    },

    decrementItem: (state, action: PayloadAction<string>) => {
      if (state.items[action.payload] > 1) {
        state.items[action.payload]--;
      } else {
        delete state.items[action.payload];
      }
    },

    setCart: (state, action: PayloadAction<Record<string, number>>) => {
      state.items = action.payload;
    },

    setBudget: (state, action: PayloadAction<number>) => {
      state.budget = action.payload;
      state.budgetExceeded = false;
      state.error = undefined;
    },

    setBudgetExceeded: (state, action: PayloadAction<boolean>) => {
      state.budgetExceeded = action.payload;
      if (!action.payload) {
        state.error = undefined;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })
        .addCase(decrementItemFromCart.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      });
  },
});

export const { addItem, decrementItem, setCart, setBudget, setBudgetExceeded } = cartSlice.actions;
export default cartSlice.reducer;