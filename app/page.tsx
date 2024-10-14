import LoginPageClient from "@/app/loginPageClient";
import axios from "axios";
import {EncryptStorage} from "encrypt-storage";
import {encrypt} from "@/utils/encryption";
import {useState} from "react";

export default async function Home() {
    // const guestList = (await axios.get(`${process.env.WEDDING_API_URL}/api/guestlist`)).data;
    return (
        <LoginPageClient />
    );
}
