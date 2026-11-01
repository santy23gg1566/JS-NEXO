// Comprobación rápida de archivos sin herramientas de pago.
import { readFileSync, existsSync } from 'node:fs';
import { Script } from 'node:vm';
for(const name of ['public/index.html','public/admin/index.html']){
  if(!existsSync(name))throw Error(`Falta ${name}`);
  const html=readFileSync(name,'utf8');
  const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
  for(const code of scripts)new Script(code,{filename:name});
  console.log(`OK sintaxis: ${name} (${scripts.length} script)`);
}
for(const name of ['netlify/functions/api.mjs','netlify/functions/seed.mjs','netlify.toml','public/assets/watch.svg','public/assets/favicon.svg']){
  if(!existsSync(name))throw Error(`Falta ${name}`);
}
const site=readFileSync('public/index.html','utf8');
for(const id of ['productGrid','filters','cartSheet','settingsSheet','sendOrder','catalogNotice']){
  if(!site.includes(`id="${id}"`))throw Error(`Falta el componente: ${id}`);
}
const server=readFileSync('netlify/functions/api.mjs','utf8');
if(!server.includes('jsnexo-catalog-v1')||!server.includes('jsnexo-images-v1'))throw Error('Los nombres del almacenamiento cambiaron.');
console.log('OK integridad: JS NEXO tienda + admin + servidor');
