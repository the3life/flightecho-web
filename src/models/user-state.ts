import type {FlightMode} from "./flight-mode.ts";

export interface UserState {
    user_id: string;
    mode: FlightMode;
}