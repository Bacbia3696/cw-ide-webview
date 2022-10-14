import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { JSONSchema7 } from "json-schema";
import CosmJsFactory from "src/lib/cosmjs-factory";

// Define a type for the slice state
interface ContractState {
  address: string;
  schemaFile: Object;
  codeId: number;

  // data response from blockchain
  result: any;
  error: any;
  isLoading: boolean;
}

// Define the initial state using that type
const initialState: ContractState = {
  address: "",
  schemaFile: {},
  codeId: 0,
  result: null,
  error: null,
  isLoading: false,
};

export const uploadCosmWasm = createAsyncThunk<any, any, { state: RootState }>(
  "contract/uploadCosmWasm",
  async (wasm: ArrayBuffer, { rejectWithValue }) => {
    let cosmJs = new CosmJsFactory(window.chainStore.current);
    try {
      let response = await cosmJs.current.handleUpload({
        wasmBody: wasm,
        gasAmount: { amount: 20000, denom: "nshr" },
      });
      return response;
    } catch (err: any) {
      console.log("err", err);
      console.log(err.toString());
      return rejectWithValue(err.toString());
    }
  }
);

export const contractSlice = createSlice({
  name: "contract",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    updateSchemaFile: (state, action: PayloadAction<any>) => {
      state.schemaFile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadCosmWasm.fulfilled, (state, action) => {
      state.isLoading = false;
      state.result = action.payload;
      state.error = "";
    });
    builder.addCase(uploadCosmWasm.rejected, (state, action) => {
      state.isLoading = false;
      console.log("rejected", action);
      state.error = action.payload;
      state.result = "";
    });
    builder.addCase(uploadCosmWasm.pending, (state) => {
      state.isLoading = true;
      state.error = "";
      state.result = "";
    });
  },
});

export const { updateAddress, updateSchemaFile } = contractSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAddress = (state: RootState) => state.contract.address;
export const selectSchemaFile = (state: RootState) => state.contract.schemaFile;
export const selectCodeId = (state: RootState) => state.contract.codeId;
export const selectError = (state: RootState) => state.contract.error;
export const selectResult = (state: RootState) => state.contract.result;
export const selectIsLoading = (state: RootState) => state.contract.isLoading;

export const selectExcuteSchema = (state: RootState) => {
  parseSchema(state.contract.schemaFile, "excute");
};
export const selectInitiateSchema = (state: RootState) => {
  parseSchema(state.contract.schemaFile, "initiate");
};
export const selectMigrationSchema = (state: RootState) => {
  parseSchema(state.contract.schemaFile, "migration");
};
export const selectQuerySchema = (state: RootState) => {
  parseSchema(state.contract.schemaFile, "query");
};

function parseSchema(schema: any, field: string): JSONSchema7 {
  return schema?.[field];
}

const contractReducer = contractSlice.reducer;
export default contractReducer;
