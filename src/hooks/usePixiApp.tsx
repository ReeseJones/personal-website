import * as React from "react";
import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";

export const usePixiApp = () => {
    const [appContainer, setAppContainer] = useState<HTMLElement | null>(null);
    const [viewMounted, setViewMounted] = useState(false);

    const pixiApp = useRef<PIXI.Application | null>(null);

    useEffect(() => {
        console.log("Creating new pixi app");
        pixiApp.current = new PIXI.Application({
            resolution: window.devicePixelRatio || 1,
            backgroundColor: 0
        });
        pixiApp.current.view.classList.add("hero-effect");

        return () => {
            console.log("destroying pixi app");
            pixiApp.current?.destroy(true, true);
            pixiApp.current = null;
        };
    }, []);

    useEffect(() => {
        if (appContainer !== null && pixiApp.current) {
            console.log("Added pixi view");
            pixiApp.current.resizeTo = appContainer;
            appContainer.appendChild(pixiApp.current.view);
            setTimeout(() => pixiApp.current?.resize(), 1);
        }

        const resizeChecker = setInterval(() => {
            if (pixiApp.current?.resizeTo === appContainer) {
                if (
                    appContainer.offsetWidth ===
                        pixiApp.current.view.offsetWidth &&
                    appContainer.offsetHeight ===
                        pixiApp.current.view.offsetHeight
                ) {
                    if (!viewMounted) {
                        setViewMounted(true);
                    }
                }
            }
        }, 100);

        return () => {
            if (pixiApp.current && appContainer) {
                console.log("removed pixi view");
                appContainer.removeChild(pixiApp.current.view);
                setViewMounted(false);
                clearInterval(resizeChecker);
            }
        };
    }, [appContainer]);

    const containerMounting = React.useCallback((node: HTMLDivElement) => {
        if (node) {
            setAppContainer(node);
        }
    }, []);

    return [containerMounting, pixiApp, viewMounted] as const;
};
