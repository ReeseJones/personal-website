import * as PIXI from "pixi.js";

import starCloud from "../images/starcloud.png";
import { clamp, makeColor, randomNumber } from "../lib/helpers";
import { IParticle } from "./IParticle";
import { IStarFieldParameters } from "./IStarFieldParameters";
import { LineRenderer } from "./lineRenderer";
import { spawnStars } from "./starSpawner";

const parallaxSpeedMultiplier = 2;

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

    private square = new PIXI.Graphics();

    private lineRenderer: LineRenderer | null = null;

    constructor(private app: PIXI.Application, options?: IStarFieldParameters) {
        this.particleContainer.blendMode = PIXI.BLEND_MODES.ADD;
        app.stage.addChild(this.particleContainer);
        const width = app.screen.width;
        const height = app.screen.height;
        const spawnBounds = {
            x: -width / 2,
            y: -height / 2,
            width: width * 1.5,
            height: height * 1.5
        };
        options = {
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
            options.count,
            options.minScale,
            options.maxScale,
            options.minEdges,
            options.maxEdges,
            options.maxDepth
        );

        console.log(
            `rootStars: ${rootStars.length} totalStars: ${stars.length}`
        );

        for (const star of stars) {
            star.sprite = new PIXI.Sprite(this.starTexture);
            star.sprite.zIndex = star.scale;
            star.sprite.anchor.set(0.5);
            star.sprite.x = star.position.x;
            star.sprite.y = star.position.y;
            star.sprite.tint = makeColor(
                randomNumber(0.9, 1),
                randomNumber(0.7, 0.9),
                randomNumber(0.4, 0.7)
            );
            star.sprite.scale.x = star.scale;
            star.sprite.scale.y = star.scale;

            this.stars.push(star);
            this.particleContainer.addChild(star.sprite);
        }

        this.particleContainer.sortableChildren = true;
        this.particleContainer.sortChildren();
        app.ticker.add(this.update);
        app.renderer.plugins.interaction.on(
            "pointermove",
            this.pointerMoveHandler
        );
        this.lineRenderer = new LineRenderer(app, rootStars);

        this.square.beginFill(0xffffff, 0);
        this.square.lineStyle(3, 0xff0000, 1);
        this.square.drawRect(0, 0, app.screen.width, app.screen.height);
        this.square.endFill();
        this.square.beginFill(0x00ff00, 0);
        this.square.lineStyle(3, 0x00ff00, 1);
        this.square.drawRect(-5, -5, 10, 10);
        this.square.endFill();
        this.square.beginFill(0x0000ff, 0);
        this.square.lineStyle(3, 0x0000ff, 1);
        this.square.drawRect(
            -5 + app.screen.width,
            -5 + app.screen.height,
            10,
            10
        );
        this.square.endFill();
        //this.app.stage.addChild(this.square);
    }

    public destroy(): void {
        this.app.renderer.plugins.interaction.removeListener(
            "pointermove",
            this.pointerMoveHandler
        );
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

    private update = (dtMs: number) => {
        const dt = dtMs / 1000;
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            star.direction += star.directionSpeed * dt;
            if (star.sprite) {
                star.sprite.rotation = star.direction;
            }
        }
    };

    private pointerMoveHandler = (event: PIXI.InteractionEvent) => {
        const mousePos = event.data.global;

        if (this.lastPosition.x === 0 && this.lastPosition.y === 0) {
            this.lastPosition = new PIXI.Point(mousePos.x, mousePos.y);
        }

        const vec = {
            x:
                (mousePos.x - this.app.screen.width / 2) /
                (this.app.screen.width / 2),
            y:
                (mousePos.y - this.app.screen.height / 2) /
                (this.app.screen.height / 2)
        };

        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            if (star.sprite) {
                star.sprite.x =
                    ((-vec.x * 0.3 * this.app.screen.width) / 2) *
                        star.scale *
                        parallaxSpeedMultiplier +
                    star.position.x;
                star.sprite.y =
                    ((-vec.y * 0.3 * this.app.screen.width) / 2) *
                        star.scale *
                        parallaxSpeedMultiplier +
                    star.position.y;
            }
        }

        this.square.position.x =
            -vec.x * this.app.screen.width * parallaxSpeedMultiplier;
        this.square.position.y =
            -vec.y * this.app.screen.height * parallaxSpeedMultiplier;
    };
}
