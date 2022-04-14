import * as PIXI from "pixi.js";
import { randomInt, randomNumber } from "../lib/helpers";
import lineGradient from "../images/lineGradient.png";
import { IParticle } from "./IParticle";
import { average, length, subtract } from "../lib/point-math";

export interface ILineParticle {
    sprite: PIXI.Sprite;
    lifetime: number;
    currentAge: number;
    start: IParticle;
    end: IParticle;
    parent: IParticle;
}

export function updateLineParticle(line: ILineParticle) {
    if (!line) return;
    if (!line.start || !line.end) return;
    if (!line.start.sprite || !line.end.sprite) return;

    const newPos = average(
        line.start.sprite.position,
        line.end.sprite.position
    );
    const diff = subtract(line.start.sprite.position, line.end.sprite.position);
    line.sprite.position.set(newPos.x, newPos.y);
    line.sprite.rotation = Math.atan2(diff.y, diff.x) + Math.PI;
    const distance = length(diff);
    const scale = distance / 256;
    line.sprite.scale.x = scale;
    const age = 1 - line.currentAge / line.lifetime;
    line.sprite.alpha = Math.sin(age * Math.PI);
}

const maxLifeTime = 1.5;

export class LineRenderer {
    private lineContainer = new PIXI.Container();

    private lines: ILineParticle[] = [];

    private lineCount = 40;

    private isDestroyed = false;

    constructor(private app: PIXI.Application, private stars: IParticle[]) {
        app.stage.addChild(this.lineContainer);

        const lineTexture = PIXI.Texture.from(lineGradient);

        for (let i = 0; i < this.lineCount; i += 1) {
            const startingStar =
                this.stars[randomInt(0, this.stars.length - 1)];
            const lineParticle: ILineParticle = {
                sprite: new PIXI.Sprite(lineTexture),
                lifetime: maxLifeTime,
                currentAge: randomNumber(0, maxLifeTime),
                start: startingStar,
                end: startingStar.neighbors[
                    randomInt(0, startingStar.neighbors.length - 1)
                ],
                parent: startingStar
            };
            lineParticle.sprite.anchor.set(0.5);
            lineParticle.sprite.scale.y = 0.25;
            updateLineParticle(lineParticle);

            this.lineContainer.addChild(lineParticle.sprite);
            this.lines.push(lineParticle);
        }

        app.ticker.add(this.update);
    }

    public destroy(): void {
        this.lineContainer.destroy({
            children: true,
            texture: true,
            baseTexture: true
        });
        this.app.ticker.remove(this.update);
    }

    private update = () => {
        if (this.isDestroyed) return;

        const dt = this.app.ticker.elapsedMS / 1000;
        for (const line of this.lines) {
            if (line.currentAge > line.lifetime) {
                if (line.end.neighbors.length) {
                    line.start = line.end;
                    line.end =
                        line.end.neighbors[
                            randomInt(0, line.end.neighbors.length - 1)
                        ];
                } else {
                    line.start = line.parent;
                    line.end =
                        line.start.neighbors[
                            randomInt(0, line.start.neighbors.length - 1)
                        ];
                }

                line.currentAge = line.currentAge % line.lifetime;
                line.lifetime = randomNumber(1, maxLifeTime);
            }
            updateLineParticle(line);
            line.currentAge += dt;
        }
    };
}
