import { createAction, createReducer } from '@reduxjs/toolkit'
import {Guest} from "@/types/guest";

interface AppState {
    loggedInGuest?: Guest;
    guests: Guest[];
}

export const setLoggedInGuest = createAction<{ loggedInGuest: Guest }>('app/setLoggedInGuest');
export const setGuests = createAction<{ guests: Guest[]}>('app/setGuests');

const initialState = { loggedInGuest: null, guests: [] } as AppState;

export const appReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setLoggedInGuest, (state, action) => {
            state.loggedInGuest = action.payload.loggedInGuest
        })
        .addCase(setGuests, (state, action) => {
            state.guests = action.payload.guests
        })
})