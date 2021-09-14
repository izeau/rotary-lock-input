"use strict";

const lock = document.querySelector(".lock");
const input = document.querySelector("input");
const path = document.querySelector("#path");
const textPath = lock.querySelector("textPath");
const clearButton = document.querySelector(".clear");
const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let partialValue = "";
let offsetAngle = null;
let oldAngle = -2.7;
let oldIndex = 0;
let oldDirection = null;

path.setAttribute("transform", `rotate(${oldAngle} 50 50)`);
textPath.innerHTML = charset;

lock.addEventListener("mousedown", mousedown);
lock.addEventListener("touchstart", mousedown);

addEventListener("mousemove", mousemove);
addEventListener("touchmove", mousemove);

addEventListener("mouseup", mouseup);
addEventListener("touchend", mouseup);

clearButton.addEventListener("click", (e) => {
  input.value = partialValue = "";
  oldDirection = null;
  e.preventDefault();
});

function mousedown(e) {
  const { r, t } = polar(e);

  if (r >= 60 && r <= 80) {
    offsetAngle = t;
  }

  e.preventDefault();
}

function mousemove(e) {
  if (offsetAngle == null) {
    return;
  }

  const { t } = polar(e);
  const newAngle = (oldAngle + t - offsetAngle + 360) % 360;
  const newIndex = Math.round((360 - newAngle - 2.7) / 10 + 36) % 36;

  if (oldIndex !== newIndex) {
    const newDirection = Math.sign(((oldIndex - newIndex + 36) % 36) - 18);

    if (newDirection !== oldDirection && oldDirection != null) {
      partialValue += charset[oldIndex];
    }

    oldDirection = newDirection;
  }

  path.setAttribute("transform", `rotate(${newAngle} 50 50)`);
  input.value = partialValue + charset[newIndex];

  offsetAngle = t;
  oldAngle = newAngle;
  oldIndex = newIndex;
  e.preventDefault();
}

function mouseup(e) {
  if (offsetAngle == null) {
    return;
  }

  offsetAngle = null;
  e.preventDefault();
}

function polar(e) {
  const { clientX, clientY } = e.touches != null ? e.touches[0] : e;
  const rect = lock.getBoundingClientRect();
  const x = clientX - rect.x - rect.width / 2;
  const y = clientY - rect.y - rect.height / 2;
  const r = (Math.hypot(x, y) / rect.width) * 200;
  const t = (Math.atan2(y, x) * 180) / Math.PI;

  return { r, t };
}
