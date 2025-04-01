import { beforeAll } from 'bun:test';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
beforeAll(() => {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
  
  // Add any additional setup needed for the tests
  console.log('Test environment setup complete');
}); 