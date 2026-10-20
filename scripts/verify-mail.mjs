// Connection/authentication check only; this never sends an email or prints secrets.
import nextEnv from '@next/env';
import nodemailer from 'nodemailer';
import { gmailConfiguration } from '../src/lib/mail-config.ts';
nextEnv.loadEnvConfig(process.cwd());
const configuration = gmailConfiguration(process.env);
if (!configuration) { console.error('Set GMAIL_USER and a 16-character Google app password in .env.local.'); process.exit(1); }
const transport = nodemailer.createTransport(configuration);
try { await transport.verify(); console.log('Gmail TLS connection and authentication verified. No email sent.'); }
catch (error) { console.error(JSON.stringify({ verified: false, code: error.code, responseCode: error.responseCode, command: error.command })); process.exitCode = 1; }
finally { transport.close(); }
