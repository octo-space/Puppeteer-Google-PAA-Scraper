const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const query = 'What is Puppeteer?';
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  await page.goto(searchUrl);

  // Wait for the PAA section to load
  await page.waitForSelector('.related-question-pair');

  // Get the start time to enforce the time limit
  const startTime = Date.now();
  const timeLimit = 60 * 1000; // 1 minute in milliseconds

  const expandedQuestions = [];
  const clickedQuestions = new Set(); // Track questions that have been clicked

  while (Date.now() - startTime < timeLimit) {
    const newQuestions = await page.evaluate(async (clickedQuestions) => {
      const questions = [];
      const questionElements = document.querySelectorAll('.related-question-pair');

      for (let element of questionElements) {
        const questionTextElement = element.querySelector('span.CSkcDe');
        if (questionTextElement) {
          const questionText = questionTextElement.innerText;

          // Only proceed if this question hasn't been clicked yet
          if (!clickedQuestions.includes(questionText)) {
            questions.push(questionText);

            // Click the correct element to load more questions
            const clickTarget = element.querySelector('div[jsname="Q8Kwad"]');
            if (clickTarget) {
              clickTarget.click();
              await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for new questions to load

              // Close the question by clicking it again
              clickTarget.click();
              await new Promise(resolve => setTimeout(resolve, 500)); // Shorter delay for closing
            }
          }
        }
      }

      return questions;
    }, Array.from(clickedQuestions));

    // Add newly found questions to the main list and mark them as clicked
    for (let question of newQuestions) {
      if (!expandedQuestions.includes(question)) {
        expandedQuestions.push(question);
        clickedQuestions.add(question); // Mark this question as clicked
      }
    }

    // If no new questions were found, break the loop
    if (newQuestions.length === 0) {
      break;
    }
  }

  // Extract and log only the text of the questions
  console.log('All PAA Questions:', expandedQuestions);

  await browser.close();
})();
