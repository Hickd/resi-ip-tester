const inquirer = require('inquirer');
const fs = require('fs');
const useProxy = require('puppeteer-page-proxy');
const clc = require('cli-color');
const { Page } = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

process.title = 'Check the IP of Your Proxies! | Made by: Oliver Hicks';


function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

const homepage = {

    type: 'list',
    name: 'homepage',
    message: 'Would you like to start?',
    choices: ['Start', 'Exit']
}

const _path = './proxies.txt';

if (!fs.existsSync(_path)) {

    fs.writeFileSync(_path, '', { encoding: 'utf8' });

    console.log(clc.cyan('Proxies.txt has been created. Please add proxies to the file.'));
} else {

    console.log(clc.green('Proxies.txt has been found.'));

}



const testProxies = async () => {


        // setting up the proxy:

let proxies = fs.readFileSync('proxies.txt').toString().split("\r\n");


for (let i = 0; i < proxies.length; i++) {

let untested = proxies.length - i;

process.title = `Check the IP of Your Proxies! | ${proxies.length} Proxies Loaded | Tested: ${i} | Untested: ${untested}`;
    
        let _proxy = proxies[i];
    
        let proxySplit = _proxy.split(':');

        await delay(1000);
    
        let proxy = `http://${proxySplit[2]}:${proxySplit[3]}@${proxySplit[0]}:${proxySplit[1]}`; 

        await delay(1000);
    
        console.log(clc.cyan('Proxy has been set to: ' + _proxy));
    
        // setting up the browser:

    try {

        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: [
                "--disable-blink-features=AutomationControlled"
            ],
        });
    
    
        const page = await browser.newPage();

        await useProxy(page, proxy);

        await page.goto('https://whoer.net/');

        await page.waitForSelector('[class="your-ip"]');

        const ipAddress = await page.$eval('[class="your-ip"]', el => el.textContent);
        
        console.log(clc.cyan(ipAddress));

        await delay(500);

        await browser.close();

    } catch (error) {

        console.log(clc.red('Error: ' + error));

    }

    }
}

const start = () => {




inquirer.prompt(homepage).then(answers => {

    if (answers.homepage === 'Start') {

        console.clear();

        testProxies();


    } else {

        process.exit();

    }

});
}

start();