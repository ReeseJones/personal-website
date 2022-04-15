import { IParticle } from "./IParticle";
import { clamp, lerp, randomInt, randomNumber } from "../lib/helpers";

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
        directionSpeed: randomNumber(-Math.PI / 8, Math.PI / 8),
        depth,
        scale: randomNumber(minScale, maxScale),
        neighbors: [],
        arcAngle: (Math.random() > 0.5 ? 1 : -1) * randomNumber(0.8, 2),
        arcLength: randomNumber(60, 100),
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
    const rootStarCount = count;
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

    while (currentStarCount < 10000 && starQueue.length) {
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
            setStarPosition(currentStar, childStar, i);
            currentStar.neighbors.push(childStar);
            starQueue.push(childStar);
            stars.push(childStar);
            currentStarCount += 1;
        }
    }

    return { rootStars, stars };
}

export function setStarPosition(
    parent: IParticle,
    child: IParticle,
    childIndex: number
) {
    child.parent = parent;
    child.arcAngle = parent.arcAngle;
    child.arcLength = parent.arcLength;

    const angle = parent.arcAngle * (childIndex + 1) * child.depth;
    const dist = parent.arcLength;

    child.position.x = parent.position.x + Math.cos(angle) * dist;
    child.position.y = parent.position.y + Math.sin(angle) * dist;
}
