import * as React from "react";
import "../styles.scss"; // <--- includes reset and must be first
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { usePixiApp } from "../hooks/usePixiApp";
import { usePixiStarBackground } from "../hooks/usePixiStarBackground";

export const Layout: React.FC<React.ReactNode> = (props) => {
    const [rootStarCount, setRootStarCount] = React.useState(100);
    const [starDepth, setStarDepth] = React.useState(7);
    const [maxEdges, setMaxEdges] = React.useState(3);
    const [minEdges, setMinEdges] = React.useState(1);
    const [containerRef, pixiApp, viewMounted] = usePixiApp();

    usePixiStarBackground(
        pixiApp.current,
        starDepth,
        maxEdges,
        minEdges,
        rootStarCount
    );

    return (
        <>
            <div className="anim-background" ref={containerRef}>
                <Header />
                <div className="scroll-region">
                    <div className="content">{props.children}</div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default Layout;
