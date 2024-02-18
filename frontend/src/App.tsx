import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Suspense, useState } from "react";

import Room from "./pages/Room";
import Landing from "./pages/Landing";

function App() {
    return (
        <>
            <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/room/:name" element={<Room />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
}

export default App;
