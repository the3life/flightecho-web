import {defineConfig, loadEnv} from "vite";

export default ({mode}) => {
    const env = loadEnv(mode, process.cwd());

    return defineConfig({
        base: `/${env.VITE_BASE_URL}/`,
    });
};

/*export default defineConfig({
    //base: "/flightecho-web/"
    base: `/${loadEnv().BASE_URL}/`
});*/