import * as PIXI from "pixi.js";
import { useEffect } from "react";
import { StarField } from "../starField/starFieldApp";

export const usePixiStarBackground = (
    pixiApp: PIXI.Application | null,
    viewMounted: boolean,
    maxDepth: number,
    maxEdges: number,
    minEdges: number,
    rootStars: number
) => {
    useEffect(() => {
        let starField: StarField | null = null;
        if (viewMounted && pixiApp) {
            starField = new StarField(pixiApp, {
                maxDepth,
                maxEdges,
                minEdges,
                count: rootStars
            });
        }

        return () => {
            if (starField) {
                starField.destroy();
            }
        };
    }, [pixiApp, viewMounted, maxDepth, maxEdges, minEdges, rootStars]);
};
