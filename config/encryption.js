/**
 * Encryption Configuration
 * AES-256 encryption untuk sensitive data
 */

const crypto = require('crypto');

const algorithm = process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc';
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY || 'a'.repeat(64), 'hex');

/**
 * Encrypt sensitive data
 */
const encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Combine IV and encrypted data
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt sensitive data
 */
const decrypt = (text) => {
  try {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash data (one-way, untuk passwords sudah handled oleh bcrypt)
 */
const hash = (text) => {
  return crypto
    .createHash('sha256')
    .update(text)
    .digest('hex');
};

/**
 * Generate random token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = {
  encrypt,
  decrypt,
  hash,
  generateToken
};
