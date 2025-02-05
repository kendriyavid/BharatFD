const { JSDOM } = require('jsdom');
const { translate } = require('google-translate-api-x');

async function translateHTML(htmlString, targetLanguage) {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  const textArray = [];
  let counter = 1;

  function traverseAndReplace(node) {
    if (node.nodeType === document.TEXT_NODE && node.textContent.trim() !== "") {
      textArray.push(node.textContent.trim());
      return ` \${${counter++}} `;
    } 
    else if (node.nodeType === document.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      
      const attributes = Array.from(node.attributes)
        .map(attr => `${attr.name}="${attr.value}"`)
        .join(' ');
      
      const voidElements = ['img', 'br', 'hr', 'input', 'meta', 'link'];
      if (voidElements.includes(tagName)) {
        return `<${tagName}${attributes ? ' ' + attributes : ''}>`;
      }

      let childHTML = '';
      for (const child of node.childNodes) {
        childHTML += traverseAndReplace(child) || '';
      }

      return `<${tagName}${attributes ? ' ' + attributes : ''}>${childHTML}</${tagName}>`;
    }
    
    return '';
  }

  const modifiedHTML = traverseAndReplace(document.body);

  const translatedTextArray = await Promise.all(
    textArray.map(async (text) => {
      try {
        const translationResult = await translate(text, { to: targetLanguage });
        return translationResult.text;
      } catch (error) {
        console.error("Translation error for text:", text, error);
        return text; // Fallback to original text
      }
    })
  );

  let translatedHTML = modifiedHTML;
  for (let i = 0; i < translatedTextArray.length; i++) {
    translatedHTML = translatedHTML.replace(
      `\${${i + 1}}`, 
      translatedTextArray[i]
    );
  }

  let finalHTML = translatedHTML;
  try {
    const resultDom = new JSDOM(translatedHTML);
    const body = resultDom.window.document.body;
    if (body && body.innerHTML) {
      finalHTML = body.innerHTML;
    }
  } catch (error) {
    console.error("Error extracting final HTML:", error);
  }

  console.log( textArray,translatedTextArray,modifiedHTML,)

  return {
    translated: finalHTML,
  };
}


module.exports =translateHTML
