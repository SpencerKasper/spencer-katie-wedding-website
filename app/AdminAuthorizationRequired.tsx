'use client';
import {useEffect, useState} from "react";
import {PasswordInput, Button} from "@mantine/core";
import {validateAdminAuthorizationRequest} from "@/app/actions";

const AdminAuthorizationRequired = ({children}) => {
    const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
    const [password, setPassword] = useState('');
    const validatePassword = async (pw = password) => {
        const response = await validateAdminAuthorizationRequest(pw);
        setIsAdminAuthorized(response);
        return response;
    };

    useEffect(() => {
        const storedPassword = localStorage.getItem('WEDDING_ADMIN_PASSWORD');
        validatePassword(storedPassword)
            .then();
    }, []);
    return isAdminAuthorized ?
        children :
        <div className={'flex flex-col justify-center items-center p-4 m:p-16 text-white'}>
            <div className={'w-full sm:w-1/2'}>
                <PasswordInput label={'Password'} value={password}
                               onChange={(event) => setPassword(event.currentTarget.value)}/>
            </div>
            <div className={'pt-4'}>
                <Button
                    color={'white'}
                    variant={'outline'}
                    onClick={() => {
                        validatePassword()
                            .then((isValid) => {
                                if (isValid) {
                                    localStorage.setItem('WEDDING_ADMIN_PASSWORD', password);
                                }
                            })
                    }}>Submit</Button>
            </div>
        </div>;
};

export default AdminAuthorizationRequired;