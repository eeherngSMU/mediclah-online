import { JSDOM } from 'jsdom';
import { NextRequest, NextResponse } from 'next/server';

// export const GET = async (req: NextRequest) => {
//     try {
//         const response = await fetch('https://www.drugs.com/insulin-glargine.html', {
//             mode: 'no-cors'
//         });
//         const html = await response.text();
        
//         const dom = new JSDOM(html);
//         const document = dom.window.document;

//         const dName = document.querySelector('.ddc-pronounce-title h1')?.textContent;

//         console.log(dName);
        
//         return NextResponse.json({ dName }, { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//     }
// };


export const POST = async (req: NextRequest) => {
    try {
        let input: string;
        try {
            const body = await req.json();
            input = body.input
            
        } catch(error) {
            return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
        }
        
        const response = await fetch(`https://www.drugs.com/${input}.html`, {
            mode: 'no-cors'
        });
        const html = await response.text();
        
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const anchors = document.querySelectorAll('a[onclick*="document.getElementById(\'subtitle-dosage-list\').style.display=\'inline\'; this.style.display=\'none\'; return false;"]');
        anchors.forEach(anchor => anchor.remove());     

        const dName = document.querySelector('.ddc-pronounce-title h1')?.textContent;
        const dContent = document.querySelector('.drug-subtitle')?.textContent;
        const dosageForms = dContent ? dContent.split('\n').map(form => form.trim()).filter(form => form && !form.includes('...show all')) : [];
        console.log(dosageForms)
 
        return NextResponse.json({ dName, dosageForms }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};