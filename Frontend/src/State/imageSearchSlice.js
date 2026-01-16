import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
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
    builder
      .addCase(searchByImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchByImage.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.searchMetadata = action.payload.metadata;
        saveStateToStorage(state); 
      })
      .addCase(searchByImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearImageResults } = imageSearchSlice.actions;
export default imageSearchSlice.reducer;