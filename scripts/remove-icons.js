// scripts/remove-icons.js
// Remove all emoji icons from UI files, replacing with text labels
const fs = require('fs');
const path = require('path');

const FILES = [
  'public/js/checklist.js',
  'public/js/render.js',
  'public/js/interview.js',
  'public/js/ai-chat.js',
  'public/js/advisor.js',
  'public/js/knowledge-base.js',
  'public/js/application.js',
  'public/index.html',
  'api/deepseek.js',
  'public/styles.css',
  'public/checklist.css',
];

// Comprehensive emoji removal map for UI
// For each emoji, define replacement ('' to remove, or text to replace)
const REPLACEMENTS = {
  // Sidebar tabs - keep label text
  '\uD83C\uDFE0': '', // 🏠 Home
  '\uD83C\uDF93': '', // 🎓 Education / Graduation
  '\uD83D\uDCDA': '', // 📚 Books / Knowledge
  '\uD83D\uDCCB': '', // 📋 Clipboard
  '\uD83D\uDCAC': '', // 💬 Chat
  '\uD83D\uDD0D': '', // 🔍 Search
  '\uD83D\uDCC8': '', // 📊 Chart
  '\uD83D\uDCC4': '', // 📄 Document
  '\uD83D\uDD17': '', // 🔗 Link
  '\uD83C\uDFAF': '', // 🎯 Target
  '\u26A1': '', // ⚡ Lightning
  '\uD83D\uDE80': '', // 🚀 Rocket
  
  // People
  '\uD83D\uDC64': '', // 👤 Person
  '\uD83D\uDC60': '', // 👠 shoe / female
  '\uD83D\uDC68': '', // 👨 man
  '\uD83D\uDC69': '', // 👩 woman
  '\uD83C\uDF93': '', // 🎓 grad
  
  // Objects
  '\uD83D\uDCB0': '', // 💰 Money bag
  '\uD83D\uDCB5': '', // 💵 Dollar
  '\uD83D\uDCB3': '', // 💳 Credit card
  '\uD83C\uDFE8': '', // 🏨 Building
  '\uD83D\uDCC5': '', // 📅 Calendar
  '\uD83D\uDD14': '', // 🔔 Bell
  '\uD83D\uDCE7': '', // 📧 Mail
  '\uD83D\uDCDE': '', // 📞 Phone
  '\uD83D\uDCF1': '', // 📱 Mobile
  '\uD83D\uDCC6': '', // 📆 Calendar
  '\uD83D\uDCDD': '', // 📝 Memo / Pencil
  '\uD83D\uDCD0': '', // 📐 Notebook
  '\uD83D\uDDC2\uFE0F': '', // 🗂️ Folder
  '\uD83D\uDCC1': '', // 📁 Folder
  '\uD83D\uDCE6': '', // 📦 Package
  '\uD83D\uDEE0\uFE0F': '', // 🛠️ Tools
  '\uD83C\uDFB2': '', // 🎲 Dice
  '\uD83C\uDF89': '', // 🎉 Party
  '\uD83C\uDF81': '', // 🎁 Gift
  '\uD83C\uDFC6': '', // 🏆 Trophy
  '\uD83D\uDC8E': '', // 💎 Diamond
  
  // Symbols
  '\u2705': '', // ✅ Check mark
  '\u274C': '', // ❌ Cross mark
  '\u26A0\uFE0F': '', // ⚠️ Warning
  '\u2757': '', // ❗ Exclamation
  '\u2753': '', // ❓ Question
  '\u2795': '', // ➕ Plus
  '\u2796': '', // ➖ Minus
  '\u27A1\uFE0F': '', // ➡️ Right arrow
  '\u2B05\uFE0F': '', // ⬅️ Left arrow
  '\u2194\uFE0F': '', // ↔️ Left right arrow
  '\u2195': '', // ↕️ Up down
  '\u2B06\uFE0F': '', // ⬆️ Up arrow
  '\u2B07\uFE0F': '', // ⬇️ Down arrow
  '\uD83D\uDD04': '', // 🔄 Arrows
  '\uD83D\uDD19': '', // 🔙 Back
  '\uD83D\uDD1A': '', // 🔚 End
  '\uD83D\uDD1B': '', // 🔛 On
  '\uD83D\uDD1C': '', // 🔜 Soon
  '\uD83D\uDD1D': '', // 🔝 Top
  
  // Status colors
  '\uD83D\uDD34': '', // 🔴 Red circle
  '\uD83D\uDFE1': '', // 🟡 Yellow circle
  '\uD83D\uDFE2': '', // 🟢 Green circle
  '\uD83D\uDD35': '', // 🔵 Blue circle
  '\u26AA': '', // ⚪ White circle
  '\u26AB': '', // ⚫ Black circle
  '\uD83D\uDFE0': '', // 🟠 Orange circle
  '\uD83D\uDFE3': '', // 🟣 Purple circle
  '\uD83D\uDFE4': '', // 🟤 Brown circle
  
  // Rating
  '\u2B50': '', // ⭐ Star
  '\uD83D\uDC4D': '', // 👍 Thumbs up
  '\uD83D\uDC4E': '', // 👎 Thumbs down
  '\uD83D\uDC4F': '', // 👏 Clap
  
  // Misc
  '\uD83D\uDE0A': '', // 😊 Smile
  '\uD83D\uDE42': '', // 🙂 Slight smile
  '\uD83D\uDE22': '', // 😢 Cry
  '\uD83D\uDCA1': '', // 💡 Lightbulb
  '\uD83D\uDCA5': '', // 💥 Collision
  '\uD83D\uDCA4': '', // 💤 Zzz
  '\u2764\uFE0F': '', // ❤️ Heart
  '\uD83D\uDC9B': '', // 💛 Yellow heart
  '\uD83D\uDC9A': '', // 💚 Green heart
  '\uD83D\uDC99': '', // 💙 Blue heart
  '\uD83D\uDC9C': '', // 💜 Purple heart
  '\uD83D\uDC94': '', // 💔 Broken heart
  '\u2601\uFE0F': '', // ☁️ Cloud
  '\u2600\uFE0F': '', // ☀️ Sun
  '\uD83C\uDF19': '', // 🌙 Moon
  '\uD83C\uDF0D': '', // 🌍 Earth
  '\uD83C\uDF0F': '', // 🌏 Earth
  '\uD83C\uDF0E': '', // 🌎 Earth
  '\uD83C\uDF0A': '', // 🌊 Wave
  '\uD83D\uDD25': '', // 🔥 Fire
  '\uD83D\uDCA7': '', // 💧 Droplet
  '\u2744\uFE0F': '', // ❄️ Snowflake
  '\uD83C\uDF38': '', // 🌸 Cherry blossom
  '\uD83C\uDF3F': '', // 🌿 Herb
  '\uD83D\uDEAA': '', // 🚪 Door
  '\uD83D\uDE8C': '', // 🚌 Bus
  '\u2708\uFE0F': '', // ✈️ Airplane
  '\uD83D\uDE82': '', // 🚂 Train
  '\uD83D\uDE95': '', // 🚕 Taxi
  '\uD83D\uDE99': '', // 🚙 Car
  '\uD83D\uDE80': '', // 🚀 Rocket
  '\uD83C\uDFA8': '', // 🎨 Art
  '\uD83C\uDFAC': '', // 🎬 Clapper
  '\uD83C\uDFB5': '', // 🎵 Music
  '\uD83C\uDFB6': '', // 🎶 Notes
  '\uD83D\uDCF7': '', // 📷 Camera
  '\uD83D\uDCF9': '', // 📹 Video
  '\uD83D\uDCBB': '', // 💻 Computer
  '\uD83D\uDCF1': '', // 📱 Phone
  '\uD83D\uDCD1': '', // 📑 Bookmark
  '\uD83D\uDCCA': '', // 📊 Chart
  '\uD83D\uDCC9': '', // 📉 Chart down
  '\uD83D\uDCC8': '', // 📈 Chart up
  '\uD83C\uDFC1': '', // 🏁 Flag
  '\uD83C\uDFF3': '', // 🏳️ Flag
  '\uD83C\uDFC3': '', // 🏃 Running
  '\uD83D\uDCAA': '', // 💪 Muscle
  '\uD83D\uDC4C': '', // 👌 OK
  '\uD83E\uDD17': '', // 🤗 Hug
  '\uD83D\uDE0E': '', // 😎 Cool
  '\uD83D\uDE09': '', // 😉 Wink
  
  // Specific component icons
  '🛂': '', // Passport Control -> visa
  '✍️': '', // Writing -> study plan
  '😊': '', // Smile
  '🎓': '', // Graduation
  '🎯': '', // Target
  '📋': '', // Clipboard
  '🤖': '', // Robot -> AI
  '📝': '', // Memo
  '🎤': '', // Microphone -> Interview
  '💰': '', // Money
  '📤': '', // Upload/Export
  '⏰': '', // Alarm -> Reminder
  '📌': '', // Pin
  '🏫': '', // School
  '💡': '', // Lightbulb
  '📍': '', // Pin
  '🏆': '', // Trophy
  '👁': '', // Eye
  '🆕': '', // New
  '🏠': '', // House
  '⭐': '', // Star
  '🔗': '', // Link
  '❓': '', // Question
  '❌': '', // Cross
  '☎️': '', // Phone
  '📞': '', // Phone receiver
  '📱': '', // Mobile
  '🗣️': '', // Speaking -> D-4-1 label
  '📄': '', // Document
  '➕': '', // Plus
  '🔄': '', // Refresh
  '✅': '', // Check
  '➖': '', // Minus
  '⚠️': '', // Warning
  '🔴': '', // Red circle
  '🟡': '', // Yellow circle
  '🟢': '', // Green circle
  '🔵': '', // Blue circle
  '👤': '', // Person
  '🎒': '', // Backpack
  '📅': '', // Calendar
  '💪': '', // Muscle
  '🔍': '', // Magnifier
  '📚': '', // Books
  '📊': '', // Chart
  '⚡': '', // Lightning
  '🚀': '', // Rocket
  '💻': '', // Computer
  '🔧': '', // Wrench
  '📎': '', // Paperclip
  '📖': '', // Open book
  '✂️': '', // Scissors
  '📑': '', // Bookmark tabs
  '📁': '', // Folder
  '📂': '', // Open folder
  '📨': '', // Incoming envelope
  '📩': '', // Envelope with arrow
  '📬': '', // Open mailbox
  '📭': '', // Empty mailbox
  '📮': '', // Postbox
  '🗂️': '', // Card index dividers
  '📇': '', // Card index
  '📋': '', // Clipboard
  '📌': '', // Pin
  '📍': '', // Round pushpin
  '📎': '', // Paperclip
  '🖇️': '', // Linked paperclips
  '📏': '', // Straight ruler
  '📐': '', // Triangular ruler
  '✂️': '', // Scissors
  '🔒': '', // Lock
  '🔓': '', // Unlock
  '🔐': '', // Closed lock with key
  '🔑': '', // Key
  '🔏': '', // Lock with ink pen
  '🔒': '', // Locked
  '🔓': '', // Unlocked
  '🔐': '', // Lock + Key
  '🔑': '', // Key
  '🗝️': '', // Old key
  '🔨': '', // Hammer
  '🪛': '', // Screwdriver
  '🔧': '', // Wrench
  '🔩': '', // Nut and bolt
  '⚙️': '', // Gear
  '🗜️': '', // Clamp
  '⚖️': '', // Balance scale
  '🔗': '', // Link
  '⛓️': '', // Chains
  '🧰': '', // Toolbox
  '🧲': '', // Magnet
  '🧪': '', // Test tube
  '🧫': '', // Petri dish
  '🧬': '', // DNA
  '🔬': '', // Microscope
  '🔭': '', // Telescope
  '📡': '', // Satellite antenna
  '💉': '', // Syringe
  '💊': '', // Pill
  '🩸': '', // Drop of blood
  '🩹': '', // Adhesive bandage
  '🩺': '', // Stethoscope
  '🩻': '', // X-ray
  '🚑': '', // Ambulance
  '🚒': '', // Fire engine
  '🚓': '', // Police car
  '🚔': '', // Oncoming police car
  '🚨': '', // Police car light
  '🚥': '', // Horizontal traffic light
  '🚦': '', // Vertical traffic light
  '🚧': '', // Construction
  '⚓': '', // Anchor
  '⛵': '', // Sailboat
  '🚤': '', // Speedboat
  '🛳️': '', // Passenger ship
  '⛴️': '', // Ferry
  '🛥️': '', // Motor boat
  '✈️': '', // Airplane
  '🛩️': '', // Small airplane
  '🛫': '', // Airplane departure
  '🛬': '', // Airplane arrival
  '🪂': '', // Parachute
  '🚁': '', // Helicopter
  '🚂': '', // Locomotive
  '🚃': '', // Railway car
  '🚄': '', // High-speed train
  '🚅': '', // Bullet train
  '🚆': '', // Train
  '🚇': '', // Metro
  '🚈': '', // Light rail
  '🚉': '', // Station
  '🚊': '', // Tram
  '🚝': '', // Monorail
  '🚞': '', // Mountain railway
  '🚋': '', // Tram car
  '🚌': '', // Bus
  '🚍': '', // Oncoming bus
  '🚎': '', // Trolleybus
  '🚐': '', // Minibus
  '🚑': '', // Ambulance
  '🚒': '', // Fire engine
  '🚓': '', // Police car
  '🚔': '', // Oncoming police car
  '🚕': '', // Taxi
  '🚖': '', // Oncoming taxi
  '🚗': '', // Automobile
  '🚘': '', // Oncoming automobile
  '🚙': '', // Sport utility vehicle
  '🛻': '', // Pickup truck
  '🚚': '', // Delivery truck
  '🚛': '', // Articulated lorry
  '🚜': '', // Tractor
  '🏎️': '', // Racing car
  '🏍️': '', // Motorcycle
  '🛵': '', // Motor scooter
  '🛴': '', // Kick scooter
  '🚲': '', // Bicycle
  '🛹': '', // Skateboard
  
  // Specialty
  '🥇': '', // Gold medal
  '🥈': '', // Silver medal
  '🥉': '', // Bronze medal
  '🎖️': '', // Military medal
  '🏅': '', // Sports medal
  '🥇': '', // 1st
  '🥈': '', // 2nd
  '🥉': '', // 3rd
  
  // Numbers with emoji style
  '0️⃣': '', '1️⃣': '', '2️⃣': '', '3️⃣': '', '4️⃣': '',
  '5️⃣': '', '6️⃣': '', '7️⃣': '', '8️⃣': '', '9️⃣': '',
  '🔟': '',
};

