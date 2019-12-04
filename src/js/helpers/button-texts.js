export const buttonTextsSurprised = ['Oh sick', 'Cool', 'Nice', 'Awesome', 'Great thanks', 'Amazing', 'Wow', 'Insane', 'Splendid', 'Far out', 'Good to know', 'No way', 'Yey algorithms!'];
export const buttonTextsUnderstanding = ['Ah I see', 'Ok thanks!', 'Gotcha.', 'Now I get it', 'Muchas gracias'];
export const buttonTextsCancel = ['Never mind', 'No thanks', 'I changed my mind'];

export function getRandomButtonText (buttonTexts) {
  return buttonTexts[Math.floor(Math.random() * buttonTexts.length)];
}