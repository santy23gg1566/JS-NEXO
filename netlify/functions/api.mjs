import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { SEED } from './seed.mjs';
import { WATCHES } from './watches.mjs';

const publicHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
};
const COOKIE='jsn_session';
const html=(obj,status=200,extra={})=>Response.json(obj,{status,headers:{...publicHeaders,...extra}});
const failure=(msg,status=400)=>html({ok:false,error:msg},status);
const secret=()=>process.env.JS_ADMIN_SECRET||'';
const password=()=>process.env.JS_ADMIN_PASSWORD||'';
function secureEqual(a,b){
  if(typeof a!=='string'||typeof b!=='string')return false;
  const key=secret()||'missing-secret';
  const x=createHmac('sha256',key).update(a).digest();
  const y=createHmac('sha256',key).update(b).digest();
  return timingSafeEqual(x,y);
}
function sign(payload){return createHmac('sha256',secret()+password()).update(payload).digest('base64url')}
function makeSession(){const p=`${Date.now()+12*60*60*1000}.${randomUUID()}`;return `${p}.${sign(p)}`}
function authenticated(req){
  if(!secret()||!password())return false;
  const raw=(req.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(`${COOKIE}=`));
  if(!raw)return false;
  const token=raw.slice(COOKIE.length+1);
  const i=token.lastIndexOf('.'); if(i<=0)return false;
  const payload=token.slice(0,i),hash=token.slice(i+1);
  if(!secureEqual(hash,sign(payload)))return false;
  const exp=Number(payload.split('.')[0]);
  return Number.isFinite(exp)&&exp>Date.now()&&exp<Date.now()+12*60*60*1000+60000;
}
function cookieFor(value,maxAge){return `${COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`}
function originOK(req){const origin=req.headers.get('origin');if(!origin)return false;try{return new URL(origin).origin===new URL(req.url).origin}catch{return false}}
function catalogStore(){return getStore({name:'jsnexo-catalog-v1',consistency:'strong'})}
function photoStore(){return getStore('jsnexo-images-v1')}
function rateStore(){return getStore({name:'jsnexo-login-v1',consistency:'strong'})}
function throttleKey(req,context){const ip=context?.ip||req.headers.get('x-nf-client-connection-ip')||'unknown';return `login-${createHmac('sha256',secret()).update(ip).digest('hex').slice(0,32)}`}
function cleanString(v,max=300){return typeof v==='string'?v.trim().slice(0,max):''}
function imagePathValid(v){return v===''||/^assets\/[a-z0-9_-]+\.(?:svg|png|jpg|jpeg|webp)$/i.test(v)||/^\/\.netlify\/functions\/api\?action=image&id=[0-9a-f-]{36}$/i.test(v)}
function safeId(v){return typeof v==='string'&&/^[a-zA-Z0-9_-]{1,42}$/.test(v)}
function withWatchCollection(data){
  // Inserta la colección de relojes una sola vez, sin sobrescribir ediciones reales.
  // Retira únicamente las demostraciones SIN MODIFICAR que traía la plantilla.
  const original=data||SEED;
  if(original.watchCollectionImported===true)return original;
  const demoNames=new Map([
    ['js01','Noir Classic'],['js02','Silver Edition'],['js03','Pulse Smart'],
    ['js04','Active Motion'],['js05','Air Mini'],['js06','Studio Headset'],
    ['js07','Power Cube'],['js08','Desk Stand']
  ]);
  const existing=(original.products||[]).filter(p=>demoNames.get(p.id)!==p.name);
  const ids=new Set(existing.map(p=>p.id));
  return {...original,published:true,watchCollectionImported:true,
    products:[...WATCHES.filter(p=>!ids.has(p.id)),...existing]};
}
function validate(input){
  if(!input||typeof input!=='object')throw Error('Se requiere un catálogo válido.');
  if(!input.site||typeof input.site!=='object')throw Error('Faltan los datos del negocio.');
  if(!Array.isArray(input.products)||input.products.length>150)throw Error('Máximo 150 productos.');
  if(!Array.isArray(input.categories)||input.categories.length<2||input.categories.length>30)throw Error('Lista de categorías inválida.');
  const categories=input.categories.map((c)=>{
    if(!Array.isArray(c)||!safeId(c[0]))throw Error('Identificador de categoría inválido.');
    const label=cleanString(c[1],52);
    if(!label)throw Error('La categoría necesita un nombre.');
    return [c[0],label];
  });
  if(categories[0][0]!=='all')throw Error('La primera categoría debe ser Todas.');
  const ids=new Set(categories.map(x=>x[0]));if(ids.size!==categories.length)throw Error('Hay categorías repetidas.');
  const productIDs=new Set();
  const products=input.products.map((p)=>{
    if(!p||!safeId(p.id)||productIDs.has(p.id))throw Error('Identificador de producto inválido o repetido.');
    productIDs.add(p.id);
    if(!ids.has(p.category)||p.category==='all')throw Error('Categoría de producto inválida.');
    const name=cleanString(p.name,100);if(!name)throw Error('Falta el nombre de un producto.');
    // null means 'consultar', without inventing an unprovided price or stock.
    const price=(p.price==null||p.price==='')?null:Number(p.price);
    const stock=(p.stock==null||p.stock==='')?null:Number(p.stock);
    if(price!==null&&(!Number.isFinite(price)||price<0||price>10000000))throw Error('Precio inválido.');
    if(stock!==null&&(!Number.isInteger(stock)||stock<0||stock>999999))throw Error('Stock inválido.');
    const image=cleanString(p.image,250);if(!imagePathValid(image))throw Error('La imagen debe subirse desde el panel o usar un archivo assets válido.');
    return {id:p.id,name,category:p.category,price:price===null?null:Math.round(price*100)/100,stock,image,description:cleanString(p.description,1600),badge:cleanString(p.badge,35),featured:!!p.featured,visible:p.visible!==false};
  });
  const d=SEED.site,s=input.site;
  const site={};
  for(const field of ['brand','tagline','heroEyebrow','heroTop','heroOutline','heroAccent','heroLead','shopHeroTop','shopHeroOutline','shopHeroAccent','aboutHeroTop','aboutHeroOutline','aboutHeroAccent','contactHeroTop','contactHeroAccent','homeFeature1Title','homeFeature1Text','homeFeature2Title','homeFeature2Text','homeFeature3Title','homeFeature3Text','shopIntro','aboutIntro','aboutTitle','aboutText','contactIntro','footerText','banner']){
    site[field]=cleanString(s[field]??d[field],field==='heroLead'||field==='aboutText'?700:field==='contactIntro'||field==='shopIntro'?350:160);
  }
  site.whatsapp=cleanString(s.whatsapp??d.whatsapp,24).replace(/\D/g,'');
  if(site.whatsapp.length<10||site.whatsapp.length>15)throw Error('WhatsApp debe incluir código de país, por ejemplo 18495038748.');
  site.instagram=cleanString(s.instagram??'',70).replace(/^@/,'');
  site.tiktok=cleanString(s.tiktok??'',70).replace(/^@/,'');
  if(!/^[a-zA-Z0-9._]{0,70}$/.test(site.instagram)||!/^[a-zA-Z0-9._]{0,70}$/.test(site.tiktok))throw Error('Usuario de red social inválido.');
  site.defaultTheme=cleanString(s.defaultTheme??'obsidian',25);
  if(!['obsidian','paper','galaxy','arctic','forest','sakura','ocean','sunset','mono','cyber','sand','crimson'].includes(site.defaultTheme))site.defaultTheme='obsidian';
  site.logoImage=cleanString(s.logoImage??'',250);
  site.heroImage=cleanString(s.heroImage??'',250);
  if(!imagePathValid(site.logoImage)||!imagePathValid(site.heroImage))throw Error('La imagen de marca debe subirse desde el panel.');
  site.showStock=s.showStock!==false;site.showBanner=!!s.showBanner;
  return {version:1,published:true,updatedAt:new Date().toISOString(),site,categories,products,watchCollectionImported:input.watchCollectionImported===true};
}
async function jsonBody(req,max){
  const length=Number(req.headers.get('content-length')||0);
  if(length>max)throw Error('Archivo demasiado grande.');
  const raw=await req.text();
  if(raw.length>max)throw Error('Solicitud demasiado grande.');
  try{return JSON.parse(raw)}catch{throw Error('JSON inválido.')}
}
function validImageBytes(buf,mime){
  if(mime==='image/png')return buf.length>8&&buf.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'));
  if(mime==='image/jpeg')return buf.length>4&&buf[0]===0xff&&buf[1]===0xd8&&buf[2]===0xff;
  if(mime==='image/webp')return buf.length>12&&buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,12)==='WEBP';
  return false;
}
export default async function handler(req,context){
  const u=new URL(req.url),action=u.searchParams.get('action')||'public';
  const configReady=password().length>=12&&secret().length>=32;
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{Allow:'GET, POST'}});
  try{
    if(req.method==='GET'&&action==='public'){
      const data=await catalogStore().get('catalog',{type:'json'});
      return html(withWatchCollection(data),200,{
        'Netlify-CDN-Cache-Control':'public, durable, max-age=10',
        'Netlify-Vary':'query=action'
      });
    }
    if(req.method==='GET'&&action==='image'){
      const id=u.searchParams.get('id')||'';
      if(!/^[0-9a-f-]{36}$/.test(id))return failure('Imagen inválida.',404);
      // Formato binario nuevo: menos bytes y menos CPU. Compatible con fotos JSON antiguas.
      const entry=await photoStore().getWithMetadata(`photo-${id}`,{type:'arrayBuffer'});
      if(!entry)return failure('Imagen no encontrada.',404);
      let buf=Buffer.from(entry.data),mime=entry.metadata?.mime;
      if(!mime){
        const legacy=JSON.parse(buf.toString('utf8'));
        mime=legacy.mime;
        buf=Buffer.from(legacy.data,'base64');
      }
      if(!['image/png','image/jpeg','image/webp'].includes(mime))return failure('Imagen inválida.',404);
      return new Response(buf,{status:200,headers:{
        'Content-Type':mime,'Cache-Control':'public, max-age=31536000, immutable',
        'Netlify-CDN-Cache-Control':'public, durable, max-age=31536000, immutable',
        'Netlify-Vary':'query=action|id',
        'X-Content-Type-Options':'nosniff'
      }});
    }
    if(req.method==='GET'&&action==='me')return html({ok:true,authenticated:authenticated(req),configured:configReady,
      setupHint:configReady?null:(password().length<12&&secret().length<32?'both':password().length<12?'password':'secret')});
    if(req.method==='POST'&&action==='login'){
      if(!originOK(req))return failure('Origen no permitido.',403);
      if(!configReady)return failure('Primero configura JS_ADMIN_PASSWORD (12+ caracteres) y JS_ADMIN_SECRET (32+ caracteres) en Netlify.',503);
      const key=throttleKey(req,context),rates=rateStore();
      const record=await rates.get(key,{type:'json'})||{tries:0,expires:0};
      if(record.expires<Date.now()){record.tries=0;record.expires=Date.now()+15*60000}
      if(record.tries>=5)return failure('Demasiados intentos. Inténtalo después de 15 minutos.',429);
      const input=await jsonBody(req,4096);
      if(!secureEqual(input.password,password())){
        record.tries+=1;
        await rates.setJSON(key,record);
        return failure('Contraseña incorrecta.',401);
      }
      await rates.delete(key);
      return html({ok:true},200,{'Set-Cookie':cookieFor(makeSession(),12*60*60)});
    }
    if(req.method==='POST'&&action==='logout'){
      if(!originOK(req))return failure('Origen no permitido.',403);
      return html({ok:true},200,{'Set-Cookie':cookieFor('',0)});
    }
    if(!authenticated(req))return failure('Inicia sesión para continuar.',401);
    if(['save','upload'].includes(action)&&process.env.CONTEXT&&process.env.CONTEXT!=='production')return failure('Solo puedes publicar desde el sitio principal (producción), no desde una vista previa.',403);
    if(req.method==='GET'&&action==='state'){
      const data=await catalogStore().get('catalog',{type:'json'});
      return html(withWatchCollection(data));
    }
    if(req.method==='POST'&&action==='save'){
      if(!originOK(req))return failure('Origen no permitido.',403);
      const input=await jsonBody(req,400000);
      const data=validate(input);
      await catalogStore().setJSON('catalog',data);
      return html({ok:true,data});
    }
    if(req.method==='POST'&&action==='upload'){
      if(!originOK(req))return failure('Origen no permitido.',403);
      const input=await jsonBody(req,1000000);
      const mime=input?.mime;
      if(!['image/png','image/jpeg','image/webp'].includes(mime))return failure('Solo imágenes JPG, PNG o WebP.',400);
      const b64=input?.base64;
      if(typeof b64!=='string'||b64.length>900000||!/^[A-Za-z0-9+/=]+$/.test(b64))return failure('Imagen inválida o demasiado grande.',400);
      const buf=Buffer.from(b64,'base64');
      if(buf.length>650000||!validImageBytes(buf,mime))return failure('Imagen inválida. Máximo 650 KB por foto.',400);
      const id=randomUUID();
      // Guardar bytes reales, no base64 en JSON (ahorra ~25% del almacenamiento).
      await photoStore().set(`photo-${id}`,buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength),{metadata:{mime}});
      return html({ok:true,url:`/.netlify/functions/api?action=image&id=${id}`});
    }
    return failure('Ruta no disponible.',404);
  }catch(err){
    console.error('JS NEXO function error:',err?.message||err);
    if(/inválid|Falta|Máximo|debe|demasiado|requiere|Stock|Precio|imagen|categoria|Categoría|producto|Solicitud/i.test(err?.message||''))return failure(err.message,400);
    return failure('No se pudo completar la operación. Revisa los logs de Netlify Functions.',500);
  }
}
