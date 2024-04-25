import React from 'react'
import getIntuition from '@app/api-services/IntuitionService'

const Intitution = ({ codeSnippets, id, key_, data, isResponseCode }) => {
    const content = getIntuition(id)
    return (
        <>
            {codeSnippets?.id === id && (
                <div>
                    <span className="absolute left-0 bg-lime-500 font-bold w-2 h-full text-lg rounded-l-lg text-white flex justify-center items-center">
                        .
                    </span>
                    <div className='text-sm mb-2'>
                        <h3 className='font-bold text-lg'>Hint</h3>
                        {content[0]?.desc}
                    </div>
                </div>
            )}


            {isResponseCode && codeSnippets?.id === key_ && (
                <>
                    <span className={`absolute left-0 w-2 h-full text-lg rounded-l-lg text-white flex justify-center items-center ${data ? 'bg-lime-500' : 'bg-red-500'}`}>
                        .
                    </span>
                    {data ? (
                        <p className="text-black font-semibold">
                            {content[0]?.success}
                        </p>
                    ) : (
                        <p className="text-red-500 font-semibold">
                            {content[0]?.fail}
                        </p>
                    )}
                </>
            )}
        </>
    )
}

export default Intitution