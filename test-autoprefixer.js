// test-autoprefixer.js
import autoprefixer from 'autoprefixer';

try {
  console.log('Autoprefixer loaded successfully!');
  console.log('Version:', autoprefixer.info);
} catch (error) {
  console.error('Failed to load autoprefixer:', error.message);
}
