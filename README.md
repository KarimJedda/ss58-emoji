# SS58-Emoji

Convert SS58 addresses to unique emoji sequences for easy visual identification and comparison. 

Note: this is a project mainly focused around fun visual elements, and not focused on security. Do not use this in a productive setting. 

## Overview

SS58-Emoji converts Substrate-based blockchain addresses (SS58 format) into memorable sequences of emojis. This can be useful for:

- Quick visual verification of addresses
- Making addresses more human-friendly and memorable
- Adding a fun visual element to blockchain applications


## How It Works

1. The SS58 address is hashed using SHA-256
2. The first 8 bytes (64 bits) of the hash are extracted
3. These bytes are converted to bits and padded to 68 bits
4. The bits are split into 13 chunks of 5 bits each
5. Each 5-bit chunk is mapped to one of 32 emojis
6. The resulting 13 emojis form a unique visual identifier for the address

Note: The collision probability is extremely low, but it's still possible to find a collision if you generate enough different emoji sequences. PRs / improvements welcome! 

## Usage

### Browser

```html
<script src="dotemoji.js"></script>
<script>
  ss58ToEmoji('5Djp7aeHcGdqjeosdPUEKUxiTYQZcV2JnPpQmdA8nfvbmNnK')
    .then(emoji => {
      console.log(emoji);
    })
    .catch(error => {
      console.error('Error:', error);
    });
</script>
```

You can also use Polkadot addresses:

```javascript
ss58ToEmoji('12pDATAH2rCakrYjo6UoYFtmTEUpSyePTum8U5x9QdySZuqn')
  .then(emoji => {
    console.log(emoji); // Same public key will produce the same emoji sequence regardless of SS58 format
  });
```

### Node.js

```javascript
const { ss58ToEmoji } = require('./dotemoji.js');

ss58ToEmoji('5Djp7aeHcGdqjeosdPUEKUxiTYQZcV2JnPpQmdA8nfvbmNnK')
  .then(emoji => {
    console.log(emoji); 
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Web Interface

The included `index.html` provides a user-friendly web interface:

1. Enter any SS58 address format in the input field
2. Click "Convert" to generate the emoji sequence
3. The tool will automatically normalize different address formats
4. Copy the emoji sequence with the "Copy" button

## Example Output

SS58 Address: `5Djp7aeHcGdqjeosdPUEKUxiTYQZcV2JnPpQmdA8nfvbmNnK`  
Emoji: `🤣🎃🥳🎃🤪🎯😇😺💫🌈🐵🐉🚀`

## License

MIT
