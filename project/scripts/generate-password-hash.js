#!/usr/bin/env node

/**
 * Script to generate a bcrypt password hash for use in .env
 *
 * Usage: node scripts/generate-password-hash.js <your-password>
 *
 * Example: node scripts/generate-password-hash.js MySecurePassword123!
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Please provide a password as an argument');
  console.log('\n📝 Usage: node scripts/generate-password-hash.js <your-password>');
  console.log('📝 Example: node scripts/generate-password-hash.js MySecurePassword123!');
  process.exit(1);
}

// Validate password strength
const errors = [];

if (password.length < 12) {
  errors.push('⚠️  Password should be at least 12 characters long');
}

if (!/[A-Z]/.test(password)) {
  errors.push('⚠️  Password should contain at least one uppercase letter');
}

if (!/[a-z]/.test(password)) {
  errors.push('⚠️  Password should contain at least one lowercase letter');
}

if (!/[0-9]/.test(password)) {
  errors.push('⚠️  Password should contain at least one number');
}

if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
  errors.push('⚠️  Password should contain at least one special character');
}

if (errors.length > 0) {
  console.log('⚠️  Password Strength Warnings:\n');
  errors.forEach(error => console.log(error));
  console.log('\n');
}

console.log('🔐 Generating secure password hash...\n');

const saltRounds = 12; // Higher = more secure but slower

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('❌ Error generating hash:', err);
    process.exit(1);
  }

  console.log('✅ Password hash generated successfully!\n');
  console.log('📋 Add this to your .env file:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
  console.log('💡 Remember to:');
  console.log('   1. Remove or comment out ADMIN_PASSWORD from .env');
  console.log('   2. Never commit .env to version control');
  console.log('   3. Use different passwords for development and production\n');
});
