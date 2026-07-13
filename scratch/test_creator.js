// Mock DOMParser for node testing
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const html = `<div style="max-width: 520px; margin: 0 auto; padding: 5px 0; font-family: Arial,Helvetica,sans-serif; display: flex; justify-content: center; box-sizing: border-box;">
<div style="max-width: 460px; width: 100%; background-color: #ffffff; border: 1px solid #e6e8ee; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; box-sizing: border-box;"><!-- Header / -->
<!-- Görsel -->
<div style="padding: 18px; display: flex; justify-content: center;"><img style="object-fit: cover; border-radius: 10px; display: block;" src="/incident/attachments/WZkp1hdAyUXlMMRGj5nBmK10OWe7ISyWSfnDVQKvP" alt="G&ouml;rsel" width="226" height="150"></div>
<!--Logo -->
<div style="padding: 12px; border-bottom: 1px solid #eef0f4; display: flex; justify-content: center; align-items: center;"><img style="height: 50px; max-width: 100%; display: block;" src="/incident/attachments/h58Up9AQt76JJ3qS4eDUkhXKwmpaTGT8QkjghPKTZ" alt="T.C. B&uuml;y&uuml;k&ccedil;ekmece Belediyesi"></div>
<!-- Başlık -->
<div style="padding: 0 20px; text-align: center;">
<h2 style="margin: 6px 0 8px 0; color: #236fa1; font-size: 21px; font-weight: 600; letter-spacing: 0.5px; line-height: 1.3;">Başkanlık Sokağın Sesi</h2>
</div>
<!-- Açıklama -->
<div style="padding: 6px 22px 22px 22px; text-align: center;">
<div style="font-size: 14px; color: #4b5563; line-height: 22px;">Başkanlık Sokağın Sesi kapsamında sizlerin g&ouml;r&uuml;ş ve &ouml;nerilerini dinliyoruz. Bu form aracılığıyla ileteceğiniz bilgiler değerlendirilerek ilgili birimlere aktarılacaktır.</div>
</div>
</div>
</div>`;

function replaceHtmlContents(html, titleText, descText, logoUrl, imageUrl) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const imgs = doc.querySelectorAll('img');
  let logoImg = null;
  let mainImg = null;
  
  imgs.forEach(img => {
    const alt = (img.getAttribute('alt') || '').toLowerCase();
    const src = (img.getAttribute('src') || '').toLowerCase();
    
    if (alt.includes('logo') || alt.includes('belediye') || alt.includes('tc') || src.includes('logo')) {
      logoImg = img;
    } else if (alt.includes('görsel') || alt.includes('gorsel') || alt.includes('resim') || alt.includes('main') || alt.includes('photo')) {
      mainImg = img;
    }
  });
  
  if (imgs.length > 0) {
    if (!logoImg && !mainImg) {
      if (imgs.length >= 2) {
        const firstAlt = (imgs[0].getAttribute('alt') || '').toLowerCase();
        if (firstAlt.includes('görsel') || firstAlt.includes('gorsel')) {
          mainImg = imgs[0];
          logoImg = imgs[1];
        } else {
          logoImg = imgs[0];
          mainImg = imgs[1];
        }
      } else {
        mainImg = imgs[0];
      }
    }
  }
  
  if (logoImg && logoUrl) {
    logoImg.setAttribute('src', logoUrl);
  }
  if (mainImg && imageUrl) {
    mainImg.setAttribute('src', imageUrl);
  }
  
  const heading = doc.querySelector('h1, h2, h3, h4');
  if (heading && titleText) {
    heading.textContent = titleText;
  }
  
  if (descText) {
    const paragraphs = doc.querySelectorAll('p');
    if (paragraphs.length > 0) {
      paragraphs[paragraphs.length - 1].textContent = descText;
    } else {
      const divs = Array.from(doc.querySelectorAll('div'));
      const textDivs = divs.filter(d => d.children.length === 0 && d.textContent.trim().length > 0);
      if (textDivs.length > 0) {
        textDivs[textDivs.length - 1].textContent = descText;
      }
    }
  }
  
  return doc.body.innerHTML;
}

try {
  console.log("Running replacement with valid strings:");
  const res1 = replaceHtmlContents(html, "New Title", "New Description", "http://logo.url", "http://image.url");
  console.log("Success! Output contains New Title:", res1.includes("New Title"));
  console.log("Output contains New Description:", res1.includes("New Description"));
  console.log("Output contains logo URL:", res1.includes("http://logo.url"));
  console.log("Output contains image URL:", res1.includes("http://image.url"));

  console.log("\nRunning replacement with empty strings:");
  const res2 = replaceHtmlContents(html, "", "", "", "");
  console.log("Success! res2 length:", res2.length);
} catch (e) {
  console.error("FAILED with error:", e);
}
