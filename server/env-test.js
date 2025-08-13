// Test script to verify environment variables are loading correctly
// Run this with: node env-test.js

require('dotenv').config();

console.log('🔍 Environment Variables Check:');
console.log('================================');

const envVars = [
    'PORT',
    'NODE_ENV',
    'MONGODB_URI',
    'REDIS_URL',
    'JWT_SECRET',
    'DEEPSEEK_API_KEY',
    'DEEPSEEK_API_URL',
    'IG_USERNAME',
    'IG_PASSWORD',
    'X_USERNAME',
    'X_PASSWORD',
    'FB_USERNAME',
    'FB_PASSWORD'
];

envVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅' : '❌';
    const displayValue = value ? (varName.includes('PASSWORD') || varName.includes('SECRET') || varName.includes('KEY') ?
        `${value.substring(0, 4)}***${value.substring(value.length - 4)}` : value) : 'NOT SET';

    console.log(`${status} ${varName}: ${displayValue}`);
});

console.log('\n🚀 If all important variables show ✅, your .env file is working correctly!');
console.log('\n💡 Note: Make sure your .env file is in the server directory (not the root).');