/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'spencer-katie-wedding-website.s3.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'www.hilton.com',
            },
            {
                protocol: 'https',
                hostname: 'www.choicehotels.com',
            }
        ]
    },
    reactStrictMode: false
};

export default nextConfig;
