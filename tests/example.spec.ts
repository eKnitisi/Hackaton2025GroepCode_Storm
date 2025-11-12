import { test, expect } from "@playwright/test";
import { TIMEOUT } from "dns";

test("charachterScreen", async ({ page }) => {
  test.setTimeout(90000);

  await page.goto("https://hackthefuture.bignited.be/char-select");
  await page.waitForLoadState("domcontentloaded");
  const character = await page.locator("#male");
  await character.click();
  const yesButton = await page.getByText("yes");
  await yesButton.click();
  await page.waitForLoadState();
  const name = await page.getByPlaceholder("Enter your name").fill("tibe");
  const age = await page.getByPlaceholder("Enter your age").fill("23");
  const countrySelect = page.locator("select.form-control");
  await countrySelect.waitFor({ state: "visible", timeout: 5000 });

  await countrySelect.selectOption("Belgium");

  const startGame = await page.getByText("Start Game").click();

  // OFFICE

  const letters = page.locator("#letters");
  await letters.waitFor({ state: "visible", timeout: 3000 });
  await letters.scrollIntoViewIfNeeded();
  await letters.click();

  await expect(letters).toBeVisible();

  const xButton = await page.locator(".close").click();
  const crystalHandle = await page.waitForSelector("#crystal", {
    timeout: 9000,
  });
  await page.evaluate(async (element) => {
    if (getComputedStyle(element).opacity === "1") return;
    await new Promise((resolve) => {
      const onEnd = () => {
        element.removeEventListener("transitionend", onEnd);
        resolve(undefined);
      };
      element.addEventListener("transitionend", onEnd);
      setTimeout(() => {
        element.removeEventListener("transitionend", onEnd);
        resolve(undefined);
      }, 15000);
    });
  }, crystalHandle);

  await crystalHandle.scrollIntoViewIfNeeded();
  await crystalHandle.click();

  await page.waitForSelector("#image-crystal", {
    state: "attached",
    timeout: 9000,
  });
  await page.waitForFunction(
    (selector) => {
      const element = document.querySelector(selector);
      return !!element && window.getComputedStyle(element).opacity === "1";
    },
    "#image-crystal",
    { timeout: 9000 }
  );

  const imageCrystal = page.locator("#image-crystal");
  await imageCrystal.scrollIntoViewIfNeeded();
  await imageCrystal.click();

  // DOCKING BAY
  await page.waitForLoadState("load");
  await page.waitForLoadState("domcontentloaded");

  for (let i = 0; i < 5; i++) {
    const code = await page.locator(`#randomValue-${i}`).innerHTML();
    await page
      .locator(`#switch-${i}`)
      .click({ clickCount: 2 - parseInt(code) });
  }

  const drop = await page.getByText("DROP").click();
  const submarine = await page.locator("#submarine").click();
  await page.waitForLoadState("domcontentloaded");

  // SUBMARINE

  for (let i = 0; i < 10; i++) {
    const arrowImgString = await page
      .getByAltText("Instruction Image")
      .getAttribute("src");
    const directionPng = arrowImgString?.split("/").pop();
    if (directionPng?.includes("left")) {
      await page.keyboard.press("ArrowLeft");
    }
    if (directionPng?.includes("right")) {
      await page.keyboard.press("ArrowRight");
    }
    if (directionPng?.includes("up")) {
      await page.keyboard.press("ArrowUp");
    }
    await page.waitForTimeout(500);
  }

  await page.waitForURL("**/crash", { waitUntil: "load" });
  const exit = await page.locator(".square").click({ clickCount: 2 });

  for (let i = 0; i <= 4; i++) {
    for (let j = 0; j <= 5; j++) {
      const path = await page.locator(`#square-${i}`).hover();
    }
    const crystal = page.locator(".glowing");

    if (await crystal.isVisible()) {
      const path = await page.locator(`#square-${i}`).click({ clickCount: 4 });
      break;
    }
  }

  // PUZZLE
  const targetSlots = page.locator("#word-target .target-slot");
  const draggableCubes = page.locator(
    "#draggable-cubes-container .draggable-cube"
  );

  const targetWord = "ATLANTIS";

  for (let i = 0; i < targetWord.length; i++) {
    const letter = targetWord[i];
    const cube = draggableCubes.filter({ hasText: letter }).first();
    const slot = targetSlots.nth(i);
    await cube.dragTo(slot);
  }

  await page.locator(".crystal-outside").click();
  await page.locator("#crystal").click();
  await page.locator(".crystal-outside").click();
  const crystalButton = page.locator(".crystal-inside");
  await crystalButton.hover();
  await crystalButton.dispatchEvent("mousedown");

  const loadingBar = page.locator(".loading-bar");
  await page.waitForFunction(
    () => {
      const bar = document.querySelector(".loading-bar") as HTMLElement;
      return bar && parseFloat(bar.style.width) >= 100;
    },
    { timeout: 15000 }
  );

  await crystalButton.dispatchEvent("mouseup");

  await page.waitForURL("**/boss", { waitUntil: "load" });
  await page.keyboard.press("Enter");

  await page.keyboard.down("ArrowRight");

  const startRight = Date.now();
  while (Date.now() - startRight < 5000) {
    await page.keyboard.press("Space");
    await page.waitForTimeout(200);
  }

  await page.keyboard.up("ArrowRight");
  await page.keyboard.down("ArrowLeft");

  const startLeft = Date.now();
  while (Date.now() - startLeft < 5000) {
    await page.keyboard.press("Space");
    await page.waitForTimeout(200);
  }

  await page.keyboard.up("ArrowLeft");
});
