'use client'

import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {
    const { id } = useParams();

    const getQuery = async () => {
        const res = await apiRequest({
            method: "GET",
            url: `${apiEndpoints.getMyQueries}/${id}`
        })
        console.log("My query : ", res)
    }

    useEffect(() => {
        if (id) {
            getQuery();
        }
    }, [id])

    return (
        <div>page</div>
    )
}

export default page