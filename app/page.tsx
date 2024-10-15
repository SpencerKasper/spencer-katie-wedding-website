import LoginPageClient from "@/app/loginPageClient";

export default async function Home() {
    // const guestList = (await axios.get(`${process.env.WEDDING_API_URL}/api/guestlist`)).data;
    return (
        <LoginPageClient />
    );
}
