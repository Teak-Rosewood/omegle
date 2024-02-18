import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("user-1");
    return (
        <>
            <input type="text" placeholder="Name" defaultValue="user-1" onChange={(event) => setName(event.target.value)}></input>
            <div>
                <button
                    onClick={() => {
                        navigate("/room/" + name);
                    }}
                >
                    Join Room
                </button>
            </div>
        </>
    );
};
export default Landing;
