import {defineConfig, loadEnv} from "vite";
import tailwindcss from "@tailwindcss/vite";

//http://localhost:5173/FlightEcho-Development/#/admin?app=Web&edition=Standard&version=4.0.0-beta.5&locale=tr&dark_mode=true

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd());

    return {
        base: `/${env.VITE_BASE_URL}/`,
        plugins: [
            tailwindcss()
        ]
    };
});