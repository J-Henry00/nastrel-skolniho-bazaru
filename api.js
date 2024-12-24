const puppeteer = require('puppeteer');

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const log = (msg) => {
    return console.log(`[INSTAGRAM SCRAPER] ${msg}`);
};

var browserLaunchParameters = {
    args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"
    ],
    headless: true,
    executablePath: process.env.NODE_ENV == 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
};

async function getRawData() {
    const browser = await puppeteer.launch(browserLaunchParameters);
    try {
        const page = await browser.newPage();
        
        log("Opening obchoduj.na.krizikovi's profile...");
        await page.goto('https://www.instagram.com/obchoduj.na.krizikovi');
        
        await page.waitForSelector('article');
        
        log("Checking and skiping cookies & login...");
        await page.click('button._a9--._ap36._a9_1'); // decline cookies

        await sleep(5000);
        
        if ((await page.$('div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._ab9z._aba9._abch._abck.x1vjfegm._abcm')))
            await page.click('div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._ab9z._aba9._abch._abck.x1vjfegm._abcm'); // click on x on login form
        
        await sleep(1000);
        
        // Scroll to the bottom of the page until no more content loads
        let lastHeight = await page.evaluate('document.body.scrollHeight');
        let newHeight;
        
        log("Getting to the bottom of the page to load all posts...");
        while (true) {
            // Break the loop if no new content loaded
            if (newHeight === lastHeight) {
                break;
            }
            
            // Scroll to bottom
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            
            // Wait for new content to load
            await sleep(2000);
            
            // Calculate new scroll height
            newHeight = await page.evaluate('document.body.scrollHeight');
            
            lastHeight = newHeight;
        }        

        log("Collecting data...");
        let data = await page.evaluate(() => {

            const postList = document.querySelectorAll('a[href*="/obchoduj.na.krizikovi/p/"]');

            return Array.from(postList).map(post => {

                const src = post.querySelector('div._aagu > div._aagv > img').getAttribute('src');
                const url = "https://www.instagram.com" + post.getAttribute('href');

                return { src, url };

            });

        });

        log("Data collected...");

        return data;

    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    } finally {
        await browser.close();
    }
};

async function getData() {
    var rawData = await getRawData();
    let data = [];

    log("Starting of post description process...");
    const browser = await puppeteer.launch(browserLaunchParameters);
    try {
        const page = await browser.newPage();

        for (const p of rawData) {
            log("Processing: " + p.url);
            let model = {
                url: p.url,
                image: p.src,
                description: null
            };

            await page.goto(p.url);
            await sleep(1000);
            
            log("Checking and skiping cookies & login...");
            if (await page.$('button._a9--._ap36._a9_1'))
                await page.click('button._a9--._ap36._a9_1'); // decline cookies

            await sleep(500);
            
            if ((await page.$('div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._ab9z._aba9._abch._abck.x1vjfegm._abcm')))
                await page.click('div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._ab9z._aba9._abch._abck.x1vjfegm._abcm'); // click on x on login form
            
            await sleep(500);

            model.image = await page.$eval('img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3', img => img.src.replace('https://scontent-prg1-1.cdninstagram.com/v/', '/image/'));
            model.description = await page.$eval('h1._ap3a._aaco._aacu._aacx._aad7._aade', text => text.textContent.replace(/\\n/g, '\n'));

            data.push(model);

        }

        data = data.filter((_p,i) => i > 2);

        return data;
    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    } finally {
        await browser.close();
    }
}

module.exports = getData;