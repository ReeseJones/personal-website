import { IParticle } from "./IParticle";
import {
    clamp,
    lerp,
    makeColor,
    randomInt,
    randomNumber
} from "../lib/helpers";

export interface IPoint {
    x: number;
    y: number;
}

export interface IBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function createStar(
    position: IPoint,
    depth: number,
    minScale: number,
    maxScale: number
): IParticle {
    return {
        sprite: null,
        position,
        direction: randomNumber(0, 2 * Math.PI),
        directionSpeed: randomNumber(-Math.PI, Math.PI),
        depth,
        scale: randomNumber(minScale, maxScale),
        neighbors: [],
        arcAngle: randomNumber(-Math.PI / 3, Math.PI / 3),
        arcLength: randomNumber(10, 50),
        parent: null
    };
}

export function createStarHelper(
    depth: number,
    maxDepth: number,
    bounds: IBounds,
    minScale: number,
    maxScale: number
) {
    const depthProgress = depth / maxDepth;
    const newPos = {
        x: randomNumber(bounds.x, bounds.width),
        y: randomNumber(bounds.y, bounds.height)
    };
    const starMaxScale = lerp(maxScale, minScale, depthProgress);
    const starMinScale = clamp(starMaxScale - 0.2, minScale, maxScale);
    return createStar(newPos, depth, starMinScale, starMaxScale);
}

export function spawnStars(
    bounds: IBounds,
    count: number,
    minScale: number,
    maxScale: number,
    minEdges: number,
    maxEdges: number,
    maxDepth: number
) {
    const rootStars: IParticle[] = [];
    const starQueue: IParticle[] = [];
    const stars: IParticle[] = [];
    const rootStarCount = Math.pow(count, 1 / maxDepth);
    let currentStarCount = 0;

    //spawn root stars
    for (let i = 0; i < rootStarCount; i += 1) {
        const newStar = createStarHelper(
            0,
            maxDepth,
            bounds,
            minScale,
            maxScale
        );
        rootStars.push(newStar);
        stars.push(newStar);
        starQueue.push(newStar);
        currentStarCount += 1;
    }

    while (currentStarCount < count && starQueue.length) {
        const currentStar = starQueue.pop();
        if (!currentStar || currentStar.depth === maxDepth) continue;

        const childrenCount = randomInt(minEdges, maxEdges);

        for (let i = 0; i < childrenCount; i += 1) {
            const childStar = createStarHelper(
                currentStar.depth + 1,
                maxDepth,
                bounds,
                minScale,
                maxScale
            );
            setStarPosition(currentStar, childStar);
            currentStar.neighbors.push(childStar);
            starQueue.push(childStar);
            stars.push(childStar);
            currentStarCount += 1;
        }
    }

    return { rootStars, stars };
}

export function setStarPosition(parent: IParticle, child: IParticle) {
    child.parent = parent;
    child.arcAngle = parent.arcAngle;
    child.arcLength = parent.arcLength;

    const angle = parent.arcAngle * child.depth;
    const dist = parent.arcLength;

    child.position.x = parent.position.x + Math.cos(angle) * dist;
    child.position.y = parent.position.y + Math.sin(angle) * dist;
}
