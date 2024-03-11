import {delay} from "./delay"

export async function randomPause(minSec, maxSec) {
  minSec = Math.round(Number(minSec))
  maxSec = Math.round(Number(maxSec))
  if (isNaN(minSec) || minSec <= 0) minSec = 0
  if (isNaN(maxSec) || maxSec <= minSec) maxSec = minSec
  let time = maxSec
  if (maxSec > minSec) {
    const difference = maxSec - minSec
    const rand = Math.random()
    time = Math.floor(rand * difference) + minSec
  }
  time *= 1000
  await delay(time)
}
