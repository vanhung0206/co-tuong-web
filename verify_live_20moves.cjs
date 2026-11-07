const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\vhung\\.gemini\\antigravity\\brain\\b1cfbfd5-f859-4934-88bb-00e04484dbcb';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navigating to live production site...');
    await page.goto('https://co-tuong-web.vercel.app', { waitUntil: 'networkidle2' });

    await new Promise(r => setTimeout(r, 1000));

    // Screenshot 1: Initial opening advisor with 20-move progress bar and AI eval
    console.log('Capturing debug_11_20moves_start.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'debug_11_20moves_start.png') });

    // Click "Đi Nước Này" to execute Move 1 (P2-5)
    console.log('Clicking "Đi Nước Này" for Step 1...');
    const playButtons = await page.$$('button');
    let move1Clicked = false;
    for (const btn of playButtons) {
      const text = await (await btn.getProperty('textContent')).jsonValue();
      if (text && text.includes('Đi Nước Này')) {
        await btn.click();
        move1Clicked = true;
        break;
      }
    }
    console.log('Move 1 clicked:', move1Clicked);
    await new Promise(r => setTimeout(r, 800));

    // Screenshot 2: After Move 1, opponent branch shown
    console.log('Capturing debug_12_after_move_1.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'debug_12_after_move_1.png') });

    // Click "Thử biến này" on opponent branch
    console.log('Clicking "Thử biến này"...');
    const branchButtons = await page.$$('button');
    let branchClicked = false;
    for (const btn of branchButtons) {
      const text = await (await btn.getProperty('textContent')).jsonValue();
      if (text && text.includes('Thử biến này')) {
        await btn.click();
        branchClicked = true;
        break;
      }
    }
    console.log('Branch clicked:', branchClicked);
    await new Promise(r => setTimeout(r, 800));

    // Screenshot 3: After opponent move, red next recommendation (Move 3/20)
    console.log('Capturing debug_13_after_branch.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'debug_13_after_branch.png') });

    // Click "Đi Nước Này" for Move 3 (M2+3)
    const playButtonsStep3 = await page.$$('button');
    for (const btn of playButtonsStep3) {
      const text = await (await btn.getProperty('textContent')).jsonValue();
      if (text && text.includes('Đi Nước Này')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 800));

    // Screenshot 4: Step 3 executed
    console.log('Capturing debug_14_move_3.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'debug_14_move_3.png') });

    // Click "AI Engine Phân Tích" tab
    console.log('Clicking "AI Engine Phân Tích" tab...');
    const allButtons = await page.$$('button');
    for (const btn of allButtons) {
      const text = await (await btn.getProperty('textContent')).jsonValue();
      if (text && text.includes('AI Engine Phân Tích')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 800));

    // Screenshot 5: AI Engine Deep Analysis tab
    console.log('Capturing debug_15_ai_engine_tab.png...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'debug_15_ai_engine_tab.png') });

    console.log('All tests completed successfully!');
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
})();
