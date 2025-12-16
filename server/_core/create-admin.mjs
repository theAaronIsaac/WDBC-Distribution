#!/usr/bin/env node

/**
 * Admin Account Creation Script
 * 
 * This script creates an admin account for the SR17018 website.
 * Run this after deploying to Railway to create your first admin user.
 * 
 * Usage:
 *   node create-admin.mjs
 * 
 * Or on Railway:
 *   railway run node create-admin.mjs
 */

import { createInterface } from 'readline';
import { createAdminUser } from './server/auth.ts';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n===========================================');
  console.log('SR17018 Admin Account Creation');
  console.log('===========================================\n');

  try {
    const email = await question('Enter admin email: ');
    
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address');
      process.exit(1);
    }

    const password = await question('Enter password (min 6 characters): ');
    
    if (!password || password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    const confirmPassword = await question('Confirm password: ');
    
    if (password !== confirmPassword) {
      console.error('❌ Passwords do not match');
      process.exit(1);
    }

    const name = await question('Enter admin name (optional): ');

    console.log('\n📝 Creating admin account...\n');

    const result = await createAdminUser(email, password, name || undefined);

    if (result.success) {
      console.log('✅ Admin account created successfully!');
      console.log(`\n📧 Email: ${email}`);
      console.log(`👤 Name: ${name || email.split('@')[0]}`);
      console.log(`🔑 User ID: ${result.userId}`);
      console.log('\n🎉 You can now log in at /login\n');
    } else {
      console.error(`❌ Failed to create admin account: ${result.error}`);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
