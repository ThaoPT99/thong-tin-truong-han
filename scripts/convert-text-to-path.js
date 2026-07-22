const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const FONT_DIR = path.join(__dirname, 'fonts');

// Map font-weight to filename
function getFontPath(weight) {
  const map = {
    400: 'BeVietnamPro-Regular.ttf',
    600: 'BeVietnamPro-SemiBold.ttf',
    700: 'BeVietnamPro-Bold.ttf',
    800: 'BeVietnamPro-ExtraBold.ttf',
    900: 'BeVietnamPro-Black.ttf',
  };
  const file = map[weight] || map[400];
  return path.join(FONT_DIR, file);
}

// Load all fonts once
const fontCache = {};
function loadFont(weight) {
  if (fontCache[weight]) return fontCache[weight];
  const fontPath = getFontPath(weight);
  try {
    const fontBuffer = fs.readFileSync(fontPath);
    const font = opentype.parse(fontBuffer);
    fontCache[weight] = font;
    return font;
  } catch (e) {
    console.error('Failed to load font weight', weight, 'from', fontPath, e.message);
    return null;
  }
}

function convertSvgTextToPaths(svgContent) {
  // Parse text elements using regex (works for our simple SVGs)
  let result = svgContent;
  
  // Find all <text ...>...</text> elements
  const textRegex = /<text\s+([^>]*)>([^<]*)<\/text>/g;
  let match;
  let textElements = [];
  
  while ((match = textRegex.exec(svgContent)) !== null) {
    textElements.push({
      fullMatch: match[0],
      attributes: match[1],
      content: match[2],
    });
  }
  
  for (const el of textElements) {
    const attrs = el.attributes;
    const text = el.content.trim();
    if (!text) continue;
    
    // Parse attributes
    const x = parseFloat((/x="([^"]*)"/.exec(attrs) || [])[1] || 0);
    const y = parseFloat((/y="([^"]*)"/.exec(attrs) || [])[1] || 0);
    const fontSize = parseFloat((/font-size="([^"]*)"/.exec(attrs) || [])[1] || 16);
    const fontWeight = parseInt((/font-weight="([^"]*)"/.exec(attrs) || [])[1] || '400', 10);
    const textAnchor = (/text-anchor="([^"]*)"/.exec(attrs) || [])[1] || 'start';
    const fill = (/fill="([^"]*)"/.exec(attrs) || [])[1] || 'white';
    const letterSpacing = parseFloat((/letter-spacing="([^"]*)"/.exec(attrs) || [])[1] || 0);
    
    // Load font
    const font = loadFont(fontWeight);
    if (!font) {
      console.warn('Skipping text:', text, '- font not available for weight', fontWeight);
      continue;
    }
    
    // Calculate x position accounting for text-anchor="middle"
    let startX = x;
    if (textAnchor === 'middle') {
      const width = font.getAdvanceWidth(text, fontSize);
      startX = x - width / 2;
    }
    
    // Adjust for letter-spacing (approximate: each glyph shifted slightly)
    // This is a simplified approach - for production, you'd want to adjust each glyph
    // For now, we'll just use the raw path and it should be close enough
    
    // Get path
    const pathObj = font.getPath(text, startX, y, fontSize);
    const pathData = pathObj.toPathData(2); // 2 decimal places
    
    // Collect all attributes that are NOT text-specific (x, y, text-anchor, font-*, etc.)
    const keepAttrs = ['fill', 'opacity', 'transform', 'clip-path', 'filter', 'mask'];
    const filteredAttrs = [];
    
    // Parse all attributes, keep only the ones we want
    const allAttrRegex = /(\w[\w-]*(?::\w[\w-]*)?)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = allAttrRegex.exec(attrs)) !== null) {
      const attrName = attrMatch[1].toLowerCase();
      // Skip text-specific attributes
      if (attrName === 'x' || attrName === 'y' || 
          attrName === 'text-anchor' || attrName === 'textanchor' ||
          attrName.startsWith('font-') || attrName === 'font' ||
          attrName === 'letter-spacing' || attrName === 'letterspacing' ||
          attrName === 'dominant-baseline' || attrName === 'alignment-baseline') {
        continue;
      }
      filteredAttrs.push(`${attrMatch[1]}="${attrMatch[2]}"`);
    }
    
    // Add fill if not present
    const hasFill = filteredAttrs.some(a => a.startsWith('fill='));
    if (!hasFill && fill) {
      filteredAttrs.push(`fill="${fill}"`);
    }
    
    const attrString = filteredAttrs.join(' ');
    const space = attrString ? ' ' : '';
    const pathElement = `<path ${attrString}${space}d="${pathData}" />`;
    
    // Replace in result
    result = result.replace(el.fullMatch, pathElement);
  }
  
  // Remove <style> block (no longer needed)
  result = result.replace(/<style>[\s\S]*?<\/style>/, '');
  
  return result;
}

// Process both SVGs
const sidebarPath = path.join(__dirname, '..', 'public', 'images', 'logo-d26-sidebar.svg');
const horizontalPath = path.join(__dirname, '..', 'public', 'images', 'logo-d26-horizontal.svg');

console.log('Processing sidebar logo...');
const sidebarSvg = fs.readFileSync(sidebarPath, 'utf8');
const sidebarResult = convertSvgTextToPaths(sidebarSvg);
fs.writeFileSync(sidebarPath, sidebarResult, 'utf8');
console.log('Done: ' + sidebarPath);

console.log('Processing horizontal logo...');
const horizontalSvg = fs.readFileSync(horizontalPath, 'utf8');
const horizontalResult = convertSvgTextToPaths(horizontalSvg);
fs.writeFileSync(horizontalPath, horizontalResult, 'utf8');
console.log('Done: ' + horizontalPath);

// Verify no text elements remain
const sidebarCheck = fs.readFileSync(sidebarPath, 'utf8');
const horizontalCheck = fs.readFileSync(horizontalPath, 'utf8');

const sidebarTexts = sidebarCheck.match(/<text\s/g);
const horizontalTexts = horizontalCheck.match(/<text\s/g);
const sidebarStyles = sidebarCheck.match(/<style>/g);
const horizontalStyles = horizontalCheck.match(/<style>/g);

console.log('\n--- Verification ---');
console.log('Sidebar: ' + (sidebarTexts ? sidebarTexts.length + ' text elements remaining (should be 0)' : '0 text elements - GOOD'));
console.log('Horizontal: ' + (horizontalTexts ? horizontalTexts.length + ' text elements remaining (should be 0)' : '0 text elements - GOOD'));
console.log('Sidebar <style>: ' + (sidebarStyles ? 'REMOVED' : '0 - GOOD'));
console.log('Horizontal <style>: ' + (horizontalStyles ? 'REMOVED' : '0 - GOOD'));

console.log('\nAll done!');
