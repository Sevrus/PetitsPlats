/**
 * Fetches data from the specified URL and parses it as JSON.
 *
 * This function:
 * - Performs a `fetch` request to the provided `url`.
 * - Parses the response as JSON and returns it.
 * - Logs an error in the console if the fetch operation fails.
 *
 * @param {string} url - The URL of the resource to fetch data from.
 * @returns {Promise<any>} A promise that resolves to the parsed JSON data from the response.
 *                          If an error occurs, the promise resolves to `undefined`.
 */
export const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};