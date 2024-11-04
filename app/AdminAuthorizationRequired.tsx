'use client';
import {useEffect, useState} from "react";
import {PasswordInput, Button} from "@mantine/core";
import {validateAdminAuthorizationRequest} from "@/app/actions";

const AdminAuthorizationRequired = ({children}) => {
    const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
    const [password, setPassword] = useState('');
    return isAdminAuthorized ?
        children :
        <div className={'flex flex-col justify-center items-center p-4 m:p-16 text-white'}>
            <div className={'w-1/2'}>
                <PasswordInput label={'Password'} value={password} onChange={(event) => setPassword(event.currentTarget.value)}/>
                <Button onClick={async () => {
                    const response = await validateAdminAuthorizationRequest(password);
                    setIsAdminAuthorized(response);
                }}>Submit</Button>
            </div>
        </div>;
};

export default AdminAuthorizationRequired;