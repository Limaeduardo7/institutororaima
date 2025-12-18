#!/usr/bin/env node

/**
 * Script para sincronizar variáveis do .env para Netlify
 *
 * Uso: node scripts/sync-env-to-netlify.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ler arquivo .env
const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ Arquivo .env não encontrado!');
  console.log('📝 Crie um arquivo .env na raiz do projeto');
  process.exit(1);
}

console.log('📖 Lendo arquivo .env...\n');

const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');

let count = 0;
let errors = 0;

for (const line of lines) {
  // Ignorar linhas vazias e comentários
  if (!line.trim() || line.trim().startsWith('#')) {
    continue;
  }

  // Parse da linha KEY=VALUE
  const match = line.match(/^([^=]+)=(.*)$/);
  if (!match) {
    continue;
  }

  const [, key, value] = match;
  const trimmedKey = key.trim();
  const trimmedValue = value.trim();

  // Remover aspas se existirem
  const cleanValue = trimmedValue.replace(/^["'](.*)["']$/, '$1');

  if (!trimmedKey || !cleanValue) {
    continue;
  }

  console.log(`⚙️  Configurando: ${trimmedKey}`);

  try {
    // Executar comando netlify env:set
    execSync(`netlify env:set ${trimmedKey} "${cleanValue}"`, {
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    console.log(`✅ ${trimmedKey} configurado com sucesso\n`);
    count++;
  } catch (error) {
    console.error(`❌ Erro ao configurar ${trimmedKey}`);
    console.error(error.message);
    errors++;
  }
}

console.log('\n' + '='.repeat(50));
console.log(`✅ ${count} variáveis configuradas com sucesso`);
if (errors > 0) {
  console.log(`❌ ${errors} erros encontrados`);
}
console.log('='.repeat(50));

console.log('\n📦 Próximos passos:');
console.log('1. npm run build');
console.log('2. netlify deploy --prod');
