#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const Handlebars = require('handlebars');

// Configuration
const LOCALES_DIR = './locales';
const TEMPLATES_DIR = './templates';
const OUTPUT_DIR = './dist';
const LANGUAGES = ['en', 'fr'];
const DEFAULT_LANG = 'en';

// Register Handlebars helpers
Handlebars.registerHelper('raw', function(options) {
  return options.fn(this);
});

Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('ne', function(a, b) {
  return a !== b;
});

Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

// Register partials
function registerPartials() {
  const partialsDir = path.join(TEMPLATES_DIR, 'partials');
  if (fs.existsSync(partialsDir)) {
    const partialFiles = fs.readdirSync(partialsDir);
    partialFiles.forEach(file => {
      if (file.endsWith('.hbs')) {
        const partialName = file.replace('.hbs', '');
        const partialContent = fs.readFileSync(path.join(partialsDir, file), 'utf8');
        Handlebars.registerPartial(partialName, partialContent);
      }
    });
  }
}

// Load language data
function loadTranslations(lang) {
  const filePath = path.join(LOCALES_DIR, `${lang}.yaml`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContent);
}

// Load and compile template
function compileTemplate(templateName) {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.hbs`);
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  return Handlebars.compile(templateContent);
}

// Get the other language for language switcher
function getOtherLang(currentLang) {
  return currentLang === 'en' ? 'fr' : 'en';
}

// Build pages for a specific language
function buildLanguage(lang) {
  console.log(`Building ${lang.toUpperCase()} version...`);
  
  // Load translations
  const translations = loadTranslations(lang);
  
  // Add language metadata
  const data = {
    ...translations,
    lang: lang,
    langCode: lang,
    otherLang: getOtherLang(lang),
    otherLangLabel: lang === 'en' ? 'Français' : 'English',
    isEnglish: lang === 'en',
    isFrench: lang === 'fr',
    baseUrl: lang === DEFAULT_LANG ? '' : `/${lang}`,
    langPath: lang === DEFAULT_LANG ? '' : `${lang}/`,
    rootPath: lang === DEFAULT_LANG ? './' : '../'
  };
  
  // Create output directory
  const outputDir = lang === DEFAULT_LANG ? OUTPUT_DIR : path.join(OUTPUT_DIR, lang);
  fs.ensureDirSync(outputDir);
  
  // List of templates to process
  const templates = ['index', 'quote', 'contact', 'imprint', 'privacy'];
  
  // Process each template
  templates.forEach(templateName => {
    try {
      const template = compileTemplate(templateName);
      // Add page-specific data
      const pageData = {
        ...data,
        pageName: templateName
      };
      const html = template(pageData);
      
      const outputPath = path.join(outputDir, `${templateName}.html`);
      fs.writeFileSync(outputPath, html);
      console.log(`  ✓ ${templateName}.html`);
    } catch (error) {
      console.error(`  ✗ Error processing ${templateName}: ${error.message}`);
    }
  });
}

// Create language selector/redirect page
function createRootRedirect() {
  const redirectHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Edelmetall Cham - Language Selection</title>
    <script>
        // Detect browser language and redirect
        var userLang = navigator.language || navigator.userLanguage;
        var lang = userLang.substring(0, 2).toLowerCase();
        
        // Default to English if language not supported
        if (lang !== 'fr') {
            lang = 'en';
        }
        
        // Redirect to appropriate language version
        if (lang === 'en') {
            window.location.href = './index.html';
        } else {
            window.location.href = './' + lang + '/index.html';
        }
    </script>
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
        }
        .lang-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
        }
        a {
            display: inline-block;
            padding: 15px 40px;
            background: #d4af37;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        a:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome / Bienvenue</h1>
        <p>Please select your language / Veuillez sélectionner votre langue</p>
        <div class="lang-buttons">
            <a href="./index.html">English</a>
            <a href="./fr/index.html">Français</a>
        </div>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'language.html'), redirectHTML);
  console.log('✓ Language selector page created');
}

// Copy assets (shared between languages)
function copyAssets() {
  console.log('Copying assets...');
  
  // Copy existing assets folder
  if (fs.existsSync('./assets')) {
    fs.copySync('./assets', path.join(OUTPUT_DIR, 'assets'));
    console.log('  ✓ Assets copied');
  }
  
  // Note: styles.css is already in dist folder, no need to copy
  // Just verify it exists
  if (fs.existsSync(path.join(OUTPUT_DIR, 'styles.css'))) {
    console.log('  ✓ Styles already in place');
  }
  
  // Copy robots.txt
  if (fs.existsSync('./robots.txt')) {
    fs.copySync('./robots.txt', path.join(OUTPUT_DIR, 'robots.txt'));
    console.log('  ✓ robots.txt copied');
  }
}

// Main build function
async function build() {
  console.log('🚀 Starting multilingual build...\n');
  
  try {
    // Register partials first
    registerPartials();
    // Clean dist directory (preserve styles.css if it exists)
    const stylesPath = path.join(OUTPUT_DIR, 'styles.css');
    const hasStyles = fs.existsSync(stylesPath);
    let stylesContent;
    
    if (hasStyles) {
      stylesContent = fs.readFileSync(stylesPath, 'utf8');
    }
    
    // Build each language
    for (const lang of LANGUAGES) {
      buildLanguage(lang);
    }
    
    // Restore styles if they existed
    if (hasStyles) {
      fs.writeFileSync(stylesPath, stylesContent);
    }
    
    // Create root redirect page
    createRootRedirect();
    
    // Copy assets
    copyAssets();
    
    console.log('\n✅ Build completed successfully!');
    console.log(`\nLanguage versions available at:`);
    console.log(`  - English: ${OUTPUT_DIR}/index.html`);
    console.log(`  - French: ${OUTPUT_DIR}/fr/index.html`);
    console.log(`  - Language selector: ${OUTPUT_DIR}/language.html`);
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run build
build();