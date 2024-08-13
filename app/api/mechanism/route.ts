import puppeteer from 'puppeteer';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        let input: string;
        try {
            const body = await req.json();
            input = body.input;
        } catch (error) {
            return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
        }

        // Launch Puppeteer browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to the URL
        await page.goto(`https://go.drugbank.com/drugs`);
        console.log('Navigated to DrugBank');

        await page.locator('#query').fill(`${input}`);
        console.log('Filled query input');

        await page.locator('.search-query-button').click();
        console.log('button clicked');
        // Wait for the mechanism of action element to load
        try {
            await page.waitForSelector('#mechanism-of-action', { timeout: 60000 });
            console.log('Mechanism of action element found');
        } catch (timeoutError) {
            console.error('Timeout waiting for selector:', timeoutError);
            await page.screenshot({ path: 'public/debug-screenshot-timeout.png' });
            console.log('Timeout screenshot saved');
            await browser.close();
            return NextResponse.json({ error: 'Timeout waiting for selector' }, { status: 500 });
        }

        try {
            await page.screenshot({ path: 'public/debug-screenshot.png' });
            console.log('Screenshot saved successfully.');
        } catch (screenshotError) {
            console.error('Failed to save screenshot:', screenshotError);
        }

        
        const dMechanism = await page.evaluate(() => {
            const dMechanismElement = document.querySelector('#mechanism-of-action + dd');
            if (!dMechanismElement) return null;

            const paragraphs = dMechanismElement.querySelectorAll('p');
            const mechanismText = Array.from(paragraphs).map(p => p.innerText).join('\n');
            console.log('Mechanism of action paragraphs:', mechanismText);
            return mechanismText;
        });


        // Close the browser
        await browser.close();


        return NextResponse.json({ dMechanism }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};