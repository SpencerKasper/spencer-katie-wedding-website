import { createAction, createReducer } from '@reduxjs/toolkit'
import {Guest} from "@/types/guest";
import {Table} from "@/types/table";

interface AppState {
    loggedInGuest?: Guest;
    guests: Guest[];
    tables: Table[];
}

export const setLoggedInGuest = createAction<{ loggedInGuest: Guest }>('app/setLoggedInGuest');
export const setGuests = createAction<{ guests: Guest[]}>('app/setGuests');
export const setTables = createAction<{ tables: Table[]}>('app/setTables');

const initialState = { loggedInGuest: null, guests: [], tables: [] } as AppState;

export const appReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setLoggedInGuest, (state, action) => {
            state.loggedInGuest = action.payload.loggedInGuest
        })
        .addCase(setGuests, (state, action) => {
            state.guests = action.payload.guests
        })
        .addCase(setTables, (state, action) => {
            state.tables = action.payload.tables
        })
})