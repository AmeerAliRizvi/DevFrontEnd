import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: "connection",
    initialState: [],
    reducers: {
        addConnections: (state,action)=> action.payload,
        addOneConnection: (state, action) => {
             state.push(action.payload);
        },
        removeConnection: (state, action) => {
            return state.filter((u)=> u._id !== action.payload)
        }
    }

})

export const {addConnections, removeConnection, addOneConnection} = connectionSlice.actions;
export default connectionSlice.reducer;