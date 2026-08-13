const NONCE_LENGTH = 12;
const TAG_LENGTH = 16;

const key = new Uint8Array([
    49, 102, 188, 28,
    185, 45, 55, 146,
    169, 192, 33, 130,
    139, 52, 237, 237,
    211, 113, 248, 185,
    228, 35, 92, 254,
    16, 2, 114, 139,
    148, 159, 172, 142
]);

export async function encryptString(
    plainText: string
): Promise<string> {

    const nonce = generateRandomBytes(NONCE_LENGTH);

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        {
            name: "AES-GCM"
        },
        false,
        ["encrypt"]
    );

    const plainBytes = new TextEncoder().encode(plainText);

    // Web Crypto returns ciphertext + authentication tag
    const encrypted = new Uint8Array(
        await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: nonce,
                tagLength: TAG_LENGTH * 8
            },
            cryptoKey,
            plainBytes
        )
    );

    const cipherLength = encrypted.length - TAG_LENGTH;

    const cipher = encrypted.slice(0, cipherLength);
    const tag = encrypted.slice(cipherLength);

    // Same layout as your C# code:
    // [nonce][tag][cipher]
    const all = new Uint8Array(
        nonce.length +
        tag.length +
        cipher.length
    );

    all.set(nonce, 0);
    all.set(tag, nonce.length);
    all.set(cipher, nonce.length + tag.length);

    return bytesToBase64(all);
}

export async function decryptString(base64Input: string): Promise<string> {
    const all = base64ToBytes(base64Input);

    const nonce = all.slice(0, 12);
    const tag = all.slice(12, 28);
    const cipher = all.slice(28);

    // Web Crypto:
    // ciphertext + authentication tag
    const encrypted = new Uint8Array(
        cipher.length + tag.length
    );

    encrypted.set(cipher, 0);
    encrypted.set(tag, cipher.length);

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        {
            name: "AES-GCM"
        },
        false,
        ["decrypt"]
    );

    const plain = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: nonce,
            tagLength: 128
        },
        cryptoKey,
        encrypted
    );

    return new TextDecoder().decode(plain);
}

function bytesToBase64(bytes: Uint8Array): string {
    let binary = "";

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64);

    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}

function generateRandomBytes(length: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length));
}