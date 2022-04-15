import * as PIXI from "pixi.js";
import { IPointData } from "pixi.js";

import starCloud from "../images/starcloud.png";
import { makeColor, randomNumber } from "../lib/helpers";
import { IParticle } from "./IParticle";
import { IStarFieldParameters } from "./IStarFieldParameters";
import { LineRenderer } from "./lineRenderer";
import { spawnStars } from "./starSpawner";

export class StarField {
    private particleContainer = new PIXI.ParticleContainer(10000, {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true,
        tint: true
    });

    private stars: IParticle[] = [];
    private lastPosition = new PIXI.Point(0, 0);
    private starTexture = PIXI.Texture.from(starCloud);
    private lineRenderer: LineRenderer | null = null;
    private parallaxSpeedMultiplier = 0.7;

    constructor(private app: PIXI.Application, options?: IStarFieldParameters) {
        this.particleContainer.blendMode = PIXI.BLEND_MODES.ADD;
        app.stage.addChild(this.particleContainer);
        const width = app.screen.width;
        const height = app.screen.height;
        const spawnBounds = {
            x: -width,
            y: -height,
            width: width * 2,
            height: height * 2
        };
        const defaultOptions = {
            count: 50,
            minScale: 0.1,
            maxScale: 1.3,
            minEdges: 1,
            maxEdges: 2,
            maxDepth: 6,
            ...options
        };
        const { rootStars, stars } = spawnStars(
            spawnBounds,
            defaultOptions.count,
            defaultOptions.minScale,
            defaultOptions.maxScale,
            defaultOptions.minEdges,
            defaultOptions.maxEdges,
            defaultOptions.maxDepth
        );

        console.log(
            `rootStars: ${rootStars.length} totalStars: ${stars.length}`
        );

        for (const star of stars) {
            star.sprite = new PIXI.Sprite(this.starTexture);
            star.sprite.zIndex = star.scale;
            star.sprite.anchor.set(0.5);
            star.sprite.tint = makeColor(
                randomNumber(0.9, 1),
                randomNumber(0.7, 0.9),
                randomNumber(0.4, 0.7)
            );
            star.sprite.scale.x = star.scale;
            star.sprite.scale.y = star.scale;
            const offset = this.getMouseOffsetPosition(star.scale);
            star.sprite.x = star.position.x + offset.x;
            star.sprite.y = star.position.y + offset.y;

            this.stars.push(star);
            this.particleContainer.addChild(star.sprite);
        }

        this.particleContainer.sortableChildren = true;
        this.particleContainer.sortChildren();
        app.ticker.add(this.update);
        this.lineRenderer = new LineRenderer(app, rootStars);
    }

    public destroy(): void {
        this.app.ticker.remove(this.update);
        this.starTexture.destroy();
        this.app.stage.removeChild(this.particleContainer);
        this.particleContainer.destroy({
            children: true,
            texture: true,
            baseTexture: true
        });
        this.lineRenderer?.destroy();
    }

    private getMouseOffsetPosition = (speedMultiplier: number) => {
        const mousePos: IPointData =
            this.app.renderer.plugins.interaction.mouse.global;

        if (this.lastPosition.x === 0 && this.lastPosition.y === 0) {
            this.lastPosition = new PIXI.Point(mousePos.x, mousePos.y);
        }

        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;

        const vec = {
            x:
                (mousePos.x - screenWidth / 2) / (screenWidth / 2) +
                Math.sin(this.spinner * Math.PI) * Math.cos(this.spinner * 25),
            y:
                (mousePos.y - screenHeight / 2) / (screenHeight / 2) +
                Math.sin(3 * this.spinner * Math.PI) * Math.cos(this.spinner * 25)
        };
        const finalOffset = {
            x:
                ((-vec.x * screenWidth) / 2) *
                speedMultiplier *
                this.parallaxSpeedMultiplier,
            y:
                ((-vec.y * screenHeight) / 2) *
                speedMultiplier *
                this.parallaxSpeedMultiplier
        };

        return finalOffset;
    };

    private spinner = 0;
    private update = () => {
        const dt = this.app.ticker.elapsedMS / 1000;
        this.spinner += (Math.PI / 512) * dt;
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            star.direction += star.directionSpeed * dt;
            if (star.sprite) {
                star.sprite.rotation = star.direction;
                const offset = this.getMouseOffsetPosition(star.scale);
                star.sprite.x = star.position.x + offset.x;
                star.sprite.y = star.position.y + offset.y;
            }
        }
    };
}
