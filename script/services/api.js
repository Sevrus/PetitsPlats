/**
 *
 * @param url
 * @returns {Promise<any|null>}
 */
export const fetchData = async (url) => {
    try {
        if (!url || typeof url !== 'string') {
            throw new Error("Une URL valide est requise.");
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();

        if (typeof data !== 'object') {
            throw new Error("Les données reçues ne sont pas au format JSON.");
        }

        return data;

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error.message);
        return null;
    }
};