// Special patterns - text labels to replace emoji in certain contexts
const TEXT_REPLACEMENTS = [
  // Button labels
  { from: '✨ Tạo nhanh', to: 'Tạo nhanh' },
  { from: '✨ Tự động', to: 'Tự động' },
  { from: '🎬 Bắt đầu', to: 'Bắt đầu' },
  
  // Common context patterns
  { from: '🆕 Mới', to: 'Mới' },
  { from: '🔥 Mới', to: 'Mới' },
  { from: '💥 Mới', to: 'Mới' },
  
  // Replace double spaces with single
  { from: '  ', to: ' ' },
];

function removeEmojis(text) {
  let result = text;
  
  // Apply text replacements first
  for (const rep of TEXT_REPLACEMENTS) {
    result = result.split(rep.from).join(rep.to);
  }
  
  // Replace each emoji in the map
  for (const [emoji, replacement] of Object.entries(REPLACEMENTS)) {
    // Escape special regex characters
    const escaped = emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    result = result.replace(regex, replacement);
  }
  
  // Clean up: remove leading spaces before text in HTML attributes
  // e.g., value=\" 🎓\" -> value=\"\"
  result = result.replace(/(["'])\s+/g, '$1');
  
  // Collapse multiple spaces into one
  result = result.replace(/ {2,}/g, ' ');
  
  // Clean up empty labels like '>  <' or '></button>'
  result = result.replace(/>\s*<\//g, '><');
  
  return result;
}

// Process all files
let totalChanges = 0;

for (const filePath of FILES) {
  try {
    const fullPath = path.resolve(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      continue;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const newContent = removeEmojis(content);
    
    if (content !== newContent) {
      const diff = content.length - newContent.length;
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`✅ ${filePath} — removed ~${diff} bytes`);
      totalChanges++;
    } else {
      console.log(`⏭️ ${filePath} — no changes`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${filePath}: ${err.message}`);
  }
}

console.log(`\n📊 Total files modified: ${totalChanges}/${FILES.length}`);
