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
        await page.goto(`https://www.mediview.sg/keyword/n-zXKQXN/${input}`, {
            // waitUntil: 'networkidle2'
        });

        // Wait for images to load
        await page.waitForSelector('.sm-gallery-images img');

        // Extract image URLs
        // const dImages = await page.evaluate(() => {
        //     const imgElements = document.querySelectorAll('.sm-gallery-images img');
        //     return Array.from(imgElements).map(img => img.src);
        // });

        const dImages = await page.evaluate(() => {
            const imgElements = document.querySelectorAll('.sm-gallery-images img');
            return Array.from(imgElements)
                .map(img => img.src)
                .filter(src => !src.endsWith('.gif'));
        });

        // Close the browser
        await browser.close();


        return NextResponse.json({ dImages }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};