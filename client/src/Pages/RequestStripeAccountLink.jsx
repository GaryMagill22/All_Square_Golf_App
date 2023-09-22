import React, { useEffect } from "react";
import { Axios } from "../helpers/axiosHelper";

export default function RequestStripeLink() {
    useEffect(() => {
        const requestNewLink = async () => {
            const response = await Axios({
                url: '/wallet/new-link',
                method: 'get',
            });

            if (response.status === 200) {
                window.location.href = response.data.url;
            }
        }

        requestNewLink();
    }, []);

    return (
        <div>
            <h3>Loading...</h3>
        </div>
    )
}