export const getAssetsFile = (url: string) => {
	return new URL(`../assets/img/${url}`, import.meta.url).href
}
