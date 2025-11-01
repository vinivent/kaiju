import React from "react";

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="min-h-screen flex flex-col md:flex-row bg-background antialiased bg-grid-white/[0.02] relative overflow-hidden">
                <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
