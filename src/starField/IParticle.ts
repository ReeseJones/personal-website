import * as PIXI from "pixi.js";

export interface IParticle {
    sprite: PIXI.Sprite | null;
    position: PIXI.IPointData;
    direction: number;
    directionSpeed: number;
    depth: number;
    scale: number;
    neighbors: IParticle[];
}
