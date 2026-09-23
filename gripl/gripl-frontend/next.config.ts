import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        proxyTimeout: 1_800_000, // 30 min
    },
    webpack(config, { isServer }) {
        config.module.rules.push({
            test: /\.bpmn$/,
            use: 'raw-loader'
        });

        // Prevent pdfjs-dist from trying to load the native canvas module
        config.resolve.alias.canvas = false;

        return config;
    },
    async rewrites() {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
        const ragBase = process.env.RAG_INTERNAL_URL ?? "http://gripl-rag:8081";
        // Log the rewrites for debugging purposes
        console.log("Rewrites:");
        console.log(`API Base URL: ${apiBase}`);
        console.log(`RAG Base URL: ${ragBase}`);
        return [
            {
                source: '/api/:path*',
                destination: `${apiBase}/:path*`,
            },
            {
                source: '/rag/:path*',
                destination: `${ragBase}/:path*`,
            }
        ];
    },
    reactStrictMode: false
};

export default nextConfig;
