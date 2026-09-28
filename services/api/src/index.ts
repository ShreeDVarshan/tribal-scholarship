import 'dotenv/config';
import { buildApp } from './app';
import fs from 'fs';
import path from 'path';

const PORT = parseInt(process.env.PORT || '5000');
const HOST = '0.0.0.0';

async function main() {
  // Ensure uploads directory exists
  const uploadsDir = process.env.UPLOAD_DIR || './uploads';
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`\n🚀 JANJATHI SHIKSHA SETU API`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🌐 Server:    http://localhost:${PORT}`);
    console.log(`📚 API Docs:  http://localhost:${PORT}/docs`);
    console.log(`🗄️  Database:  SQLite (dev.db)`);
    console.log(`🤖 AI:        ${process.env.AI_PROVIDER || 'mock'}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🎭 DEMO MODE`);
    console.log(`   Student: ${process.env.DEMO_STUDENT_MOBILE}`);
    console.log(`   OTP:     ${process.env.DEMO_OTP}`);
    console.log(`   Admin:   ${process.env.DEMO_ADMIN_EMAIL}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
