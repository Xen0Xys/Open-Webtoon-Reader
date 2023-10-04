/* eslint-disable no-undef */
const argon2 = require("argon2");
const crypto = require("crypto");

/**
 * Hashes a content like passwords with Argon2
 * @param content The content to hash
 * @returns {string} The hashed content
 */
async function hash(content) {
    return argon2.hash(content, {
        type: argon2.argon2i,
        timeCost: 10
    });
}

/**
 * Compares a hashed content with a plain text content
 * @param hash The hashed content
 * @param content The plain text content
 * @returns {boolean} True if the content matches the hash, false otherwise
 */
async function compareHash(hash, content) {
    try {
        return await argon2.verify(hash, content);
    } catch (e) {
        return false;
    }
}

/**
 * Encrypts a content with AES-256-CBC
 * @param content The content to encrypt
 * @returns {Promise<string>} The encrypted content
 */
async function encrypt(content) {
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(process.env.ENCRYPTION_KEY, salt, 100000, 32, "sha512");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(content, "utf-8", "hex");
    encrypted += cipher.final("hex");
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(`${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}`);
    const digest = hmac.digest("hex");
    return `${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}:${digest}`;
}

/**
 * Decrypts a content with AES-256-CBC
 * @param encryptedContent The encrypted content
 * @returns {Promise<string>} The decrypted content
 */
async function decrypt(encryptedContent) {
    const [saltString, ivString, encryptedString, digest] = encryptedContent.split(":");
    const salt = Buffer.from(saltString, "hex");
    const key = crypto.pbkdf2Sync(process.env.ENCRYPTION_KEY, salt, 100000, 32, "sha512");
    const iv = Buffer.from(ivString, "hex");
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(`${saltString}:${ivString}:${encryptedString}`);
    const calculatedDigest = hmac.digest("hex");
    if (calculatedDigest !== digest)
        throw new Error("Integrity check failed");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedString, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}

/**
 * Gets the signature of a content with SHA-512
 * @param content The content to sign with SHA-512
 * @returns {string} The SHA512 signature
 */
function getSignature(content){
    return crypto.createHash("sha512").update(content).digest("hex");
}

module.exports = {
    hash,
    compareHash,
    encrypt,
    decrypt,
    getSignature
};
