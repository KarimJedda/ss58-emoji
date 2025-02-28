/**
 * SS58 to Emoji Converter
 * Converts SS58 addresses to unique emoji sequences
 */
const EMOJIS = [
    '😆', '🤣', '😜', '🤪', '😎', '🤩', '🥳', '😇',
    '👻', '🤖', '🎃', '😺', '🐵', '🦄', '🐸', '🐉',
    '🍕', '🍔', '🍩', '🍦', '🎸', '🎮', '🚀', '⚡',
    '💥', '🔥', '🌈', '💫', '🎉', '🪄', '🎭', '🎯'
];

/**
 * Converts bytes to a bit array
 * @param {Uint8Array} bytes - Array of bytes to convert
 * @returns {number[]} Array of bits (0 or 1)
 */
function bytesToBits(bytes) {
    let bits = [];
    for (const byte of bytes) {
        for (let i = 7; i >= 0; i--) {
            bits.push((byte >> i) & 1);
        }
    }
    return bits;
}

/**
 * Converts a bit array to emoji sequence
 * @param {number[]} bits - Array of bits (0 or 1)
 * @returns {string} Emoji sequence
 */
function bitsToEmojis(bits) {
    const emojis = [];
    // Process in chunks of 5 bits (32 possible values)
    for (let i = 0; i < 13; i++) {
        const start = i * 5;
        const chunkBits = bits.slice(start, start + 5);
        let value = 0;
        for (const bit of chunkBits) {
            value = (value << 1) | bit;
        }
        emojis.push(EMOJIS[value % EMOJIS.length]);
    }
    return emojis.join('');
}

/**
 * Converts an SS58 address to a unique emoji sequence
 * @param {string} address - The SS58 address to convert
 * @returns {Promise<string>} A promise that resolves to the emoji sequence
 * @throws {Error} If the input is invalid or if crypto API is unavailable
 */
async function ss58ToEmoji(address) {
    if (!address || typeof address !== 'string') {
        throw new Error('Invalid SS58 address: must be a non-empty string');
    }
    
    // Basic format check - just ensure it's a reasonable length for an address
    if (address.length < 40) {
        throw new Error('Invalid address format: address is too short');
    }

    try {
        // Step 1: Compute SHA-256 hash of the address
        const encoder = new TextEncoder();
        const data = encoder.encode(address);
        
        // Handle both browser and Node.js environments
        let hashBuffer;
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            // Browser environment
            hashBuffer = await crypto.subtle.digest('SHA-256', data);
        } else if (typeof require === 'function') {
            // Node.js environment
            const crypto = require('crypto');
            const hash = crypto.createHash('sha256');
            hash.update(data);
            hashBuffer = hash.digest();
        } else {
            throw new Error('Crypto API not available');
        }
        
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const first8Bytes = hashArray.slice(0, 8);

        // Step 2: Convert bytes to a bit array
        let bits = bytesToBits(first8Bytes);

        // Step 3: Then pad with 4 zeros to get 68 bits (split into 13 chunks of 5 bits)
        bits.push(0, 0, 0, 0);

        // Step 4: Split into 13 chunks and map to emojis
        return bitsToEmojis(bits);
    } catch (error) {
        console.error('Error in ss58ToEmoji:', error);
        throw new Error(`Failed to convert SS58 to emoji: ${error.message}`);
    }
}


if (typeof window !== 'undefined' && window.document) {
    // Browser environment - add to window object
    window.ss58ToEmoji = ss58ToEmoji;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ss58ToEmoji };
}
