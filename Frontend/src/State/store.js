import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { authReaducer } from "./Auth/Reducer";
import { thunk } from "redux-thunk";
import { customerProductReducer } from "./Product/Reducer";
import { cartReducer } from "./Cart/Reducer";
import { orderReducer } from "./Order/Reducer";
import { paymentReducer } from "./Payment/Reducer";
import imageSearchSlice from "./imageSearchSlice";

const rootReducer=combineReducers({
    auth:authReaducer,
    products:customerProductReducer,
    cart:cartReducer,
    order:orderReducer,
    payment:paymentReducer,
    imageSearch:imageSearchSlice
})

export const store=legacy_createStore(rootReducer,applyMiddleware(thunk));