import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  name: string;
  price: number;
}

type ProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setProducts, setLoading, setError } = productsSlice.actions;
export default productsSlice.reducer;