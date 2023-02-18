/**
 * Finds the first route in the given array that matches the given URL.
 *
 * @param {string} url
 * @param {string[]} routes
 * @returns {object|null}
 */
module.exports = function matchRoute(url, routes) {
  for (const route of routes) {
    const routeParts = route.split('/');
    const urlParts = url.split('/');
    if (urlParts.length !== routeParts.length) continue;

    let isMatch = true;
    const params = {};

    for (let i = 0; i < urlParts.length; i++) {
      const urlPart = urlParts[i];
      const routePart = routeParts[i];

      if (routePart.startsWith(':')) {
        const paramName = routePart.slice(1);
        params[paramName] = urlPart;
      } else if (urlPart !== routePart) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      return { route, params };
    }
  }

  return null;
};
