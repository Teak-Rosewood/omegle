import { useState } from "react";

const Landing = () => {
    const [name, setName] = useState("");
    return (
        <>
            <input type="text" placeholder="Name" onChange={(event) => setName(event.target.value)}></input>
            <div>
                <button
                    onClick={() => {
                        //create room and join  a room
                    }}
                >
                    Join Room
                </button>
            </div>
        </>
    );
};
export default Landing;
