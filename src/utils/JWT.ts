export function decodeJWT(token: string) {
    const [header, payload, signature] = token.split('.');

    const buffer = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    return JSON.parse(buffer.toString());
}