import React, { useState } from 'react'

export default function Index() {
    const [counter, setCounter] = useState(0)

    const onClick = () => {
        setCounter((prev) => prev + 1)
    }

    return (
        <div>
            <h1>I'm a React component 2222</h1>
            <p>{counter}</p>
            <button onClick={onClick}>+1</button>
        </div>
    )
}
