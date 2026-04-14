/**
 * Preloads a single image by creating an off-screen Image element.
 * Resolves when the image is fully decoded, rejects on failure.
 */
export const preLoadImage = (src: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
    });
};

/**
 * Preloads an array of image sources in parallel.
 * Logs errors but does not reject — partial loads are acceptable.
 */
export const preLoadImages = async (sources: string[]): Promise<void> => {
    try {
        await Promise.all(sources.map(preLoadImage));
    } catch (error) {
        console.error(error);
    }
};