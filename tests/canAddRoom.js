require('dotenv').config();
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

async function test() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:3000/login');

    const usernameField = await driver.wait(
      until.elementLocated(By.id('username')),
      10000,
    );

    await usernameField.sendKeys(process.env.TEST_ADMIN_USERNAME);

    const passwordField = await driver.wait(
      until.elementLocated(By.id('password')),
      10000,
    );

    await passwordField.sendKeys(process.env.TEST_ADMIN_PASSWORD);

    console.log('Login fields filled.');

    const loginButton = await driver.findElement(
      By.css('button[type="submit"]'),
    );

    await loginButton.click();

    await driver.wait(
      until.elementLocated(By.css('form[action="/logout"]')),
      10000,
    );

    console.log('Logged in successfully.');

    await driver.get('http://localhost:3000/rooms/1');

    await driver.wait(until.elementLocated(By.id('add-room-form')), 10000);

    console.log('Admin room form found.');

    const capacityField = await driver.findElement(By.id('capacity'));
    await capacityField.sendKeys('3');

    const priceField = await driver.findElement(By.id('price-per-day'));
    await priceField.sendKeys('234.56');

    console.log('Room details filled.');

    const roomsBefore = await driver.findElements(By.css('.list-group-item'));

    const roomCountBefore = roomsBefore.length;

    const roomForm = await driver.findElement(By.id('add-room-form'));

    const addRoomButton = await roomForm.findElement(
      By.css('button[type="submit"]'),
    );

    await addRoomButton.click();

    await driver.wait(async () => {
      const currentRooms = await driver.findElements(
        By.css('.list-group-item'),
      );

      return currentRooms.length === roomCountBefore + 1;
    }, 10000);

    await driver.wait(until.elementLocated(By.id('add-room-form')), 10000);

    console.log('Room form submitted.');

    const roomsAfter = await driver.findElements(By.css('.list-group-item'));

    assert.equal(
      roomsAfter.length,
      roomCountBefore + 1,
      'Adding a room should increase the room count by one.',
    );

    console.log('Passed: one new room appeared.');

    const roomTexts = await Promise.all(
      roomsAfter.map((room) => room.getText()),
    );

    const matchingRoom = roomTexts.some(
      (text) =>
        text.includes('Room for 3 people') && text.includes('234.56 per day'),
    );

    assert.ok(
      matchingRoom,
      'The room list should show the submitted capacity and price.',
    );

    console.log('Passed: room details match.');

    const screenshot = await driver.takeScreenshot();

    await fs.writeFile('selenium-room-result.png', screenshot, 'base64');
  } finally {
    await driver.quit();
  }
}

test().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
