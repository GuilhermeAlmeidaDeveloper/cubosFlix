const api = axios.create({
    baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev/3',
    timeout: 1000,
    headers: { 'Content-type': 'Application/json' }
});