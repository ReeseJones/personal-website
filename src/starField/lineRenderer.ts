import * as PIXI from "pixi.js";
import {
  clamp,
  getRandomIndices,
  randomInt,
  randomNumber,
} from "../lib/helpers";
import lineGradient from "../images/lineGradient.png";
import { IParticle } from "./IParticle";
import { average, direction, length, subtract } from "../lib/point-math";

export interface ILineParticle {
  sprite: PIXI.Sprite;
  lifetime: number;
  currentAge: number;
  start: IParticle;
  end: IParticle;
}

export function pickStars(stars: IParticle[]) {
  const firstIndex = randomInt(0, stars.length - 1);
  let first = stars[firstIndex];

  for (let i = 0; i < stars.length; i += 1) {
    first = stars[(firstIndex + i) % stars.length];

    if (first.depthFactor < 0.6) continue;
    if (first.sprite.position.x < 200 || first.sprite.position.x > 1600)
      continue;
    if (first.sprite.position.y < 200 || first.sprite.position.y > 700)
      continue;
    break;
  }

  const secondIndex = randomInt(0, stars.length - 1);
  let second = stars[secondIndex];
  for (let i = 0; i < stars.length; i += 1) {
    second = stars[(firstIndex + i) % stars.length];
    const dist = length(
      subtract(first.sprite.position, second.sprite.position)
    );
    const depthDiff = Math.abs(first.depthFactor - second.depthFactor);

    if (depthDiff < 0.3) continue;
    if (dist > 200) continue;
    if (first === second) continue;
    if (second.sprite.position.x < 0 || second.sprite.position.x > 1800)
      continue;
    if (second.sprite.position.y < 0 || second.sprite.position.y > 900)
      continue;
    break;
  }
  return { first, second };
}

export function updateLineParticle(line: ILineParticle) {
  const newPos = average(line.start.sprite.position, line.end.sprite.position);
  const diff = subtract(line.start.sprite.position, line.end.sprite.position);
  line.sprite.position.set(newPos.x, newPos.y);
  line.sprite.rotation = Math.atan2(diff.y, diff.x) + Math.PI;
  const distance = length(diff);
  const scale = distance / 256;
  line.sprite.scale.x = scale;
  const age = 1 - line.currentAge / line.lifetime;
  line.sprite.alpha = Math.sin(age * Math.PI);
}

export class LineRenderer {
  private lineContainer = new PIXI.Container();

  private lines: ILineParticle[] = [];

  private lineCount = 5;

  constructor(private app: PIXI.Application, private stars: IParticle[]) {
    app.stage.addChild(this.lineContainer);

    const lineTexture = PIXI.Texture.from(lineGradient);

    for (let i = 0; i < this.lineCount; i += 1) {
      const starPicks = pickStars(this.stars);
      const lineParticle: ILineParticle = {
        sprite: new PIXI.Sprite(lineTexture),
        lifetime: 3,
        currentAge: randomNumber(0, 3),
        start: starPicks.first,
        end: starPicks.second,
      };
      lineParticle.sprite.anchor.set(0.5);
      updateLineParticle(lineParticle);

      this.lineContainer.addChild(lineParticle.sprite);
      this.lines.push(lineParticle);
    }

    app.ticker.add((dtMs) => {
      const dt = app.ticker.elapsedMS / 1000;
      //console.log(`dtMs:${dtMs} -> dt / 1000: ${dt}`);

      for (const line of this.lines) {
        if (line.currentAge > line.lifetime) {
          const starPicks = pickStars(this.stars);
          line.end = line.start;
          line.start = starPicks.second;
          line.currentAge = line.currentAge % line.lifetime;
          line.lifetime = randomNumber(2, 4);
        }
        updateLineParticle(line);
        line.currentAge += dt;
      }
    });
  }
}
