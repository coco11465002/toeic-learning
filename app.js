(() => {
'use strict';
const WORDS=window.TOEIC_VOCAB||[];
const iw=WORDS.find(w=>w.word==='i');if(iw)iw.word='I';
const LESSONS=window.TOEIC_LESSONS||[];
const PAPERS=window.TOEIC_PAPERS||[];
const ZH=window.TOEIC_EXTRA_ZH||{};
const ENRICH=window.TOEIC_ENRICHMENT||{};
const MORPH=window.TOEIC_MORPH_CATALOG||window.TOEIC_MORPHOLOGY||[];
const ENRICH_ZH=window.TOEIC_ENRICH_ZH||{};
const PAGE=document.getElementById('content');
const WORD_MAP=new Map(WORDS.map(w=>[w.word.toLowerCase(),w]));
const SENTENCE_INDEX=new Map();
function rememberExample(en,zh){if(!en||!zh)return;const entry={en:String(en),zh:String(zh)};const tokens=[...new Set(String(en).toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g)||[])];for(const t of tokens){if(!WORD_MAP.has(t))continue;let arr=SENTENCE_INDEX.get(t);if(!arr){arr=[];SENTENCE_INDEX.set(t,arr)}if(arr.length<8&&!arr.some(x=>x.en===entry.en))arr.push(entry)}}
for(const pack of Object.values(ENRICH)){for(const ex of pack.examples||[])rememberExample(ex.en,ex.zh)}
for(const l of LESSONS){for(const [en,zh] of l.examples||[])rememberExample(en,zh)}
for(const family of MORPH){rememberExample(family.example?.en,family.example?.zh)}

const starter=`I,you,he,she,we,they,the,a,an,this,that,student,teacher,book,pen,desk,read,write,work,study,learn,help,need,have,do,go,come,speak,say,tell,friend,family,home,school,office,manager,employee,team,meeting,report,email,day,week,today,tomorrow,yesterday,now,always,usually,often,sometimes,never,important,new,good,bad,small,big,happy,beautiful,quick,slow,carefully,quickly,name,time,morning,afternoon,evening,year,month,yes,no,can,will,should,may,person,people,business,company,job,customer,service,product,order,schedule,send,receive,call,answer,question,open,close,buy,sell,price,money,pay,bus,train,ticket,arrive,leave,travel,phone,computer,information,document,form,finish,start,complete,apply,application,applicant,interview,hiring,hire,confirm,cancel,postpone,deadline,submit,provide,prepare,attend,request,reply,thank,please,sorry,another,some,any,many,much,more,most,few,little,first,last,after,before,because,but,and,or,with,without,for,since,at,in,on,by,from,to,into,up,down,under,over,between,among,near,about,before,after,customer,delivery,discount,refund,invoice,receipt,contract,agreement,budget,salary,policy,procedure,quality,quantity,inventory,warehouse,shipment,reservation,appointment,location,transportation,experience,ability,skill,opportunity,responsibility,requirement,affect,effect,accept,except,borrow,lend,increase,decrease,efficient,effective,maintain,replace,update,install,device,software,network,access,security,available,necessary,possible,successful,develop,evaluate,recommend,establish,improve,reduce,frequently,supply,make,decision,mistake,careful,compare,different,similar`.split(',');
const priority=[];const used=new Set();
function addWord(w){let item=WORD_MAP.get(w.toLowerCase());if(item&&!used.has(item.word.toLowerCase())){used.add(item.word.toLowerCase());priority.push(item)}}
starter.forEach(addWord);
const sourceOrder={'基礎增補':1,'基礎字庫':2,'原書':3,'補充':4};
WORDS.slice().sort((a,b)=>(sourceOrder[a.source]||6)-(sourceOrder[b.source]||6)).forEach(w=>addWord(w.word));
const UNITS=Math.ceil(priority.length/5);
const storageKey='toeic-smallsteps-v5';
let store;
try{store=JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{store={}}
store={unit:0,completed:[],answers:{},paperAnswers:{},...(store||{})};
if(!Array.isArray(store.completed))store.completed=[];
if(!store.answers||typeof store.answers!=='object')store.answers={};
if(!store.paperAnswers||typeof store.paperAnswers!=='object')store.paperAnswers={};
if(!store.reviewCards||typeof store.reviewCards!=='object')store.reviewCards={};
// 首次升級時，把前幾版已完成的小單元加入待複習清單，保留原本學習進度。
if(!store.reviewMigrated){for(const u of store.completed){const n=Number(u);if(!Number.isInteger(n)||n<0||n>=UNITS)continue;for(const w of getWords(n)){const key=w.word.toLowerCase();if(!store.reviewCards[key])store.reviewCards[key]={stage:0,due:dateOffset(0)}}}store.reviewMigrated=true;try{localStorage.setItem(storageKey,JSON.stringify(store))}catch{}}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(store))}catch{}}
const state={wordSearch:'',wordCategory:'',wordShown:30,grammarSearch:'',revealed:{},rootCategory:'all',rootSearch:'',rootGroupShown:24,rootWordShown:{},rootWordSearch:{},rootRevealed:{},rootQuiz:{},reviewReveal:{}};
let oldHash=location.hash||'#home',historyTrail=[],lastSpoken='',toastTimer;
const esc=x=>String(x??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
const sub=x=>String(x||'').replace(/\s+/g,' ').trim();
const clip=(n,l,h)=>Math.min(Math.max(Number(n)||0,l),h);
function route(){const a=decodeURIComponent((location.hash||'#home').substring(1)).split('/').filter(Boolean);return a.length?a:['home']}
function go(hash){const h='#'+hash.replace(/^#/,'');if(location.hash===h){render();return}location.hash=h;}
function back(){if(historyTrail.length)history.back();else go('home')}
function toast(m){const node=document.getElementById('toast');node.textContent=m;node.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('visible'),2500)}
function play(t){const synth=window.speechSynthesis;if(!t)return;if(!synth){toast('此瀏覽器沒有朗讀功能，請改用 Chrome 或 Safari');return}try{synth.cancel();const u=new SpeechSynthesisUtterance(String(t));u.lang=document.getElementById('accent').value;u.rate=parseFloat(document.getElementById('speed').value);let voices=synth.getVoices();let v=voices.find(x=>x.lang===u.lang)||voices.find(x=>x.lang?.startsWith('en'));if(v)u.voice=v;u.onerror=()=>{document.getElementById('speech-status').textContent='無法播放，請檢查裝置的語音設定'};synth.speak(u);lastSpoken=t;document.getElementById('speech-status').textContent='正在朗讀'}catch(e){toast('裝置暫時無法播放語音')}}
function playBtn(s,label='發音'){
const icon='<svg class="play-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6.5 9H3v6h3.5l4.5 4V5Z"/><path d="M15 9a4 4 0 0 1 0 6"/><path d="M18 6a8 8 0 0 1 0 12"/></svg>';
return `<button class="play" type="button" data-speak="${esc(s)}" aria-label="播放 ${esc(s)}" title="聽發音：${esc(s)}">${icon}<span class="play-label">${esc(label)}</span></button>`;
}
function stage(u){return u<60?{id:1,title:'從零開始',desc:'認識句子、詞性與每天會遇到的英文',color:'mint'}:u<180?{id:2,title:'基礎扎根',desc:'時態、代名詞、文法與常用字',color:'blue'}:{id:3,title:'生活與職場應用',desc:'把單字和文法用在完整句子',color:'peach'}}
// Each short unit connects two related grammar themes, with three distinct takeaways.
// The pairing stays stable for old saved units; localStorage progress is preserved.
const PARTNER_TOPICS=[1,0,3,2,5,4,20,21,29,34,32,25,37,51,38,52,48,49,42,44,6,7,5,24,23,26,25,0,29,28,7,32,10,32,9,43,7,12,14,40,39,12,18,35,19,46,45,45,16,17,12,13,15,53,26,5,58,14,56];
function ruleFor(u){
 const review=u>=LESSONS.length*2;
 const idx=!review?Math.floor(u/2):Math.floor((u-LESSONS.length*2)/3)%LESSONS.length;
 const lesson=LESSONS[idx]||LESSONS[0];
 const partner=LESSONS[PARTNER_TOPICS[idx]]||LESSONS[(idx+1)%LESSONS.length];
 const mainRules=lesson.rules||[],sideRules=partner.rules||[];
 const round=!review?u%2:(u-LESSONS.length*2)%3;
 const start=round*2;
 const main=[0,1].map(k=>mainRules[(start+k)%mainRules.length]).filter(Boolean);
 const side=sideRules.length?sideRules[(round+Math.floor(u/2))%sideRules.length]:null;
 const concepts=[...main.map(x=>({title:x[0],detail:x[1],topic:lesson.title})),...(side?[{title:side[0],detail:side[1],topic:partner.title}]:[])];
 const examples=[...(lesson.examples||[]).slice(0,3).map(x=>({en:x[0],zh:x[1],topic:lesson.title})),...(partner.examples||[]).slice(0,3).map(x=>({en:x[0],zh:x[1],topic:partner.title}))];
 return {lesson,partner,subset:main,concepts,examples,review,part:round};
}
function getWords(u){return priority.slice(u*5,(u+1)*5)}
function spl(w){let s=w.split||w.word;if(!s||s.toLowerCase()===w.word.toLowerCase())return [w.word];const p=s.split(/\s*[/|•]\s*/).filter(Boolean);return p.length? p:[w.word]}
function chunksHtml(w){const p=spl(w);if(p.length===1)return `<div class="word-chunks"><span class="chunk">${esc(w.word)}</span><span class="tiny muted">單音節／保留整字</span></div>`;return `<div class="word-chunks">${p.map((x,i)=>`${i?'<span class="chunk-separator">/</span>':''}<span class="chunk">${esc(x)}</span>`).join('')}</div>`}
function enriched(w){return ENRICH[w?.word?.toLowerCase()||'']||{}}
function getZ(s){const clean=sub(s).toLowerCase().replace(/\s*\([^)]*\)/g,'');if(!clean)return'';if(ENRICH_ZH[clean])return ENRICH_ZH[clean];let w=WORD_MAP.get(clean)||WORD_MAP.get(clean.replace(/s$/,''));return (w&&w.meaning)||ZH[clean]||ZH[s]||''}
function tokens(str){if(!str||/沒有|尚無|待補|請參考|看例句|沒有特別|—|無適合/.test(str))return [];return String(str).split(/[,;；、]/).map(s=>s.trim()).filter(Boolean).slice(0,12)}
function usefulNote(w){const p=enriched(w);if(p.note)return p.note;const note=sub(w.note);return (/來自常用英中字庫|請配合例句|尚無|待補|看例句中的/.test(note)?'':note)}
function validUsage(w){const e=sub(w.usage);if(!e||/動詞；看例句|名詞；看例句|看例句中的|參考例句|^(動詞|名詞|形容詞|副詞)[；:：]/.test(e))return '';return e}
function collocations(w){const p=enriched(w);if(p.collocations?.length)return p.collocations;const en=validUsage(w);const zh=getZ(en);return en&&zh?[{en,zh}]:[]}
// Remove dictionary-generated 'we are learning the word ...' as these are not usage examples.
function genuineExample(w){const en=sub(w.example||''),src=w.example_source||'';return !!en&&!/單字介紹|非用法例句|非完整句|短語/.test(src)&&!w.example_zh?.startsWith('「')&&(/[.!?]/.test(en)||en.split(' ').length>=5)}
function examplesFor(w){const arr=[...(enriched(w).examples||[])];if(genuineExample(w)&&!arr.some(x=>x.en.toLowerCase()===w.example.toLowerCase()))arr.push({en:w.example,zh:w.example_zh});if(arr.length<3)for(const x of SENTENCE_INDEX.get(w.word.toLowerCase())||[]){if(!arr.some(v=>v.en.toLowerCase()===x.en.toLowerCase()))arr.push(x);if(arr.length>=3)break}return arr.filter(x=>x.en&&x.zh).slice(0,4)}
function paint(en,focus){const txt=String(en||'');const f=Array.isArray(focus)?focus:[focus];const options=f.filter(Boolean).map(String).sort((a,b)=>b.length-a.length);if(!options.length)return esc(txt);const p=new RegExp('(?<![\\p{L}])(?:'+options.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![\\p{L}])','giu');let out='',last=0;for(const m of txt.matchAll(p)){out+=esc(txt.slice(last,m.index))+'<mark class="focus-mark">'+esc(m[0])+'</mark>';last=m.index+m[0].length}return out+esc(txt.slice(last))}
// Exact grammatical target words/phrases, indexed by existing 59 core grammar lessons.
const G_FOCUS=[
 ['I','you','he','she','it','we','they'],['am','is','are'],['work','reads','report','writes'],['manager','works','busy'],['two','three','managers','employees'],['works','work','does','has'],['not','Is','Do','Does','Did'],['works','submitted','yesterday'],['is speaking','are preparing','is working'],['will','going to'],['has approved','have received','has','have'],['a','an','the'],['careful','carefully'],['faster than','most expensive','more'],['at','by','in','on'],['because','although','but','and'],['was shipped','be reviewed','was','will be'],['to attend','making','to'],['must','should','can'],['who','which','that'],['was','were'],['bought','wrote','went','saw'],['study','works','is','are'],['This','Those','These','That'],['my','hers','mine','your'],['information','chairs','much','many'],['any','many','some','much'],['me','them','him','us','her'],['usually','never','often'],['drinks','opens','every'],['was reading','were working','when'],['had started','had finished','had'],['have finished','finished'],['have been studying','has been working'],['will be working','will be traveling'],['Please','Do not'],['when','while','before','after'],['new','small blue','bright'],['interested in','depends on','at','in','on'],['made a decision','do my homework'],['tell','speaks','say','talk'],['affects','effect'],['Could you','Would you','May I'],['Could you tell me','I wonder'],['who','that','which'],['If','will'],['If','would','had'],['unless','as long as','even if'],['was submitted','will be delivered'],['to learn','reading'],['interesting','interested'],['as large as','not as expensive as'],['because of','because','although','despite'],['office supplies','job application'],['Both','Neither','either','all'],['made','Let','have'],['offered','provide','supply'],['by','until','during','for'],['I am writing to','Thank you for','confirm']
];
function wordPaint(en,w){const forms=Array.isArray(w?.forms)?w.forms.filter(Boolean):[];return paint(en,[w?.word||'',...forms])}
function grammarPaint(en,topic){let i=LESSONS.findIndex(x=>x.title===topic);return paint(en,G_FOCUS[i]||[])}
function grammarExample(x,i){return `<div class="example-row highlighted-example"><div><span class="tiny muted">${esc(x.topic||'文法例句')} · ${i+1}</span><br><strong>${grammarPaint(x.en,x.topic)}</strong><span>${esc(x.zh)}</span></div>${playBtn(x.en,'聽整句')}</div>`}
function related(title,raw,override){let items=override?.length?override.map(([en,zh])=>({en,zh})):tokens(raw).map(en=>({en:en.replace(/\s*\([^)]*\)/g,''),zh:getZ(en.replace(/\s*\([^)]*\)/g,''))})).filter(x=>x.zh);if(!items.length)return '';return `<div class="detail-line"><div class="detail-label">${esc(title)}</div><div class="chip-row">${items.map(({en,zh})=>`<div class="chip-word"><span><strong>${esc(en)}</strong><small>${esc(zh)}</small></span>${playBtn(en,'聽')}</div>`).join('')}</div></div>`}
function usage(w){const arr=collocations(w);if(!arr.length)return '';return `<div class="detail-line"><div class="detail-label">常見搭配 · 中英對照</div>${arr.map(({en,zh})=>`<div class="pair readable-pair"><div><strong>${wordPaint(en,w)}</strong><br><em>${esc(zh)}</em></div>${playBtn(en,'聽搭配')}</div>`).join('')}</div>`}
function exampleBlock(w,limit=3){const arr=examplesFor(w).slice(0,limit);if(!arr.length)return '';return `<div class="detail-line"><div class="detail-label">情境例句 · 重點已標色</div>${arr.map((x,i)=>`<div class="example-row highlighted-example"><div><small class="tiny muted">例句 ${i+1}</small><br><strong>${wordPaint(x.en,w)}</strong><span>${esc(x.zh)}</span></div>${playBtn(x.en,'聽整句')}</div>`).join('')}</div>`}
function wordDetails(w,expanded=true){const p=enriched(w),pieces=`<div class="detail-line"><div class="detail-label">🧩 拼字記憶拆分</div>${chunksHtml(w)}<div class="tiny muted">這是拼字記憶分段，不代表正式字根或音標。</div></div>`;
const full=`${usage(w)}${exampleBlock(w)}${related('同義／近義詞',w.synonyms,p.synonyms)}${related('反義／對比詞',w.antonyms,p.antonyms)}${related('容易混淆的詞',w.confusing,p.confusing)}${related('同字族與派生詞',w.family,p.family)}${morphCrosslinks(w)}${w.forms?`<div class="detail-line"><div class="detail-label">動詞變化 · 聽每一種形式</div><div class="chip-row">${(Array.isArray(w.forms)?w.forms:[w.forms]).map((f,i)=>`<div class="chip-word"><small>${['原形','第三人稱','過去式','過去分詞','-ing','未來式'][i]||'變化'}</small><strong>${esc(f)}</strong>${playBtn(f,'聽')}</div>`).join('')}</div></div>`:''}${usefulNote(w)?`<div class="word-note-compact">💡 ${esc(usefulNote(w))}</div>`:''}`;
return `<div class="word-insight">${pieces}${expanded?full:`<details class="more-info"><summary>查看完整例句、常見搭配與字族</summary><div class="word-insight">${full}</div></details>`}</div>`}
function stepNav(u,step,idx){const steps=['文法','單字','例句','小練習','手寫筆記'];return `<div class="lesson-tabs">${steps.map((s,i)=>`<button class="${step===i?'active':''} ${store.completed.includes(u)?'done':''}" data-route="learn/${u}/${i}/${i===1?idx:0}">${['01','02','03','04','05'][i]} ${s}</button>`).join('')}</div>`}
function learnHeader(u){const s=stage(u);return `<div class="learning-header"><div><span class="eyebrow">LEVEL ${s.id} · ${esc(s.title)}</span><h1>第 ${u+1} 單元 <span class="pill ${s.color}">2 個相關文法主題 · 5 個單字</span></h1><p>兩個文法小主題 → 三個關鍵觀念 → 五個單字 → 例句和練習 → 詳細手寫筆記</p></div><div class="unit-jump no-print"><label class="tiny muted" for="unit-select">跳至單元</label><input type="number" id="unit-select" min="1" max="${UNITS}" value="${u+1}" aria-label="單元編號"><button class="mini-btn" data-unit-jump>前往</button></div></div><div class="progress-row"><span class="tiny muted">總進度 ${store.completed.length} / ${UNITS} 單元</span><span class="tiny muted">${Math.min((u+1)*5,WORDS.length)} / ${WORDS.length} 字的學習路線</span></div><div class="progress-line"><span style="width:${Math.min(100,(store.completed.length/UNITS)*100)}%"></span></div>`}
function learnGrammar(u){const {lesson,partner,concepts,examples,review}=ruleFor(u);return `<div class="step-top"><div><span class="pill blue">${review?'兩個文法主題再複習':'兩個相連的文法主題'}</span><h2>${esc(lesson.title)} ＋ ${esc(partner.title)}</h2></div></div><div class="topic-pair"><div class="topic-tag coral"><small>主題 A</small><strong>${esc(lesson.title)}</strong><p>${esc(lesson.subtitle||'')}</p><button class="mini-btn" data-route="grammar/${LESSONS.indexOf(lesson)}">完整教學 ↗</button></div><div class="topic-tag mint"><small>主題 B</small><strong>${esc(partner.title)}</strong><p>${esc(partner.subtitle||'')}</p><button class="mini-btn" data-route="grammar/${LESSONS.indexOf(partner)}">完整教學 ↗</button></div></div><div class="unit-learning-note">先把這 3 個觀念聽懂即可。更多規則和完整例句都會收錄到後面的手寫筆記。</div>${concepts.map((c,i)=>`<div class="rule-note"><span class="tiny muted">${i+1} / 3 · ${esc(c.topic)}</span><strong>${esc(c.title)}</strong><p>${esc(c.detail)}</p></div>`).join('')}<h3 class="learning-mini-heading">把兩個主題放進例句</h3>${examples.slice(0,4).map((x,i)=>grammarExample(x,i)).join('')}<div class="step-actions"><button class="btn btn-ghost" data-route="home">回首頁</button><button class="btn btn-primary" data-route="learn/${u}/1/0">繼續學 5 個單字 →</button></div>`}
function learnWord(u,idx){const w=getWords(u)[idx];if(!w)return `<div class="panel"><h2>這個單元沒有單字資料</h2></div>`;const key=`${u}:${idx}`,revealed=!!state.revealed[key];return `<div class="word-focus-head"><span class="pill peach">新單字 ${idx+1} / ${getWords(u).length}</span><span class="muted tiny">先猜意思，再翻開</span></div><div class="word-focus-box"><span class="word-number">VOCABULARY · ${esc(w.category||'基礎')}</span><h2 class="word-english">${esc(w.word)}</h2>${playBtn(w.word,'播放英文')}<div style="margin-top:19px"><span class="detail-label">🧩 拆分記憶</span>${chunksHtml(w)}</div>${revealed?`<div class="reveal-card"><div class="word-type">${esc(w.pos||'詞性待補')}</div><div class="meaning">${esc(w.meaning)}</div>${wordDetails(w,false)}</div>`:`<button class="btn btn-mint" data-reveal="${key}">翻開中文與用法 👀</button>`}</div><div class="step-actions"><button class="btn btn-ghost" data-route="learn/${u}/${idx===0?0:1}/${idx===0?0:idx-1}">← ${idx===0?'文法':'上一個'}</button><button class="btn btn-primary" data-route="learn/${u}/${idx===getWords(u).length-1?2:1}/${idx===getWords(u).length-1?0:idx+1}">${idx===getWords(u).length-1?'看例句 →':'下一個字 →'}</button></div>`}
function learnExamples(u){const pack=ruleFor(u);const examples=pack.examples.slice(0,6).map(x=>({...x,label:'文法例句'}));getWords(u).forEach(w=>examplesFor(w).slice(0,1).forEach(x=>examples.push({...x,label:'單字例句',topic:w.word}))); return `<div class="step-top"><div><span class="pill mint">把句子聽熟</span><h2>兩個文法主題的例句</h2></div></div><p>先讀英文，再聽一次、對照中文。每次只理解一個句子；文法與單字的重點會用色塊標示；整個單元的例句也會收在筆記中。</p>${examples.map((x,i)=>x.label==='單字例句'?`<div class="example-row highlighted-example"><div><span class="tiny muted">單字 ${esc(x.topic)} · ${i+1}</span><br><strong>${wordPaint(x.en,WORD_MAP.get((x.topic||'').toLowerCase())||{word:x.topic})}</strong><span>${esc(x.zh)}</span></div>${playBtn(x.en,'聽例句')}</div>`:grammarExample(x,i)).join('')}<div class="step-actions"><button class="btn btn-ghost" data-route="learn/${u}/1/${getWords(u).length-1}">← 單字</button><button class="btn btn-primary" data-route="learn/${u}/3">立即小練習 →</button></div>`}
function quizData(u){
 const words=getWords(u),pack=ruleFor(u),set=[];
 for(let i=0;i<Math.min(2,words.length);i++){
  const current=words[i];let distractors=words.filter(x=>x.word!==current.word&&x.meaning!==current.meaning).slice(0,3);
  if(distractors.length<3)distractors=priority.filter(x=>x.word!==current.word&&x.meaning!==current.meaning).slice(0,3);
  const rotated=[...distractors.slice(i),current,...distractors.slice(0,i)].slice(0,4);
  set.push({kind:'單字理解',stem:`「${current.word}」的意思是什麼？`,audio:current.word,options:rotated.map(x=>x.meaning),correct:rotated.findIndex(x=>x.word===current.word),explanation:`${current.word} = ${current.meaning}。`,details:rotated.map(x=>`${x.word}：${x.meaning}`)});
 }
 for(const [j,part] of [pack.lesson,pack.partner].entries()){
  const ex=part.examples||[]; if(!ex.length)continue;
  const correct=ex[(u+j)%ex.length],all=[...pack.examples.map(x=>x.zh),...LESSONS[(u+j+8)%LESSONS.length].examples.map(x=>x[1])];
  const distractors=[...new Set(all.filter(x=>x&&x!==correct[1]))].slice(0,3);
  if(distractors.length<3)continue;
  const options=[correct[1],...distractors]; const shift=(u+j)%4; const rotated=options.slice(shift).concat(options.slice(0,shift));
  set.push({kind:`文法理解 · ${part.title}`,stem:`這句英文的意思是什麼？\n${correct[0]}`,audio:correct[0],options:rotated,correct:rotated.indexOf(correct[1]),explanation:`${correct[0]} = ${correct[1]}。留意本單元「${part.title}」的句子結構。`,details:rotated.map(x=>x===correct[1]?'符合本句的中文意思。':'這是其他例句的意思，不符合此句。')});
 }
 return set;
}
function quizItem(q,key,idx){const m=String(key).match(/^p(\d+)q(\d+)$/);const a=m?(store.paperAnswers[PAPERS[Number(m[1])]?.id]||{})[Number(m[2])]:store.answers[key];return `<div class="practice-card"><span class="pill ${idx%2?'blue':'peach'}">第 ${idx+1} 題 · ${esc(q.kind)}</span><h3 style="white-space:pre-line">${esc(q.stem)}</h3>${playBtn(q.audio,'聽英文')}<div class="options" style="margin-top:15px">${q.options.map((op,i)=>`<button class="option ${a!==undefined?(i===q.correct?'correct':i===a?'incorrect':''):''}" data-study-answer="${esc(key)}" data-answer="${i}" ${a!==undefined?'disabled':''}><b>${'ABCD'[i]}.</b> ${esc(op)}</button>`).join('')}</div>${a!==undefined?`<div class="explain"><strong>${a===q.correct?'✓ 答對了！':'再記住一次就好'}　正確答案：${'ABCD'[q.correct]}</strong><p>${esc(q.explanation)}</p>${q.detail?`<p>${esc(q.detail)}</p>`:''}${q.details?.map((x,i)=>`<div><b>${'ABCD'[i]}.</b> ${esc(x)}</div>`).join('')||''}</div>`:''}</div>`}
function learnQuiz(u){const qs=quizData(u);const done=qs.filter((x,i)=>store.answers[`u${u}q${i}`]!==undefined).length;return `<div class="step-top"><div><span class="pill yellow">不用急著考多益</span><h2>${qs.length} 題小練習</h2></div><span class="tiny muted">已作答 ${done} / ${qs.length}</span></div><p>兩個文法主題都會出題，再搭配單字理解；答錯可以對照中文解釋重新看一次。</p>${qs.map((q,i)=>quizItem(q,`u${u}q${i}`,i)).join('')}${done?`<button class="mini-btn" data-reset-unit="${u}">↻ 重新練習本單元</button>`:''}<div class="step-actions"><button class="btn btn-ghost" data-route="learn/${u}/2">← 重聽例句</button><button class="btn btn-primary" data-route="learn/${u}/4">整理手寫筆記 →</button></div>`}
function noteText(u){
 const {lesson,partner,concepts,examples}=ruleFor(u),words=getWords(u);
 const lines=[`✎ 第 ${u+1} 單元｜我的英文學習手帳`,`日期：____________`,`本單元兩個主題：${lesson.title} ／ ${partner.title}`,'','════ 文法筆記｜先懂，再比較 ════',`〔主題 A〕${lesson.title}`,...(lesson.paragraphs||[]),`〔主題 B〕${partner.title}`,...(partner.paragraphs||[]),'','〔本次 3 個學習觀念〕'];
 concepts.forEach((c,i)=>lines.push(`${i+1}. ${c.title}（${c.topic}）`,`   ${c.detail}`));
 lines.push('','〔例句・中英對照〕');
 examples.slice(0,6).forEach((x,i)=>lines.push(`${i+1}. ${x.en}`,`   ${x.zh}`));
 lines.push('','〔兩個觀念一起記〕',`A. ${lesson.title}：${lesson.tip||lesson.subtitle}`,`B. ${partner.title}：${partner.tip||partner.subtitle}`,'','〔中翻英・自己再寫一次〕');
 examples.slice(0,2).forEach((x,i)=>lines.push(`${i+1}. ${x.zh}`,'   英文：________________________________________'));
 lines.push('','〔我自己的補充筆記〕','________________________________________________','________________________________________________','','════ 單字筆記｜五個字慢慢記 ════');
 words.forEach((w,i)=>{
  lines.push(`${i+1}. ${w.word} ${w.pos||''}｜${w.meaning}`,`   拼字記憶：${spl(w).join(' / ')}`);
  collocations(w).slice(0,2).forEach(c=>lines.push(`   搭配：${c.en}（${c.zh}）`));
  examplesFor(w).slice(0,2).forEach(x=>lines.push(`   例句：${x.en}`,`   中文：${x.zh}`));
  const rel=enriched(w).synonyms?.[0];if(rel)lines.push(`   近義字：${rel[0]}（${rel[1]}）`);
  lines.push('   我自己造句：___________________________________','');
 });
 lines.push('〔下次複習〕□ 遮中文想意思　□ 朗讀例句　□ 自己造句');
 return lines.join('\n');
}
function noteHtml(u){
 const {lesson,partner,concepts,examples}=ruleFor(u),words=getWords(u);
 const conceptCards=concepts.map((c,i)=>`<div class="scribble-rule study-concept"><span class="ink-number">${String(i+1).padStart(2,'0')}</span><div><span class="note-topic-label">${esc(c.topic)}</span><b class="marker-underline">${esc(c.title)}</b><p>${esc(c.detail)}</p></div></div>`).join('');
 const examplesHTML=examples.slice(0,6).map((x,i)=>`<div class="hand-example"><span class="small-bubble">${i+1}</span><div><span class="note-topic-label">${esc(x.topic)}</span><b>${grammarPaint(x.en,x.topic)}</b><small>${esc(x.zh)}</small></div></div>`).join('');
 const intro=[{l:lesson,label:'A'},{l:partner,label:'B'}].map(x=>`<div class="grammar-explain-block"><strong><span class="note-topic-pill">主題 ${x.label}</span> ${esc(x.l.title)}</strong>${(x.l.paragraphs||[]).slice(0,2).map(y=>`<p>${esc(y)}</p>`).join('')}</div>`).join('');
 const entries=words.map((w,i)=>{
  const common=collocations(w).slice(0,2),examples=examplesFor(w).slice(0,2),relatedWord=enriched(w).synonyms?.[0],note=usefulNote(w);
  return `<div class="hand-word"><span class="hand-word-num">${i+1}</span><div class="hand-word-main"><div class="hand-word-head"><strong>${esc(w.word)}</strong><span>${esc(w.pos||'')}</span></div><div class="hand-word-meaning">${esc(w.meaning)}</div><div class="hand-word-split">🧩 拼字記憶：${esc(spl(w).join(' / '))}</div>${common.map(c=>`<div class="hand-word-usage"><b>搭配：</b>${wordPaint(c.en,w)}　<span>${esc(c.zh)}</span></div>`).join('')}${examples.map((x,j)=>`<div class="hand-word-usage"><b>例句 ${j+1}：</b>${wordPaint(x.en,w)}<br><span>中文：${esc(x.zh)}</span></div>`).join('')}${relatedWord?`<div class="hand-word-usage"><b>近義字：</b>${esc(relatedWord[0])}（${esc(relatedWord[1])}）</div>`:''}${note?`<div class="hand-word-usage"><b>補充：</b>${esc(note)}</div>`:''}<div class="write-my-own"><b>我造句：</b><span class="writing-line"></span></div><div class="note-write-lines" aria-hidden="true"><i></i></div></div></div>`;
 }).join('');
 return `<div class="notebook-spread notebook-detailed" id="note-content" aria-label="第 ${u+1} 單元的詳細文法與單字手帳">
 <article class="notebook-sheet sheet-grammar">
  <div class="notebook-holes" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="paper-sticker sticker-coral" aria-hidden="true">✿</div>
  <header class="sheet-header"><span class="sheet-eyebrow">✎ MY GRAMMAR NOTES</span><span class="sheet-number">01 / 02</span></header>
  <h3 class="notebook-title">${esc(lesson.title)} <span class="notebook-plus">＋</span> ${esc(partner.title)}</h3>
  <div class="sheet-meta">第 ${u+1} 單元　／　日期：____________　／　2 個主題・3 個觀念</div>
  <div class="notebook-layout"><aside class="cue-column"><strong>小提示</strong><span>先懂意思</span><span>規則與用法</span><span>例句怎麼說？</span><span>差異與易錯</span><span>自己再寫</span><span class="cue-star">✳︎</span></aside>
   <div class="notes-main"><div class="scribble-heading"><span>01</span> 上課先搞懂 <i>learn</i></div>${intro}
    <div class="scribble-heading"><span>02</span> 三個重點慢慢記 <i>rules</i></div>${conceptCards}
    <div class="scribble-heading"><span>03</span> 例句＋中文抄寫 <i>examples</i></div>${examplesHTML}
    <div class="scribble-heading"><span>04</span> 相似觀念放在一起 <i>compare!</i></div>
    <div class="grammar-compare"><div><small>主題 A · ${esc(lesson.title)}</small><p>${esc(lesson.tip||lesson.subtitle)}</p></div><div><small>主題 B · ${esc(partner.title)}</small><p>${esc(partner.tip||partner.subtitle)}</p></div></div>
    <div class="scribble-heading"><span>05</span> 換我寫英文 <i>try it!</i></div>
    <div class="note-translation-exercises">${examples.slice(0,2).map((x,i)=>`<div class="note-translation"><b>${i+1}. ${esc(x.zh)}</b><span class="note-write-lines"><i></i><i></i></span></div>`).join('')}</div>
    <div class="scribble-heading"><span>06</span> 我自己的補充</div><div class="note-write-lines note-free-lines" aria-label="自由書寫空間"><i></i><i></i><i></i></div>
   </div></div>
  <footer class="note-summary"><b>今天能不能自己說出？</b><span>□ 我能分清楚兩個文法主題　□ 我能讀出例句　□ 我能自己寫一句</span></footer>
 </article>
 <article class="notebook-sheet sheet-vocab">
  <div class="notebook-holes" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="paper-sticker sticker-mint" aria-hidden="true">★</div>
  <header class="sheet-header"><span class="sheet-eyebrow">✿ MY WORD COLLECTION</span><span class="sheet-number">02 / 02</span></header>
  <h3 class="notebook-title">今天收集的 5 個字</h3>
  <div class="sheet-meta">中文意思 → 拆分記憶 → 搭配／例句 → 自己造句</div>
  <div class="word-notebook-collection">${entries}</div>
  <footer class="note-summary"><b>下次複習的三件事</b><span>□ 遮中文想意思　□ 聽英文跟讀　□ 挑兩個字自己造句</span></footer>
 </article></div>`;
}
function learnNotes(u){return `<div class="step-top"><div><span class="pill peach">✎ NOTEBOOK TIME</span><h2>我的完整課堂筆記</h2></div></div><p class="notebook-intro">本單元有兩個相關文法主題、三個重點，附用法說明、四個中英例句、易錯提醒與中翻英練習；下方另有 5 個單字筆記。依照順序慢慢抄，不用一次抄完。</p>${noteHtml(u)}<div class="step-actions"><button class="btn btn-ghost" data-copy-note="${u}">複製完整文字筆記</button><button class="btn btn-ghost" data-print-note>列印手帳頁</button><button class="btn btn-primary" data-complete="${u}">${store.completed.includes(u)?'已完成，下一單元 →':'完成今天的學習 ✓'}</button></div>`}
function learnPage(r){const u=clip(r[1]===undefined?store.unit:Number(r[1]),0,UNITS-1),step=clip(r[2]===undefined?0:Number(r[2]),0,4),idx=clip(Number(r[3]||0),0,4);store.unit=u;store.lastLearn=`learn/${u}/${step}/${idx}`;save();const blocks=[()=>learnGrammar(u),()=>learnWord(u,idx),()=>learnExamples(u),()=>learnQuiz(u),()=>learnNotes(u)];return `${learnHeader(u)}${stepNav(u,step,idx)}<section class="panel learn-panel" aria-label="本單元內容">${blocks[step]()}</section><div class="section-header"><p class="tiny muted">已累積 ${store.completed.length*5} 個完成單元的新字練習；學過的字會在後續例句反覆出現。</p><button class="text-button" data-route="words">有需要時查單字庫 ↗</button></div>`}
function homePage(){
const u=clip(store.unit,0,UNITS-1),p=stage(u),resume=store.lastLearn&&store.lastLearn.startsWith(`learn/${u}/`)?store.lastLearn:`learn/${u}/0`;
return `<section class="home-hero"><div class="content"><span class="eyebrow">✳ MY LITTLE ENGLISH CLUB</span><h1>每天一小步，<br><em>英文慢慢長大！</em></h1><p>每堂學兩個相連的文法主題、5 個新單字；每天只拆成一小步，越學越有底子。</p><div class="hero-actions"><button class="btn btn-primary" data-route="${resume}">${store.completed.length?'繼續今天的課':'開始第一堂課'} <span aria-hidden="true">✦</span></button><button class="btn btn-ghost" data-route="notes/${u}">翻開我的筆記本</button></div></div><div class="hero-art" aria-hidden="true"><div class="hero-washi"></div><div class="hero-art-top">TO DO TODAY <span>✿</span></div><strong>hello,<br>future me!</strong><div class="hero-art-bottom"><span>☑ 兩個文法主題</span><span>☑ 五個單字</span><span>♡ 慢慢來</span></div><div class="hero-art-stamp">YOU GOT THIS!</div></div><div class="hero-spark spark-one" aria-hidden="true">✸</div><div class="hero-spark spark-two" aria-hidden="true">✿</div></section>
<div class="section-header"><div><span class="eyebrow">PICK YOUR LITTLE ADVENTURE</span><h2>今天想先學哪一個？ <span class="title-doodle">✎</span></h2></div></div>
<div class="journey-grid"><button class="journey-card" data-route="learn/${u}/0"><span>📕</span><b>文法小教室</b><p>兩個相連的主題</p><small>START HERE ↗</small></button><button class="journey-card" data-route="learn/${u}/1/0"><span>🍒</span><b>單字收集趣</b><p>一天五個，慢慢記</p><small>FLIP A WORD ↗</small></button><button class="journey-card" data-route="learn/${u}/3"><span>🧁</span><b>小試身手</b><p>練幾題，馬上看懂</p><small>LET'S TRY ↗</small></button></div>
<div class="home-review-strip"><div><strong>🌷 先複習昨天學過的字</strong><span>目前有 ${dueReview().length} 個到期的複習單字</span></div><button class="btn btn-ghost" data-route="review">進入間隔複習 →</button></div><div class="home-root-callout"><div><span class="eyebrow">DISCOVER WORD FAMILIES</span><h3>一次認識一串英文單字 ✦</h3><p>從 re-、-tion 到 apply / application / applicant，像拆積木一樣看懂單字之間的關係。</p></div><button class="btn btn-primary" data-route="roots">探索字根・字族 →</button></div>
<div class="home-bottom"><section class="progress-tile"><div class="progress-row"><strong>🌼 我的成長日記</strong><span class="pill ${p.color}">${esc(p.title)}</span></div><div class="progress-line"><span style="width:${store.completed.length/UNITS*100}%"></span></div><div class="progress-row"><span class="small">已走過 ${store.completed.length} / ${UNITS} 個小單元</span><button class="text-button" data-route="learn/${u}/0">接著學 →</button></div></section><section class="progress-tile progress-sticker"><span class="eyebrow">SECRET GARDEN</span><div class="progress-row"><strong>${WORDS.length.toLocaleString()} 個字</strong><strong>${LESSONS.length} 堂文法</strong></div><span class="tiny muted">寶藏都在這裡，但每天只需要解鎖一小點。</span></section></div>
<div class="section-header"><div><span class="eyebrow">YOUR GROWING JOURNEY</span><h2>從小芽，慢慢長成大樹</h2></div></div><div class="journey-grid stages"><div class="journey-card"><span>🌱</span><b>01｜從零開始</b><p>詞性、主詞、簡單句子</p></div><div class="journey-card"><span>🌻</span><b>02｜基礎扎根</b><p>時態、動詞、句型</p></div><div class="journey-card"><span>🌈</span><b>03 → 04｜實際運用</b><p>例句、職場英文，再到多益題型</p></div></div>`;
}
function wordsPage(){const q=state.wordSearch.trim().toLowerCase(),c=state.wordCategory;let a=priority.filter(w=>(!c||w.category===c)&&(!q||w.word.toLowerCase().includes(q)||w.meaning.includes(q))),shown=a.slice(0,state.wordShown);const categories=[...new Set(WORDS.map(x=>x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-Hant'));return `<header class="library-header"><span class="eyebrow">MY VOCABULARY SHELF</span><h1>單字庫 <span class="pill peach">${WORDS.length.toLocaleString()} 字</span></h1><p>查單字時可以看完整搭配與詞族；正式學習還是建議從每天 5 個字開始。</p></header><div class="search-row"><input type="search" id="word-search" placeholder="搜尋英文或中文，例如：office、員工" value="${esc(state.wordSearch)}"><select id="category-search"><option value="">所有類別</option>${categories.map(x=>`<option ${x===c?'selected':''}>${esc(x)}</option>`).join('')}</select></div><div class="tiny muted" style="margin-bottom:15px">找到 ${a.length} 筆，現在顯示 ${shown.length} 筆</div><div class="library-grid">${shown.map(w=>`<button class="vocab-tile" data-route="word/${encodeURIComponent(w.word)}"><span class="pill mint">${esc(w.pos||'單字')}</span><strong>${esc(w.word)}</strong><p>${esc(w.meaning)}</p><small>🧩 ${esc(spl(w).join(' / '))}</small></button>`).join('')}</div>${a.length>state.wordShown?`<div class="pager"><button class="btn btn-ghost" data-more-words>再看 30 個 ↓</button></div>`:''}`}
function wordPage(r){const w=WORD_MAP.get((r[1]||'').toLowerCase());if(!w)return `<div class="panel"><h2>找不到這個單字</h2><button class="btn btn-ghost" data-route="words">回到單字庫</button></div>`;const position=priority.indexOf(w);return `<div class="library-header"><span class="eyebrow">FOCUS ON ONE WORD</span><div class="word-detail-title"><div><h1>${esc(w.word)}</h1><span class="pill mint">${esc(w.pos||'詞性待補')}</span><span class="pill blue">${esc(w.category||'詞彙')}</span></div>${playBtn(w.word,'聽單字')}</div><p class="meaning">${esc(w.meaning)}</p></div><article class="panel word-detail-full"><span class="detail-label">一步一步記住單字</span>${wordDetails(w,true)}<div class="soft-recall"><strong>遮住中文，能不能說出這個字的意思？</strong><p>再聽一遍發音，從例句中找到重點色塊。</p></div></article><div class="step-actions"><button class="btn btn-ghost" data-back>← 回上一頁</button>${position>=0?`<button class="btn btn-primary" data-route="word/${encodeURIComponent(priority[(position+1)%priority.length].word)}">下一個單字 →</button>`:''}</div>`}
function grammarPage(r){if(r.length>1){const l=LESSONS[clip(Number(r[1]),0,LESSONS.length-1)];return `<header class="library-header"><span class="eyebrow">GRAMMAR LIBRARY · ${esc(l.level)}</span><h1>${esc(l.title)}</h1><p>${esc(l.subtitle)}</p></header><article class="panel"><h2>先理解基本觀念</h2>${(l.paragraphs||[]).map(x=>`<p>${esc(x)}</p>`).join('')}<div class="section-header"><h2>重要規則</h2></div>${(l.rules||[]).map(([a,b],i)=>`<div class="rule-note"><span class="tiny muted">${i+1}</span><strong>${esc(a)}</strong><p>${esc(b)}</p></div>`).join('')}<div class="section-header"><h2>例句慢慢聽</h2></div>${(l.examples||[]).map(([en,zh],i)=>grammarExample({en,zh,topic:l.title},i)).join('')}<div class="word-note-compact" style="margin-top:20px">⭐ ${esc(l.tip||'')}</div></article><div class="step-actions"><button class="btn btn-ghost" data-back>← 返回上一頁</button><button class="btn btn-primary" data-route="learn/${Math.min(LESSONS.indexOf(l)*2,UNITS-1)}/0">搭配小單元練習 →</button></div>`}
const q=state.grammarSearch.trim().toLowerCase();const list=LESSONS.map((x,i)=>({...x,index:i})).filter(x=>!q||x.title.toLowerCase().includes(q)||x.subtitle.toLowerCase().includes(q));return `<header class="library-header"><span class="eyebrow">YOUR GRAMMAR HANDBOOK</span><h1>文法庫 <span class="pill blue">${LESSONS.length} 堂</span></h1><p>課程會從基本句型慢慢加深。需要複習哪個觀念，再來這裡查。</p></header><div class="search-row"><input type="search" id="grammar-search" placeholder="搜尋文法，例如：現在式、主詞、關係子句" value="${esc(state.grammarSearch)}"></div><div class="grammar-grid">${list.map((l,i)=>`<button class="grammar-tile" data-route="grammar/${l.index}"><span class="pill ${i%2?'peach':'mint'}">第 ${l.index+1} 堂 · ${esc(l.level)}</span><h3>${esc(l.title)}</h3><p>${esc(l.subtitle)}</p></button>`).join('')}</div>`}
function notesPage(r){const u=clip(r[1]===undefined?store.unit:Number(r[1]),0,UNITS-1);return `<header class="library-header"><span class="eyebrow">✎ THE LITTLE NOTEBOOK</span><h1>我的英文手帳 <span class="title-doodle">✿</span></h1><p>每堂都有文法頁和單字頁，像學生筆記本一樣可以照抄、自己加註解。</p></header><div class="step-actions no-print" style="margin:0 0 20px"><div class="unit-jump"><input id="notes-unit-input" type="number" min="1" max="${UNITS}" value="${u+1}" aria-label="筆記單元"><button class="mini-btn" data-note-jump>切換單元</button></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost" data-copy-note="${u}">複製文字筆記</button><button class="btn btn-mint" data-print-note>列印手帳頁</button></div></div>${noteHtml(u)}`}
function papersPage(){return `<header class="library-header"><span class="eyebrow">WORKSHEETS · PRACTICE AT YOUR PACE</span><h1>基礎練習卷 <span class="pill yellow">10 回 · 150 題</span></h1><p>這些是學文法和單字的自編練習，不是多益模擬考。你可以線上作答，也能下載 A4 PDF 手寫。</p></header><div class="paper-intro">💛 不需要一次完成一整回。先學懂每天的課，有空再用練習卷複習。正式多益 Part 1～7 會放在最後階段。</div><div class="two-cols">${PAPERS.map((p,i)=>`<div class="paper-tile"><span class="pill ${i%3===0?'mint':i%3===1?'blue':'peach'}">${esc(p.difficulty)}</span><h3>${esc(p.title)}</h3><p>${esc(p.subtitle)} · ${p.questions.length} 題</p><div class="paper-actions"><a href="#paper/${i}/0">線上作答</a><a href="papers/${String(i+1).padStart(2,'0')}_questions.pdf" download>下載題目 PDF</a><a href="papers/${String(i+1).padStart(2,'0')}_answers.pdf" download>答案與詳解 PDF</a></div></div>`).join('')}</div>`}
function paperPage(r){const i=clip(Number(r[1]||0),0,PAPERS.length-1),p=PAPERS[i],questionIndex=clip(Number(r[2]||0),0,p.questions.length);const ans=store.paperAnswers[p.id]||{};const answered=Object.keys(ans).length,score=p.questions.reduce((sum,q,n)=>sum+(ans[n]===q.correct?1:0),0);if(questionIndex===p.questions.length)return `<div class="panel"><div class="completed"><span class="trophy">📋</span><h2>${esc(p.title)}｜完成本回</h2><p>已作答 ${answered}/${p.questions.length} 題 · 答對 ${score} 題</p><div class="hero-actions"><button class="btn btn-primary" data-route="papers">返回練習卷清單</button><button class="btn btn-ghost" data-reset-paper="${i}">↻ 重做本回練習卷</button></div></div></div>`;const q=p.questions[questionIndex],a=ans[questionIndex];return `<header class="library-header"><span class="eyebrow">PRACTICE WORKSHEET · 基礎複習</span><h1>${esc(p.title)}</h1><p>${esc(p.subtitle)} · 線上作答後顯示詳解</p></header><div class="progress-row"><span class="pill blue">第 ${questionIndex+1} / ${p.questions.length} 題</span><span class="small muted">已作答 ${answered} 題 · 目前答對 ${score} 題</span></div><div class="progress-line"><span style="width:${answered/p.questions.length*100}%"></span></div><article class="panel">${quizItem(q,`p${i}q${questionIndex}`,questionIndex)}<div class="step-actions"><button class="btn btn-ghost" data-route="${questionIndex===0?'papers':`paper/${i}/${questionIndex-1}`}">← ${questionIndex===0?'練習卷清單':'上一題'}</button><button class="btn btn-primary" data-route="paper/${i}/${questionIndex+1}">${questionIndex===p.questions.length-1?'查看成果 →':'下一題 →'}</button></div></article><div class="section-header"><span class="tiny muted">所有題目都附有線索說明；你也可以下載 PDF 紙本練習。</span></div>`}
function dateOffset(days){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+days);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function todayKey(){return dateOffset(0)}
function dueReview(){return Object.entries(store.reviewCards||{}).filter(([key,c])=>WORD_MAP.has(key)&&c?.due<=todayKey()).map(([key])=>WORD_MAP.get(key)).slice(0,20)}
function reviewPage(){const due=dueReview();if(!due.length)return `<header class="library-header"><span class="eyebrow">SPACED REVIEW · 間隔複習</span><h1>今天的複習花園 🌷</h1><p>今天沒有到期的單字。完成新的小單元後，單字會安排在隔天、3 天、7 天等時間重新出現。</p></header><div class="soft-recall"><strong>記住比重讀更有效</strong><p>先遮住中文自己想答案，想不起來再翻開。這是回想練習，不是考試。</p></div><div class="step-actions"><button class="btn btn-primary" data-route="learn">繼續學新單元 →</button><button class="btn btn-ghost" data-route="roots">學字根・字族 →</button></div>`;const w=due[0],key=w.word.toLowerCase(),reveal=!!state.reviewReveal[key],c=store.reviewCards[key];return `<header class="library-header"><span class="eyebrow">SPACED REVIEW · 先想答案</span><h1>今天的單字複習 <span class="pill mint">${due.length} 個待複習</span></h1><p>你之前學過的單字會按照間隔重新出現，讓記憶慢慢變穩定。</p></header><div class="review-focus"><small class="eyebrow">REMEMBER THIS WORD?</small><h2>${esc(w.word)}</h2>${playBtn(w.word,'聽單字')}<div class="word-chunks">${chunksHtml(w)}</div>${reveal?`<div class="review-reveal"><strong>${esc(w.meaning)}</strong>${exampleBlock(w,2)}<div class="review-grade"><button class="btn btn-ghost" data-review-grade="${esc(key)}:0">還不熟，明天再複習</button><button class="btn btn-primary" data-review-grade="${esc(key)}:1">我記得，增加間隔 ✓</button></div></div>`:`<button class="btn btn-mint" data-review-reveal="${esc(key)}">先在心裡說出中文 → 翻開</button>`}</div><p class="tiny muted review-hint">${c.stage===0?'第一次複習':'已成功回想 '+c.stage+' 次'} · 答對會延長下次複習的間隔；答不出來就明天再練。</p>`}
// 第九版：字根、字族與全詞庫分類，分批瀏覽避免一次學習過量。
const MORPH_TYPES={prefix:'字首 PREFIX',root:'字根 ROOT',suffix:'字尾 SUFFIX',family:'同字族 WORD FAMILY',topic:'主題整理 TOPIC'};
const MORPH_BY_WORD=new Map();
MORPH.forEach((g,i)=>g.words.forEach(w=>{
 const k=w.en.toLowerCase();if(!MORPH_BY_WORD.has(k))MORPH_BY_WORD.set(k,[]);MORPH_BY_WORD.get(k).push(i);
}));
const MORPH_COVERED=new Set([...MORPH_BY_WORD].filter(([word,ids])=>ids.some(id=>MORPH[id].kind!=='topic')).map(([word])=>word));
function morphCrosslinks(word){
 const items=(MORPH_BY_WORD.get(String(word.word||'').toLowerCase())||[]);
 const structural=items.filter(i=>MORPH[i].kind!=='topic');const thematic=items.filter(i=>MORPH[i].kind==='topic');
 return `<div class="detail-line morph-word-links"><div class="detail-label">🧬 我的字根／字族分類</div><div class="chip-row">${structural.slice(0,8).map(i=>`<button class="morph-jump-chip" data-route="root/${i}">${esc(MORPH[i].key)} <span>${MORPH[i].words.length} 字</span></button>`).join('')}${thematic.slice(0,1).map(i=>`<button class="morph-jump-chip theme" data-route="root/${i}">${esc(MORPH[i].key)} <span>主題</span></button>`).join('')}</div>${!structural.length?'<p class="tiny muted">目前尚無足夠依據連到特定字根；已先依情境主題收錄，不會硬湊相似字形。</p>':''}</div>`;
}
function morphList(){
 const cats=[['all','全部'],['prefix','字首'],['root','字根'],['suffix','字尾'],['family','同字族'],['topic','主題歸檔']];
 const query=sub(state.rootSearch).toLowerCase();
 const selected=MORPH.map((g,i)=>({g,i})).filter(({g})=>(state.rootCategory==='all'||g.kind===state.rootCategory)&&(!query||`${g.key} ${g.meaning} ${g.description}`.toLowerCase().includes(query)||g.words.some(w=>w.en.toLowerCase().includes(query)||w.zh.includes(query))));
 const seen=state.rootGroupShown||24;
 const visible=selected.slice(0,seen);
 const stats=`${MORPH_COVERED.size.toLocaleString('zh-TW')} 筆詞彙具有可比對的構詞／字族關係，其他詞彙依主題歸檔`;
 return `<header class="library-header"><span class="eyebrow">WORD FAMILY GARDEN · 累積學習</span><h1>字根・字族圖鑑 <span class="pill mint">${MORPH.length} 組</span></h1><p>把現有 <strong>${WORDS.length.toLocaleString('zh-TW')} 個字詞</strong>整理成可搜尋的分類，每組不再只有 4 個示範字；依真正收錄數量完整列出，學習時再分批看。</p></header>
 <div class="morph-stats"><div><strong>${WORDS.length.toLocaleString('zh-TW')} <small>/ ${WORDS.length.toLocaleString('zh-TW')}</small></strong><span>已進入分類索引的字詞</span></div><div><strong>${MORPH_COVERED.size.toLocaleString('zh-TW')}</strong><span>具有構詞／字族對應</span></div><div><strong>${MORPH.filter(g=>g.kind==='family').length}</strong><span>同字族分組</span></div></div>
 <label class="morph-search-label" for="morph-search">🔎 搜尋字根、字族或任一單字</label><input id="morph-search" class="morph-search" type="search" placeholder="例如：apply、-tion、管理、report" value="${esc(state.rootSearch)}" autocomplete="off">
 <div class="morph-toolbar" role="group" aria-label="字族分類">${cats.map(([id,txt])=>`<button class="morph-filter ${state.rootCategory===id?'active':''}" data-root-filter="${id}">${txt} <span>${id==='all'?MORPH.length:MORPH.filter(g=>g.kind===id).length}</span></button>`).join('')}</div>
 <div class="morph-result-note">${query?`找到 <b>${selected.length}</b> 組與「${esc(query)}」相關的分類`:`共 <b>${selected.length}</b> 組，先顯示 ${visible.length} 組`} · 點入後可查看該組所有收錄字詞</div>
 ${selected.length?`<div class="morph-grid">${visible.map(({g,i})=>`<button class="morph-card kind-${g.kind}" data-route="root/${i}"><small>${MORPH_TYPES[g.kind]}</small><h2>${esc(g.key)}</h2><p>${esc(g.meaning)}</p><span>${g.words.slice(0,3).map(x=>esc(x.en)).join(' · ')||'課外補充詞彙'}</span><b>${g.words.length} 個詞庫字詞 · 查看全部 ↗</b></button>`).join('')}</div>`:'<div class="soft-recall"><strong>沒有符合的字族</strong><p>可以換個拼字、中文意思搜尋，或使用「主題歸檔」瀏覽所有單字。</p></div>'}
 ${visible.length<selected.length?`<div class="morph-more-wrap"><button class="btn btn-primary" data-root-more-groups>再看 ${Math.min(24,selected.length-visible.length)} 組分類 ↓</button></div>`:''}
 <div class="soft-recall"><strong>分類原則：不能只看字母長得像</strong><p>${stats}。字根是構詞意義，字族是相關詞形；「主題歸檔」只是將原有單字整理在一起，不代表同一字根。遇到尚未確認的構詞關係，先按情境記憶。</p></div>`;
}
function morphDetail(r){
 const i=Number(r[1]);const f=Number.isInteger(i)?MORPH[i]:null;if(!f)return morphList();
 const all=f.words||[];
 const query=sub(state.rootWordSearch[i]||'').toLowerCase();
 const filtered=all.filter(w=>!query||w.en.toLowerCase().includes(query)||w.zh.includes(query));
 const shown=state.rootWordShown[i]||8;
 const display=filtered.slice(0,shown);
 const cards=display.map((w,j)=>{
  const key=`${i}:${w.en.toLowerCase()}`;
  return `<div class="morph-word"><div class="morph-word-top"><b>${esc(w.en)}</b>${playBtn(w.en,'聽單字')}</div><small class="tiny muted">${esc(w.pos||'')}</small>${state.rootRevealed[key]?`<p class="morph-translation">${esc(w.zh)}</p>`:`<button class="morph-reveal" data-root-reveal="${esc(key)}">先猜意思 → 翻開中文</button>`}<button class="morph-inline-link" data-route="word/${encodeURIComponent(w.en)}">查看單字詳解 ↗</button></div>`;
 }).join('');
 const extra=(f.extras||[]).filter(w=>!query||w.en.toLowerCase().includes(query)||w.zh.includes(query)).slice(0,6);
 const lessonExample=f.example||(function(){for(const w of all.slice(0,40)){const record=WORD_MAP.get(w.en.toLowerCase());if(record){const ex=examplesFor(record)[0];if(ex)return {...ex,focus:w.en}}}return null})();
 const sample=filtered.slice(0,4);
 const answer=sample.length>=2?sample[1]:sample[0];
 const opts=sample.slice().sort((a,b)=>a.en.localeCompare(b.en));
 const qid=`${i}:${query}`;
 const chosen=state.rootQuiz[qid];
 return `<header class="library-header"><span class="eyebrow">${MORPH_TYPES[f.kind]} · 第 ${i+1} 組</span><h1>${esc(f.key)} <span class="pill peach">${esc(f.meaning)}</span></h1><p>${esc(f.description)}</p></header>
 <div class="morph-lesson"><div class="morph-summary"><b>這組目前收錄 ${all.length} 個詞庫字詞</b><p>${f.kind==='topic'?'這是方便找字的主題分類，不代表每個字都具有共同字根。':'每一組都可以繼續往下展開；每次先學少量，學完再看後面的字。'}</p><p>可從任何單字進入完整解釋、例句、發音與筆記。</p></div>
 <label class="morph-search-label" for="morph-detail-search">搜尋這一組的單字或中文</label><input id="morph-detail-search" data-morph-group="${i}" class="morph-search" type="search" placeholder="這組共有 ${all.length} 個，輸入英文或中文篩選" value="${esc(state.rootWordSearch[i]||'')}" autocomplete="off">
 <p class="morph-result-note">${query?`找到 ${filtered.length} 個字`:`已顯示 ${display.length} / ${all.length} 個字`} ${query?'': '· 想一次認識更多，可往下展開'}</p>
 ${display.length?`<div class="morph-word-grid">${cards}</div>`:'<div class="soft-recall"><p>這組沒有符合搜尋的已收錄單字。</p></div>'}
 ${shown<filtered.length?`<div class="morph-more-wrap"><button class="btn btn-primary" data-root-more="${i}">再看 ${Math.min(8,filtered.length-shown)} 個字 ↓</button><button class="btn btn-ghost" data-root-all="${i}">顯示這組全部 ${filtered.length} 個字</button></div>`:''}
 ${extra.length?`<details class="morph-extras"><summary>延伸學習 · ${extra.length} 個詞庫外例字</summary><p>以下是原先教材列出的補充詞，尚未列入 3,000 筆詞庫的正式學習進度。</p><div class="morph-word-grid">${extra.map(w=>`<div class="morph-word"><div class="morph-word-top"><b>${esc(w.en)}</b>${playBtn(w.en,'聽單字')}</div><p class="morph-translation">${esc(w.zh)}</p></div>`).join('')}</div></details>`:''}
 ${lessonExample?`<div class="morph-example"><small>情境例句 · 觀察重點色塊</small><div class="example-row highlighted-example"><div><strong>${paint(lessonExample.en,f.focus||lessonExample.focus||sample[0]?.en||'')}</strong><span>${esc(lessonExample.zh)}</span></div>${playBtn(lessonExample.en,'聽整句')}</div></div>`:''}
 ${sample.length>=3?`<section class="morph-practice"><span class="pill yellow">回想練習</span><h3>「${esc(answer.zh)}」對應哪個英文？</h3><div class="morph-options">${opts.map((w,j)=>`<button class="morph-answer ${chosen!==undefined?(w.en===answer.en?'correct':j===chosen?'incorrect':''):''}" data-root-answer="${esc(qid)}:${j}">${esc(w.en)}</button>`).join('')}</div>${chosen!==undefined?`<p class="morph-feedback">${opts[chosen]?.en===answer.en?'答對了！':'再記住一次！'} ${esc(answer.en)} = ${esc(answer.zh)}</p>`:''}</section>`:''}
 </div><div class="step-actions"><button class="btn btn-ghost" data-route="roots">← 字族總覽</button><button class="btn btn-primary" data-route="root/${(i+1)%MORPH.length}">下一組 →</button></div>`;
}

function render(){const r=route();const top=r[0];let html;switch(top){case'learn':html=learnPage(r.length===1?(store.lastLearn||'learn/0/0').split('/'):r);break;case'review':html=reviewPage();break;case'roots':html=morphList();break;case'root':html=morphDetail(r);break;case'words':html=wordsPage();break;case'word':html=wordPage(r);break;case'grammar':html=grammarPage(r);break;case'notes':html=notesPage(r);break;case'papers':html=papersPage();break;case'paper':html=paperPage(r);break;default:html=homePage()}PAGE.innerHTML=html;document.querySelectorAll('[data-nav]').forEach(x=>x.classList.toggle('active',x.dataset.nav===(top==='word'?'words':top==='root'?'roots':top==='paper'?'papers':top)));const bar=document.getElementById('history-bar');bar.hidden=top==='home';document.getElementById('crumbs').textContent=({'learn':'學習進度','word':'單字詳解','review':'間隔複習','roots':'字根字族','root':'字根字族練習','words':'單字庫','grammar':'文法庫','notes':'筆記','papers':'練習卷','paper':'線上練習'}[top]||'');document.title='小步學英文｜'+(bar.hidden?'首頁':document.getElementById('crumbs').textContent);}
function historyChanged(){const newHash=location.hash||'#home';if(newHash!==oldHash){if(historyTrail.length&&newHash===historyTrail[historyTrail.length-1])historyTrail.pop();else historyTrail.push(oldHash);oldHash=newHash}render();window.scrollTo({top:0,behavior:'instant'})}
window.addEventListener('hashchange',historyChanged);
function copyNotes(u){const txt=noteText(u);if(navigator.clipboard?.writeText)navigator.clipboard.writeText(txt).then(()=>toast('筆記已複製')).catch(()=>toast('複製失敗，請改用列印'));else toast('此瀏覽器不支援一鍵複製')}
document.addEventListener('click',e=>{const b=e.target.closest('button,[data-route]');if(!b)return;
if(b.dataset.speak!==undefined){play(b.dataset.speak);return}
if(b.dataset.reviewReveal!==undefined){state.reviewReveal[b.dataset.reviewReveal]=true;render();return}
if(b.dataset.reviewGrade!==undefined){const [key,grade]=b.dataset.reviewGrade.split(':');const c=store.reviewCards[key];if(c){const yes=grade==='1';c.stage=yes?Math.min((c.stage||0)+1,5):0;c.due=dateOffset(yes?[1,3,7,14,30,45][c.stage-1]:1);delete state.reviewReveal[key];save();render()}return}
if(b.dataset.rootFilter!==undefined){state.rootCategory=b.dataset.rootFilter;state.rootGroupShown=24;render();return}
if(b.hasAttribute('data-root-more-groups')){state.rootGroupShown+=24;render();return}
if(b.dataset.rootMore!==undefined){const n=b.dataset.rootMore;state.rootWordShown[n]=(state.rootWordShown[n]||8)+8;render();return}
if(b.dataset.rootAll!==undefined){const n=b.dataset.rootAll;state.rootWordShown[n]=9999;render();return}
if(b.dataset.rootReveal!==undefined){state.rootRevealed[b.dataset.rootReveal]=true;render();return}
if(b.dataset.rootAnswer!==undefined){const values=b.dataset.rootAnswer.split(':');const j=Number(values.pop());state.rootQuiz[values.join(':')]=j;render();return}
if(b.dataset.route){go(b.dataset.route);return}
if(b.hasAttribute('data-back')||b.id==='back-btn'){back();return}
if(b.dataset.reveal!==undefined){state.revealed[b.dataset.reveal]=true;render();return}
if(b.dataset.studyAnswer!==undefined){const k=b.dataset.studyAnswer;const choice=Number(b.dataset.answer);if(k.startsWith('p')){let m=k.match(/^p(\d+)q(\d+)$/);if(m){let p=PAPERS[Number(m[1])];if(p){store.paperAnswers[p.id]??={};store.paperAnswers[p.id][Number(m[2])]=choice}}}else if(store.answers[k]===undefined){store.answers[k]=choice}save();render();return}
if(b.dataset.resetUnit!==undefined){const u=Number(b.dataset.resetUnit);Object.keys(store.answers).filter(k=>k.startsWith(`u${u}q`)).forEach(k=>delete store.answers[k]);save();render();toast('已清除本單元作答，可重新練習');return}
if(b.dataset.resetPaper!==undefined){const i=Number(b.dataset.resetPaper);delete store.paperAnswers[PAPERS[i]?.id];save();go(`paper/${i}/0`);toast('已清除本回作答，可重新測試');return}
if(b.dataset.complete!==undefined){let u=Number(b.dataset.complete);if(!store.completed.includes(u))store.completed.push(u);getWords(u).forEach(w=>{const key=w.word.toLowerCase();if(!store.reviewCards[key])store.reviewCards[key]={stage:0,due:dateOffset(1)}});store.completed.sort((a,b)=>a-b);store.unit=Math.min(UNITS-1,u+1);store.lastLearn=`learn/${store.unit}/0/0`;save();go(`learn/${store.unit}/0`);toast('完成一堂！新的知識又多一點 🌱');return}
if(b.dataset.copyNote!==undefined){copyNotes(Number(b.dataset.copyNote));return}
if(b.hasAttribute('data-print-note')){window.print();return}
if(b.hasAttribute('data-unit-jump')){let val=Number(document.getElementById('unit-select')?.value);if(val>=1&&val<=UNITS)go(`learn/${val-1}/0`);else toast('請輸入 1 到 '+UNITS+' 的單元');return}
if(b.hasAttribute('data-note-jump')){let val=Number(document.getElementById('notes-unit-input')?.value);if(val>=1&&val<=UNITS)go(`notes/${val-1}`);else toast('請輸入正確單元');return}
if(b.hasAttribute('data-more-words')){state.wordShown+=30;render();return}
if(b.id==='audio-settings-toggle'){let a=document.getElementById('audio-settings');a.hidden=!a.hidden;return}
if(b.id==='stop-speech'){window.speechSynthesis?.cancel();document.getElementById('speech-status').textContent='已停止';return}
});
document.addEventListener('input',e=>{let x=e.target;if(x.id==='morph-search'){let pos=x.selectionStart;state.rootSearch=x.value;state.rootGroupShown=24;render();const n=document.getElementById('morph-search');n?.focus();n?.setSelectionRange(pos,pos)}else if(x.id==='morph-detail-search'){let pos=x.selectionStart;const i=x.dataset.morphGroup;state.rootWordSearch[i]=x.value;state.rootWordShown[i]=8;render();const n=document.getElementById('morph-detail-search');n?.focus();n?.setSelectionRange(pos,pos)}else if(x.id==='word-search'){let pos=x.selectionStart;state.wordSearch=x.value;state.wordShown=30;render();const n=document.getElementById('word-search');n.focus();n.setSelectionRange(pos,pos)}else if(x.id==='grammar-search'){let pos=x.selectionStart;state.grammarSearch=x.value;render();const n=document.getElementById('grammar-search');n.focus();n.setSelectionRange(pos,pos)}});
document.addEventListener('change',e=>{if(e.target.id==='category-search'){state.wordCategory=e.target.value;state.wordShown=30;render()}});
render();
})();
