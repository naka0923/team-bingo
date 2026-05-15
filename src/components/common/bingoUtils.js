import { imageMap } from "./images";

export const TRAITS = new Map([
  [imageMap.buddy, ["projectile"]],
  [imageMap.koopajr, ["difficult"]],
  [imageMap.daisy, ["difficult"]],
  [imageMap.bayonetta, ["difficult"]],
  [imageMap.brave, ["sword"]],
  [imageMap.captain, ["power"]],
  [imageMap.chrom, ["sword"]],
  [imageMap.cloud, ["sword"], ["simple"]],
  [imageMap.dedede, ["power"]],
  [imageMap.demon, ["power"]],
  [imageMap.diddy, ["difficult"]],
  [imageMap.dolly, ["power"]],
  [imageMap.donkey, ["power"], ["simple"]],
  [imageMap.duckhunt, ["projectile"], ["difficult"]],
  [imageMap.edge, ["sword"]],
  [imageMap.eflame, ["sword"], ["power"]],
  [imageMap.falco, ["simple"]],
  [imageMap.fox, ["difficult"]],
  [imageMap.gamewatch, ["difficult"]],
  [imageMap.ganon, ["power"], ["simple"]],
  [imageMap.gaogaen, ["power"]],
  [imageMap.gekkouga, ["difficult"]],
  [imageMap.ice_climber, ["difficult"]],
  [imageMap.ike, ["sword"], ["power"]],
  [imageMap.inkling, ["difficult"]],
  [imageMap.jack, ["diffcult"]],
  [imageMap.kamui, ["sword"]],
  [imageMap.ken, ["difficult"]],
  [imageMap.kirby, ["power"], ["simple"]],
  [imageMap.koopa, ["power"], ["simple"]],
  [imageMap.krool, ["power"]],
  [imageMap.link, ["sword"]],
  [imageMap.littlemac, ["power"]],
  [imageMap.lucario, ["projectile"]],
  [imageMap.lucas, ["projectile"], ["difficult"]],
  [imageMap.lucina, ["sword"], ["simple"]],
  [imageMap.luigi, ["difficult"]],
  [imageMap.mario, ["simple"]],
  [imageMap.mariod, ["power"]],
  [imageMap.marth, ["sword"], ["difficult"]],
  [imageMap.master, ["sword"]],
  [imageMap.metaknight, ["sword"], ["difficult"]],
  [imageMap.mewtwo, ["projectile"]],
  [imageMap.miifighter, ["difficult"]],
  [imageMap.miigunner, ["projectile"]],
  [imageMap.miiswordsman, ["sword"]],
  [imageMap.murabito, ["projectile"], ["difficult"]],
  [imageMap.ness, ["simple"]],
  [imageMap.packun, ["difficult"]],
  [imageMap.pacman, ["projectile"], ["difficult"]],
  [imageMap.palutena, ["simple"]],
  [imageMap.peach, ["difficult"]],
  [imageMap.pichu, ["difficult"]],
  [imageMap.pickel, ["difficult"]],
  [imageMap.pikachu, ["difficult"]],
  [imageMap.pikmin, ["projectile"]],
  [imageMap.pit, ["sword"], ["simple"]],
  [imageMap.pitb, ["sword"], ["simple"]],
  [imageMap.ptrainer, ["power"]],
  [imageMap.purin, ["difficult"]],
  [imageMap.reflet, ["sword"], ["projectile"]],
  [imageMap.richter, ["projectile"], ["difficult"]],
  [imageMap.ridley, ["sword"], ["power"]],
  [imageMap.robot, ["projectile"]],
  [imageMap.rockman, ["projectile"], ["difficult"]],
  [imageMap.rosetta, ["difficult"]],
  [imageMap.roy, ["sword"], ["power"]],
  [imageMap.ryu, ["difficult"]],
  [imageMap.samus, ["projectile"]],
  [imageMap.samusd, ["projectile"]],
  [imageMap.sheik, ["difficult"]],
  [imageMap.shizue, ["projectile"]],
  [imageMap.shulk, ["sword"]],
  [imageMap.simon, ["projectile"], ["difficult"]],
  [imageMap.snake, ["projectile"]],
  [imageMap.sonic, ["difficult"]],
  [imageMap.szerosuit, ["difficult"]],
  [imageMap.tantan, ["difficult"]],
  [imageMap.toonlink, ["sword"]],
  [imageMap.trail, ["sword"]],
  [imageMap.wario, ["difficult"]],
  [imageMap.wiifit, ["projectile"], ["difficult"]],
  [imageMap.wolf, ["simple"]],
  [imageMap.yoshi, ["simple"], ["power"]],
  [imageMap.younglink, ["sword"], ["projectile"]],
  [imageMap.zelda, ["power"]],
  [imageMap.random, ["difficult"]],
]);

export const BIASES = [
  { id: "none", name: "なし", wanted: [] },
  { id: "sword", name: "剣キャラ増し", wanted: ["sword"] },
  { id: "projectile", name: "飛び道具増し", wanted: ["projectile"] },
  { id: "power", name: "パワー増し", wanted: ["power"] },
  { id: "difficult", name: "高難度増し", wanted: ["difficult"] },
  { id: "simple", name: "シンプル増し", wanted: ["simple"] },
  { id: "auto", name: "おまかせ（ランダム増し）", wanted: [] },
];

export const NEW_FIGHTERS = [imageMap.random];

export function weightByTags(img, bias) {
  if (!bias || bias.id === "none" || !bias.wanted || bias.wanted.length === 0)
    return 1;
  const traits = TRAITS.get(img) ?? [];
  const matches = traits.filter((t) => bias.wanted.includes(t)).length;
  return matches > 0 ? 30.0 : 1;
}

export function sampleWithoutReplacementWeighted(items, getWeight, k) {
  const pool = items.slice();
  const picked = [];
  for (let i = 0; i < k && pool.length > 0; i++) {
    const weights = pool.map(getWeight);
    let sum = 0;
    for (const w of weights) sum += w;
    if (sum <= 0) {
      picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      continue;
    }
    let r = Math.random() * sum;
    let idx = 0;
    for (let j = 0; j < pool.length; j++) {
      r -= weights[j];
      if (r <= 0) { idx = j; break; }
    }
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}
