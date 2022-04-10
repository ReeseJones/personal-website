import * as PIXI from "pixi.js";

import starCloud from "../images/starcloud.png";

const starCount = 1000;
const parallaxSpeedMultiplier = 2;

export function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
}

export function randomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
} 

export function randomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 

export function randomColor() {
    let colorIndex = [0, 1 , 2];
    const fullIndex = randomInt(0, 2);
    const secondIndex = Math.round(Math.random());

    const fullSaturationIndex = colorIndex[fullIndex];
    colorIndex.splice(fullIndex, 1);
    const midSaturationIndex = (secondIndex ? colorIndex.pop() : colorIndex.shift()) as number;

    let finalColor = 0;
    finalColor = finalColor | 0xFF << (fullSaturationIndex * 8);
    finalColor = finalColor | randomInt(0x40, 0xFF) << (midSaturationIndex * 8);

    return finalColor;

}

function makeColor(r: number, g: number, b: number) {
    return (r * 0xFF << 16) | (g * 0xFF << 8) | (b * 0xFF);
}



export interface IParticle {
    sprite: PIXI.Sprite;
    direction: number;
    directionSpeed: number;
    speed: number;
    depthFactor: number;
}

export class StarField {
    private particleContainer = new PIXI.ParticleContainer(starCount, {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true,
        tint: true,
    });

    private stars: IParticle[] = [];

    private lastPosition = new PIXI.Point(0, 0);

    constructor(app: PIXI.Application) {
        this.particleContainer.blendMode = PIXI.BLEND_MODES.ADD;
        app.stage.addChild(this.particleContainer);

        const starTexture = PIXI.Texture.from(starCloud);

        for (let i = 0; i < starCount; ++i) {
            const star: IParticle = {
                sprite: new PIXI.Sprite(starTexture),
                direction: randomNumber(0, 2 * Math.PI),
                directionSpeed:  randomNumber(-Math.PI, Math.PI),
                speed: 100 + 100 * Math.random(),
                depthFactor: randomNumber(0.1, 1.5) * (Math.pow(Math.random(), 10))
            }
            star.sprite.zIndex = star.depthFactor;
            star.sprite.anchor.set(0.5);
            star.sprite.x = Math.random() * app.screen.width;
            star.sprite.y = Math.random() * app.screen.height;
            star.sprite.tint = makeColor(randomNumber(0.9, 1), randomNumber(0.7, 0.9), randomNumber(0.4, 0.7));
            star.sprite.scale.x = clamp(star.depthFactor, 0.01, 1);
            star.sprite.scale.y = star.sprite.scale.x;

            this.stars.push(star);
            this.particleContainer.addChild(star.sprite);
        }

        const starBoundsPadding = 100;
        const starBounds = new PIXI.Rectangle(
            -starBoundsPadding,
            -starBoundsPadding,
            app.screen.width + starBoundsPadding * 2,
            app.screen.height + starBoundsPadding * 2,
        );

        this.particleContainer.sortableChildren = true;
        this.particleContainer.sortChildren();

        app.ticker.add((dtMs) => {
            const dt = dtMs / 1000;
            for (let i = 0; i < starCount; i++) {
                const star = this.stars[i];

                star.direction += star.directionSpeed * dt;
                //star.sprite.x += Math.cos(star.direction) * star.speed * dt;
                //star.sprite.y += Math.sin(star.direction) * star.speed * dt;
                star.sprite.rotation = star.direction;
            }
        });

        app.renderer.plugins.interaction.on("pointermove", (event: PIXI.InteractionEvent) => {
            const mousePos = event.data.global;
            const xDiff = mousePos.x - this.lastPosition.x;
            const yDiff = mousePos.y - this.lastPosition.y;
            this.lastPosition = new PIXI.Point(mousePos.x, mousePos.y);

            for (let i = 0; i < starCount; i++) {
                const star = this.stars[i];

                star.sprite.x -= xDiff * star.depthFactor * parallaxSpeedMultiplier;
                star.sprite.y -= yDiff * star.depthFactor * parallaxSpeedMultiplier;
        
                if (star.sprite.x < starBounds.x) {
                    star.sprite.x += starBounds.width;
                } else if (star.sprite.x > starBounds.x + starBounds.width) {
                    star.sprite.x -= starBounds.width;
                }
        
                if (star.sprite.y < starBounds.y) {
                    star.sprite.y += starBounds.height;
                } else if (star.sprite.y > starBounds.y + starBounds.height) {
                    star.sprite.y -= starBounds.height;
                }
            }

        });
    }
}