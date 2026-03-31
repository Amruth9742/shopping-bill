import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { loadCart, saveCart } from "../../utils/firestore";

type CartState = {
  items: Record<string, number>;
  status: "idle" | "loading" | "error";
  error?: string;
};

const initialState: CartState = {
  items: {},
  status: "idle",
};

export const fetchCart = createAsyncThunk<Record<string, number>, string | undefined>(
  "cart/fetchCart",
  async (userId = "default") => {
    const items = await loadCart(userId);
    return items;
  }
);

export const addItemToCart = createAsyncThunk<Record<string, number>, { item: string; userId?: string }>(
  "cart/addItemToCart",
  async (
    payload,
    { dispatch, getState }
  ) => {
    dispatch(addItem(payload.item));

    const state = getState() as { cart: CartState };
    await saveCart(state.cart.items, payload.userId ?? "default");

    return state.cart.items;
  }
);

export const decrementItemFromCart = createAsyncThunk<Record<string, number>, { item: string; userId?: string }>(
  "cart/decrementItemFromCart",
  async (
    payload,
    { dispatch, getState }
  ) => {
    dispatch(decrementItem(payload.item));

    const state = getState() as { cart: CartState };
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
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(decrementItemFromCart.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      });
  },
});

export const { addItem, decrementItem, setCart } = cartSlice.actions;
export default cartSlice.reducer;