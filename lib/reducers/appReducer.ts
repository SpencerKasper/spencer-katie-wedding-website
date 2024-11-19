import { createAction, createReducer } from '@reduxjs/toolkit'
import {Guest} from "@/types/guest";

interface AppState {
    loggedInGuest: Guest
}

export const setLoggedInGuest = createAction<{ loggedInGuest: Guest }>('app/setLoggedInGuest');

const initialState = { loggedInGuest: null } as AppState

export const appReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setLoggedInGuest, (state, action) => {
            state.loggedInGuest = action.payload.loggedInGuest
        })
})