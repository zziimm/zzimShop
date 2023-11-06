import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/product/productslice";
import cartSlice from "../features/cart/cartSlice";

// 전역 state를 보관하는 리덕스 저장소 만들기
export const store = configureStore({
  // 전역 스토어에 리듀서 함수들을 등록
  reducer: {
    product: productReducer,
    cart: cartSlice,
  }
});