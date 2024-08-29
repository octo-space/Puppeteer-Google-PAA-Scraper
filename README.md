# Puppeteer Google PAA Scraper

This project is a Node.js script that uses Puppeteer to automatically extract "People Also Ask" (PAA) questions from Google Search. The script loads a search result page and iteratively expands and logs all the questions found in the PAA section.


## How It Works

This project utilizes **Puppeteer**, a Node.js library that provides a high-level API to control Chrome or Chromium over the DevTools Protocol. Below is a step-by-step explanation of how the script works:

### 1. **Launching Puppeteer**
The script begins by launching a Puppeteer browser instance and creating a new page:

```javascript
const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();
```

The `{ headless: false }` option runs the browser with a visible UI, allowing you to observe the workflow.

### 2. **Performing a Google Search**
The script then navigates to a Google Search results page for a specific query:

```javascript
const query = 'What is Puppeteer?';
const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
await page.goto(searchUrl);
```

### 3. **Waiting for the PAA Section to Load**
It waits until the "People Also Ask" section is loaded:

```javascript
await page.waitForSelector('.related-question-pair');
```

### 4. **Collecting and Expanding Questions**
The script collects questions from the PAA section and clicks to load more questions:

```javascript
const newQuestions = await page.evaluate(async () => {
  const questions = [];
  const questionElements = document.querySelectorAll('.related-question-pair');

  for (let element of questionElements) {
    const questionTextElement = element.querySelector('span.CSkcDe');
    if (questionTextElement) {
      const questionText = questionTextElement.innerText;
      questions.push({
        text: questionText,
        clicked: false
      });

      const clickTarget = element.querySelector('div[jsname="Q8Kwad"]');
      if (clickTarget) {
        clickTarget.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }

  return questions;
});
```

### 5. **Adding New Questions to the Main List**
Newly found questions are added to the main list, and duplicates are filtered out:

```javascript
for (let question of newQuestions) {
  const exists = expandedQuestions.some(q => q.text === question.text);
  if (!exists) {
    expandedQuestions.push(question);
  }
}
```

### 6. **Checking the Time Limit**
If no new questions are loaded within a certain time limit, the loop breaks:

```javascript
const hasNewQuestions = newQuestions.length > 0;
if (!hasNewQuestions) {
  break;
}
```

### 7. **Logging the Collected Questions**
Once all questions are collected, they are logged to the console:

```javascript
const questionTexts = expandedQuestions.map(q => q.text);
console.log('All PAA Questions:', questionTexts);
```

### 8. **Closing the Browser**
Finally, the browser is closed:

```javascript
await browser.close();
```

### Summary
This script automatically collects and logs questions from Google's "People Also Ask" section within a time limit of one minute, using Puppeteer for automation.

## Additional Information

Here are some tips and additional information to help you use this project more effectively:

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
