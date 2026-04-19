import React from 'react'

const ButtonSpinner = ({ text = "Warming up the servers..." }: { text?: string }) => {
    return (
        <>
            <span className="w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></span>
            {text}
        </>
    )
}

export default ButtonSpinner