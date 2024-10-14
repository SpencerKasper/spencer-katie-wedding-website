import crypto from 'crypto';

const getEncryptionKey = () => crypto.createHash('sha256')
    .update(String(process.env.WEDDING_ENCRYPTION_KEY))
    .digest('base64')
    .substr(0, 32);

export const encrypt = ({textToEncrypt}) => {
    const initializationVector = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        getEncryptionKey(),
        initializationVector
    );
    console.error(textToEncrypt);
    let encrypted = cipher.update(textToEncrypt);
    encrypted += cipher.final('hex');
    return Buffer.concat([initializationVector, Buffer.from(encrypted, 'hex')]).toString('base64');
}

export const decrypt = ({textToDecrypt}) => {
    const buffer = Buffer.from(textToDecrypt, 'base64');
    const iv = buffer.slice(0, 16);
    const encrypted = buffer.slice(16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', getEncryptionKey(), iv);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}