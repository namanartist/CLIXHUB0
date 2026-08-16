// Script to generate Firebase service account key
// Uses the Firebase CLI's stored credentials to create a service account key
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECT_ID = 'clix-decf9';
const SA_EMAIL = `firebase-adminsdk-fbsvc@${PROJECT_ID}.iam.gserviceaccount.com`;
const OUTPUT_FILE = path.join(__dirname, '..', 'serviceAccountKey.json');

async function getFirebaseToken() {
  // Get access token from firebase CLI
  const token = execSync('npx firebase-tools@latest login:ci --no-localhost 2>&1 || echo ""', { encoding: 'utf8' }).trim();
  return token;
}

async function main() {
  console.log(`Generating service account key for ${PROJECT_ID}...`);
  console.log(`Service Account: ${SA_EMAIL}`);
  console.log('');

  // Try to use firebase CLI to get the token
  try {
    // Method 1: Direct approach - use google APIs with firebase token
    const tokenOutput = execSync('npx firebase-tools@latest login:list --json 2>&1', { encoding: 'utf8' });
    console.log('Firebase CLI auth status:', tokenOutput.trim());
  } catch (e) {
    console.log('Could not check firebase auth:', e.message);
  }

  console.log('');
  console.log('=========================================');
  console.log('MANUAL STEPS TO GET SERVICE ACCOUNT KEY:');
  console.log('=========================================');
  console.log('');
  console.log('1. Go to: https://console.firebase.google.com/project/clix-decf9/settings/serviceaccounts/adminsdk');
  console.log('2. Click "Generate new private key"');
  console.log('3. Click "Generate Key" in the confirmation popup');
  console.log('4. A JSON file will download to your computer');
  console.log(`5. Move/copy that file to: ${OUTPUT_FILE}`);
  console.log('');
  console.log('OR use this direct Google Cloud Console link:');
  console.log(`   https://console.cloud.google.com/iam-admin/serviceaccounts/details/${SA_EMAIL.split('@')[0]}%40${PROJECT_ID}.iam.gserviceaccount.com/keys?project=${PROJECT_ID}`);
  console.log('');

  // Check if the file already exists
  if (fs.existsSync(OUTPUT_FILE)) {
    console.log('✓ serviceAccountKey.json already exists!');
    try {
      const key = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      console.log(`  Project: ${key.project_id}`);
      console.log(`  Client Email: ${key.client_email}`);
      console.log(`  Key ID: ${key.private_key_id}`);
    } catch (e) {
      console.log('  Warning: File exists but could not be parsed');
    }
  } else {
    console.log('✗ serviceAccountKey.json NOT FOUND');
    console.log('  Please follow the steps above to generate it.');
  }
}

main().catch(console.error);
