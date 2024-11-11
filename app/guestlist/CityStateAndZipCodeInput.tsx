'use client';
import {InputLabel, NumberInput, TextInput} from "@mantine/core";
import axios, {AxiosRequestConfig} from "axios";
import {useEffect, useState} from "react";

const CityStateAndZipCodeInput = ({form, zipCode, setZipCode}) => {
    const [cities, setCities] = useState([]);
    useEffect(() => {
        if (zipCode && zipCode.toString().length === 5) {
            const apiKey: string = process.env.NEXT_PUBLIC_WEDDING_ZIPCODE_API_KEY;
            // @ts-ignore
            const config: AxiosRequestConfig = {headers: {'X-Api-Key': apiKey}};
            axios.get(`https://api.api-ninjas.com/v1/zipcode?zip=${zipCode}`, config)
                .then(response => {
                    setCities(response.data);
                    const city = response.data[0]
                    form.setValues((prev) => ({...prev, zipCode, city: city.city, state: city.state}));
                });
        } else {
            setCities([]);
        }
    }, [zipCode]);
    return (
        <div>
            <TextInput
                value={zipCode}
                // @ts-ignore
                onChange={(event) => setZipCode(event.currentTarget.value)}
                label={'Zip Code'}
            />
            {cities.length ?
                <div className={'flex flex-col pt-8'}>
                    <InputLabel>City and State</InputLabel>
                    {cities.map(city => <p key={city.city}>{city.city}, {city.state}</p>)}
                </div> :
                <></>
            }
        </div>
    )
}

export default CityStateAndZipCodeInput;