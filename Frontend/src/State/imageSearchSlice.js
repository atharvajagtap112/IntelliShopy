import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api } from "../config/apiConfig";


const loadStateFromStorage = () => {
  try {
    const serializedState = sessionStorage.getItem('imageSearchState');
    if (serializedState === null) {
      return {
        loading: false,
        products: [],
        error: null,
        searchMetadata: null,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      loading: false,
      products: [],
      error:  null,
      searchMetadata: null,
    };
  }
};


const saveStateToStorage = (state) => {
  try {
    const serializedState = JSON.stringify({
      products: state.products,
      searchMetadata: state.searchMetadata,
    });
    sessionStorage.setItem('imageSearchState', serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

export const searchByImage = createAsyncThunk(
  "imageSearch/searchByImage",
  async ({ image, color }, { rejectWithValue }) => {
    try {
      console.log("Searching image with color filter:");
      const formData = new FormData();
      formData.append("image", image);

      if (color) {
        formData.append("color", color);
      }

      const response = await api.post(
        "/products/search/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Image search response:", response.data);
   
      return { 
        products: response.data,
        metadata: { color, timestamp: Date.now() }
      };
    } catch (err) {
      console.error("Image search error:", err);
      return rejectWithValue(err.response?.data || "Image search failed");
    }
  }
);

// Text -> CLIP -> products whose *images* match the description. Used as the
// fallback when the AI filter search can't map a query to a category
// ("something elegant for a beach wedding"). Results land in the same state as
// image search, so the same results page renders them.
export const searchByText = createAsyncThunk(
  "imageSearch/searchByText",
  async ({ query }, { rejectWithValue }) => {
    try {
      const response = await api.get("/products/search/text", { params: { q: query } });
      return {
        products: response.data,
        metadata: { query, timestamp: Date.now() }
      };
    } catch (err) {
      console.error("Text search error:", err);
      return rejectWithValue(err.response?.data || "Text search failed");
    }
  }
);

const imageSearchSlice = createSlice({
  name: "imageSearch",
  initialState: loadStateFromStorage(), 
  reducers: {
    clearImageResults(state) {
      state.products = [];
      state.error = null;
      state.searchMetadata = null;
      sessionStorage.removeItem('imageSearchState');
    },
  },
  extraReducers: (builder) => {
    for (const thunk of [searchByImage, searchByText]) {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload.products;
          state.searchMetadata = action.payload.metadata;
          saveStateToStorage(state);
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  },
});

export const { clearImageResults } = imageSearchSlice.actions;
export default imageSearchSlice.reducer;