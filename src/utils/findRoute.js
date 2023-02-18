/**
 * Finds the best match from given url and array of routes
 *
 * @param {string} url
 * @param {string[]} routes
 * @returns {string} Best match
 */
module.exports = function findRoute(url, routes) {
  let bestMatch = null;
  let bestScore = 0;

  for (const route in routes) {
    const score = computeMatchScore(url, route);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = routes[route];
    }
  }

  return bestMatch;
};

function computeMatchScore(inputString, optionString) {
  let score = 0;
  for (let i = 0; i < inputString.length; i++) {
    if (optionString.indexOf(inputString[i]) !== -1) score++;
    else break;
  }
  return score;
}
