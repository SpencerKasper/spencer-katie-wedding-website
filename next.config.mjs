/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'spencer-katie-wedding-website.s3.amazonaws.com',
            }
        ]
    },
    reactStrictMode: false
};

export default nextConfig;
