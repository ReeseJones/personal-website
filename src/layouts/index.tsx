import * as React from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import "../styles.scss";
import { usePixiApp } from "../hooks/usePixiApp";
import { usePixiStarBackground } from "../hooks/usePixiStarBackground";

export const Layout: React.FC<React.ReactNode> = (props) => {
    const [rootStarCount, setRootStarCount] = React.useState(90);
    const [containerRef, pixiApp, viewMounted] = usePixiApp();
    usePixiStarBackground(pixiApp.current, viewMounted, 7, 1, 1, rootStarCount);

    return (
        <>
            <div
                className="anim-background"
                ref={containerRef}
                onClick={() => {
                    setRootStarCount(rootStarCount + -10 + Math.random() * 20);
                }}
            >
                <Header />
                {props.children}
                <Footer />
            </div>
        </>
    );
};

export default Layout;
