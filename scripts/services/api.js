export const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};