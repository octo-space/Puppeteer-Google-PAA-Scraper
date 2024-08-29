# Puppeteer Google PAA Scraper

This project is a Node.js script that uses Puppeteer to automatically extract "People Also Ask" (PAA) questions from Google Search. The script loads a search result page and iteratively expands and logs all the questions found in the PAA section.

## Additional Information

### 1. **Customization**
- **Search Query**: You can change the search query by modifying the `const query = 'What is Puppeteer?'` line.
- **Time Limit**: Customize the time limit by modifying the `const timeLimit = 60 * 1000;` line. It is currently set to 1 minute.

### 2. **Using a Different Browser Setup**
This script is designed to work with Chrome or Chromium. If you want to use a different browser, you'll need to add the appropriate options in `puppeteer.launch()`.

### 3. **Debugging Tips**
- **Headless Mode Issues**: If you encounter issues while running the script in headless mode, try setting `{ headless: true }` to `false` for troubleshooting.
- **Logging**: You can add additional logs using `console.log()` at various points to help identify where issues may be occurring.

### 4. **Google Rate Limiting**
When interacting with Google, be aware that they may block or CAPTCHA multiple automated requests. To avoid this, ensure adequate delay between requests or consider using Puppeteer's **stealth** plugin.

### 5. **License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
