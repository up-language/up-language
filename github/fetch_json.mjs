import ky from 'https://esm.sh/ky';

export async function fetch_json(url) {
    const json = await ky(url).json();
    return json;
}