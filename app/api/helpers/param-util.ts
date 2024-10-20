export function getSearchParams(request) {
    const url = new URL(request.url);
    return new URLSearchParams(url.search);
}