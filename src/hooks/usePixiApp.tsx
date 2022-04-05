import * as React from "react";
import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";

export const usePixiApp = () => {
    const [ appContainer, setAppContainer ] = useState<HTMLElement | null>(null);

    const pixiApp = useRef(new PIXI.Application({
        width: 640,
        height: 360,
        resolution: window.devicePixelRatio || 1,
        backgroundColor: 0x1099bb
    }));

    useEffect(() => {
        pixiApp.current.view.classList.add("hero-effect");
    },
    []);

    useEffect(() => {
        if (appContainer !== null) {
            pixiApp.current.resizeTo = appContainer;
            appContainer.appendChild(pixiApp.current.view);
            setTimeout(() => pixiApp.current.resize(), 1);
        }

        return () => {
            appContainer?.removeChild(pixiApp.current.view);
        };
    }, [ appContainer ]);


    const containerMounting = React.useCallback((node: HTMLDivElement) => {
        if (node) {
            setAppContainer(node);
        }
    }, []);

    return [ containerMounting, pixiApp.current ] as const;
}