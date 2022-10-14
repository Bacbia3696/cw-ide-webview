import { configureStore } from "@reduxjs/toolkit";
import contractReducer from "src/stores/contract/slice";

const store = configureStore({
  reducer: {
    contract: contractReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
