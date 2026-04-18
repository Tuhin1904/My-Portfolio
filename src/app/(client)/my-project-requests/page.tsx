'use client'
import { apiRequest } from '@/apiFiles/apiClient'
import { apiEndpoints } from '@/apiFiles/apiEndpoints'
import React, { useEffect } from 'react'

const page = () => {
    const getMyProjects = async () => {
        try {
            const res = await apiRequest({
                method: "GET",
                url: apiEndpoints.getMyQueries
            })
            console.log("My projects are :", res)
        } catch (err) {
            console.log("Error is :", err)
        }
    }

    useEffect(() => {
        getMyProjects();
    }, [])
    return (
        <div>page</div>
    )
}

export default page