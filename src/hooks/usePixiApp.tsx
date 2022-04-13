import * as React from "react";
import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { StarField } from "../starField/starFieldApp";

export const usePixiApp = () => {
    const [appContainer, setAppContainer] = useState<HTMLElement | null>(null);

    const pixiApp = useRef<PIXI.Application | null>(null);

    useEffect(() => {
        console.log("Creating new pixi app");
        pixiApp.current = new PIXI.Application({
            resolution: window.devicePixelRatio || 1,
            backgroundColor: 0
        });
        pixiApp.current.view.classList.add("hero-effect");

        //creating starField ont pixi app
        setTimeout(() => {
            const starField = new StarField(pixiApp.current as PIXI.Application);
        }, 1000);

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

        return () => {
            if (pixiApp.current && appContainer) {
                console.log("removed pixi view");
                appContainer.removeChild(pixiApp.current.view);
            }
        };
    }, [appContainer]);

    const containerMounting = React.useCallback((node: HTMLDivElement) => {
        if (node) {
            setAppContainer(node);
        }
    }, []);

    return [containerMounting, pixiApp] as const;
};
