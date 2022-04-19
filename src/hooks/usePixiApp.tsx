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
            pixiApp.current.resizeTo = window;
            appContainer.appendChild(pixiApp.current.view);
            setTimeout(() => pixiApp.current?.resize(), 1);
        }

        return () => {
            if (pixiApp.current && appContainer) {
                console.log("removed pixi view");
                appContainer.removeChild(pixiApp.current.view);
                setViewMounted(false);
                pixiApp.current.resizeTo = undefined as any;
            }
        };
    }, [appContainer]);

    useEffect(() => {
        const resizeChecker = setInterval(() => {
            const resizeTarget = pixiApp.current?.resizeTo;
            const view = pixiApp.current?.view;
            if (resizeTarget && view) {
                if (
                    window.innerWidth === view.offsetWidth &&
                    window.innerHeight === view.offsetHeight
                ) {
                    if (!viewMounted) {
                        console.log("Mounted the view");
                        setViewMounted(true);
                    }
                } else {
                    if (viewMounted) {
                        console.log("View Unmounted");
                        setViewMounted(false);
                    }
                }
            }
        }, 100);

        return () => {
            clearInterval(resizeChecker);
        };
    }, [viewMounted]);

    const containerMounting = React.useCallback((node: HTMLDivElement) => {
        if (node) {
            setAppContainer(node);
        }
    }, []);

    return [containerMounting, pixiApp, viewMounted] as const;
};
