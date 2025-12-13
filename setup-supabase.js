#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔧 Configuração Automática do Supabase para o Renova');
console.log('=' .repeat(50));

// Configurações padrão do seu Supabase
const supabaseConfig = {
  url: 'https://supa.techstorebrasil.com',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.N2nG61tlUEcrIqkCTnHLABlAo4z8fcl6an30W40fdac',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6Aic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.1w168CO-icK3_NsOLyNllE35tVAKmv5ygfnE_AgbMGs'
};

// Configurar API
const apiEnvPath = path.join(__dirname, 'apps/api/.env');
let apiEnvContent = fs.readFileSync(apiEnvPath, 'utf8');

// Atualizar variáveis do Supabase
apiEnvContent = apiEnvContent.replace(
  /SUPABASE_URL=.*/,
  `SUPABASE_URL=${supabaseConfig.url}`
);
apiEnvContent = apiEnvContent.replace(
  /SUPABASE_ANON_KEY=.*/,
  `SUPABASE_ANON_KEY=${supabaseConfig.anonKey}`
);
apiEnvContent = apiEnvContent.replace(
  /SUPABASE_SERVICE_ROLE_KEY=.*/,
  `SUPABASE_SERVICE_ROLE_KEY=${supabaseConfig.serviceRoleKey}`
);
apiEnvContent = apiEnvContent.replace(
  /DATABASE_TYPE=.*/,
  'DATABASE_TYPE=supabase'
);

fs.writeFileSync(apiEnvPath, apiEnvContent);
console.log('✅ API configurada com as credenciais do Supabase');

// Configurar frontend (localStorage padrão)
const frontendConfig = {
  url: supabaseConfig.url,
  anonKey: supabaseConfig.anonKey
};

const configScript = `
// Configuração automática do Supabase para o Renova
localStorage.setItem('renova:supabase:url', '${frontendConfig.url}');
localStorage.setItem('renova:supabase:key', '${frontendConfig.anonKey}');
localStorage.setItem('renova:use_supabase', 'true');
console.log('🔄 Supabase configurado automaticamente no frontend');
`;

const configPath = path.join(__dirname, 'supabase-auto-config.js');
fs.writeFileSync(configPath, configScript);

console.log('\n📋 Configuração concluída!');
console.log('\nCredenciais configuradas:');
console.log(`  URL: ${supabaseConfig.url}`);
console.log(`  Chave Anônima: ${supabaseConfig.anonKey.substring(0, 20)}...`);
console.log(`  Tipo de Banco: Supabase`);
console.log('\nPara aplicar a configuração no frontend:');
console.log('1. Abra o console do navegador (F12)');
console.log(`2. Execute: node ${configPath}`);
console.log('\nOu manualmente nas configurações do perfil.');
console.log('\n⚠️  Certifique-se de ter executado o SQL de migração no Supabase:');
console.log('   apps/api/supabase-migration.sql');
