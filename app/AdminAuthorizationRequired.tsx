'use client';
import {useEffect, useState} from "react";
import {PasswordInput, Button, Loader} from "@mantine/core";
import {validateAdminAuthorizationRequest} from "@/app/actions";

const AdminAuthorizationRequired = ({children}) => {
    const [isAuthorizing, setIsAuthorizing] = useState(true);
    const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
    const [password, setPassword] = useState('');
    const validatePassword = async (pw = password) => {
        const response = await validateAdminAuthorizationRequest(pw);
        setIsAdminAuthorized(response);
        return response;
    };

    useEffect(() => {
        setIsAuthorizing(true);
        const storedPassword = localStorage.getItem('WEDDING_ADMIN_PASSWORD');
        validatePassword(storedPassword)
            .then(() => setIsAuthorizing(false));
    }, []);
    return isAdminAuthorized && !isAuthorizing ?
        children :
        isAuthorizing ?
            <div className={'flex flex-col justify-center items-center p-4 md:p-16'}>
                <p className={'text-white text-4xl'}>We are checking if you have access!</p>
                <p className={'text-white text-2xl'}>This page requires authorization to access.</p>
                <Loader type={'dots'} color={'white'}/>
            </div> :
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
                            setIsAuthorizing(true);
                            validatePassword()
                                .then((isValid) => {
                                    if (isValid) {
                                        localStorage.setItem('WEDDING_ADMIN_PASSWORD', password);
                                    }
                                    setIsAuthorizing(false);
                                })
                        }}>Submit</Button>
                </div>
            </div>;
};

export default AdminAuthorizationRequired;