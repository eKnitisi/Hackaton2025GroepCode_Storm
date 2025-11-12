import { test, expect } from "@playwright/test";
import { sum } from "firebase/firestore/lite";

test("charachterScreen", async ({ page }) => {
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
  const arrow = await page.getByAltText("Instruction Image");
});
