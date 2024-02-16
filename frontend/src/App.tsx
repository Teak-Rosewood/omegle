import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Suspense, lazy } from "react";

const Landing = lazy(() => import("./pages/Landing"));
const Room = lazy(() => import("./pages/Room"));

function App() {
    return (
        <>
            <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/room" element={<Room />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
}

export default App;
