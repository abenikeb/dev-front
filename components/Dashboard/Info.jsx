import React from 'react'

const Info = ({ children }) => {
    return (
        <section className="w-full rounded-lg shadow-md pl-8 bg-lime-50 relative broder-2 border-gray-400 my-2 min-h-12 flex items-center">
            {children}
        </section>
    )
}
export default Info