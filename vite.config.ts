import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'
import path from "path"
import { defineConfig } from 'vite'
import type { Connect, Plugin, PreviewServer, ViteDevServer } from "vite"
import { fetchCountyBusinessesServer } from "./server/googlePlaces"

function createBusinessApiMiddleware(): Connect.NextHandleFunction {
    return async (req, res, next) => {
        if (!req.url?.startsWith("/api/businesses")) {
            return next();
        }

        if (req.method !== "GET") {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
        }

        const requestUrl = new URL(req.url, "http://localhost");
        const countyName = requestUrl.searchParams.get("countyName");
        const stateId = requestUrl.searchParams.get("stateId");
        const businessType = requestUrl.searchParams.get("businessType");
        const radiusMeters = requestUrl.searchParams.get("radiusMeters");

        if (!countyName || !stateId || !businessType) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Missing countyName, stateId, or businessType." }));
            return;
        }

        try {
            const businesses = await fetchCountyBusinessesServer({
                countyName,
                stateId,
                businessType,
                radiusMeters: radiusMeters ? Number(radiusMeters) : undefined,
            });

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ businesses }));
        } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
                JSON.stringify({
                    error:
                        error instanceof Error
                            ? error.message
                            : "Unable to fetch businesses from Google Maps.",
                })
            );
        }
    };
}

function businessesApiPlugin(): Plugin {
    const handler = createBusinessApiMiddleware();
    return {
        name: "terratrends-businesses-api",
        configureServer(server: ViteDevServer) {
            server.middlewares.use(handler);
        },
        configurePreviewServer(server: PreviewServer) {
            server.middlewares.use(handler);
        },
    };
}

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        businessesApiPlugin(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    }
})
