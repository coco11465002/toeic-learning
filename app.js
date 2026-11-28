(() => {
'use strict';
const WORDS=[...(window.TOEIC_VOCAB||[]),...(window.TOEIC_VOCAB_PLUS||[])];
const iw=WORDS.find(w=>w.word==='i');if(iw)iw.word='I';
const LESSONS=[...(window.TOEIC_LESSONS||[]),...(window.TOEIC_GRAMMAR_PLUS||[])];
const PAPERS=[...(window.TOEIC_PAPERS||[]),...(window.TOEIC_NEW_PAPERS||[])];
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
for(const story of [...(window.TOEIC_SKILL_STORIES||[]),...(window.TOEIC_SKILL_STORIES_EXTRA||[])])for(const line of story.lines||[])rememberExample(line.en,line.zh);

const starter=`I,you,he,she,we,they,the,a,an,this,that,student,teacher,book,pen,desk,read,write,work,study,learn,help,need,have,do,go,come,speak,say,tell,friend,family,home,school,office,manager,employee,team,meeting,report,email,day,week,today,tomorrow,yesterday,now,always,usually,often,sometimes,never,important,new,good,bad,small,big,happy,beautiful,quick,slow,carefully,quickly,name,time,morning,afternoon,evening,year,month,yes,no,can,will,should,may,person,people,business,company,job,customer,service,product,order,schedule,send,receive,call,answer,question,open,close,buy,sell,price,money,pay,bus,train,ticket,arrive,leave,travel,phone,computer,information,document,form,finish,start,complete,apply,application,applicant,interview,hiring,hire,confirm,cancel,postpone,deadline,submit,provide,prepare,attend,request,reply,thank,please,sorry,another,some,any,many,much,more,most,few,little,first,last,after,before,because,but,and,or,with,without,for,since,at,in,on,by,from,to,into,up,down,under,over,between,among,near,about,before,after,customer,delivery,discount,refund,invoice,receipt,contract,agreement,budget,salary,policy,procedure,quality,quantity,inventory,warehouse,shipment,reservation,appointment,location,transportation,experience,ability,skill,opportunity,responsibility,requirement,affect,effect,accept,except,borrow,lend,increase,decrease,efficient,effective,maintain,replace,update,install,device,software,network,access,security,available,necessary,possible,successful,develop,evaluate,recommend,establish,improve,reduce,frequently,supply,make,decision,mistake,careful,compare,different,similar`.split(',');
const priority=[];const used=new Set();
function addWord(w){let item=WORD_MAP.get(w.toLowerCase());if(item&&!used.has(item.word.toLowerCase())){used.add(item.word.toLowerCase());priority.push(item)}}
starter.forEach(addWord);
const sourceOrder={'基礎增補':1,'基礎字庫':2,'原書':3,'補充':4};
WORDS.slice().sort((a,b)=>(sourceOrder[a.source]||6)-(sourceOrder[b.source]||6)).forEach(w=>addWord(w.word));
const UNITS=Math.ceil(priority.length/5);
const storageKey='toeic-smallsteps-v5';
let store,storageWorking=true,storageIssue='';
try{const raw=localStorage.getItem(storageKey);store=raw?JSON.parse(raw):{};}catch(err){store={};storageWorking=false;storageIssue='目前瀏覽器無法讀取已保存的資料';}

store={unit:0,completed:[],answers:{},paperAnswers:{},toeicAnswers:{},...(store||{})};
if(!Array.isArray(store.completed))store.completed=[];
if(!store.answers||typeof store.answers!=='object')store.answers={};
if(!store.paperAnswers||typeof store.paperAnswers!=='object')store.paperAnswers={};
if(!store.toeicAnswers||typeof store.toeicAnswers!=='object')store.toeicAnswers={};
if(!store.storyAnswers||typeof store.storyAnswers!=='object')store.storyAnswers={};
function save(){
 try{
  store.savedAt=new Date().toISOString();
  const data=JSON.stringify(store);
  localStorage.setItem(storageKey,data);
  if(localStorage.getItem(storageKey)!==data)throw new Error('Storage read-back failed');
  storageWorking=true;storageIssue='';
  const dot=document.getElementById('save-indicator');if(dot){dot.textContent='● 已存於此瀏覽器';dot.classList.remove('not-saved');}
  return true;
 }catch(err){
  storageWorking=false;storageIssue='無法在此瀏覽器保存學習內容，請確認不是無痕視窗並允許網站儲存資料';
  const dot=document.getElementById('save-indicator');if(dot){dot.textContent='⚠ 學習內容尚未保存';dot.classList.add('not-saved');}
  return false;
 }
}
const state={wordSearch:'',wordCategory:'',wordShown:30,grammarSearch:'',revealed:{},rootCategory:'all',rootSearch:'',rootGroupShown:24,rootWordShown:{},rootWordSearch:{},rootRevealed:{},rootQuiz:{},rootQuizStep:{},storyLevel:{reading:'all',listening:'all'},storySearch:{reading:'',listening:''},storySort:{reading:'curriculum',listening:'curriculum'},noteSearch:'',noteRange:null,noteRouteUnit:null,learnRange:null,learnRouteUnit:null,grammarLevel:'all',paperSearch:'',storyTranslations:{},storyTranscripts:{},paperGroup:'intro',paperShown:10};
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
 const examples=[...(lesson.examples||[]).slice(0,5).map(x=>({en:x[0],zh:x[1],topic:lesson.title})),...(partner.examples||[]).slice(0,5).map(x=>({en:x[0],zh:x[1],topic:partner.title}))];
 return {lesson,partner,subset:main,concepts,examples,review,part:round};
}
function getWords(u){return priority.slice(u*5,(u+1)*5)}
function spl(w){let s=w.split||w.word;if(!s||s.toLowerCase()===w.word.toLowerCase())return [w.word];const p=s.split(/\s*[/|•]\s*/).filter(Boolean);return p.length? p:[w.word]}
function chunksHtml(w){const p=spl(w);if(p.length===1)return `<div class="word-chunks"><span class="chunk">${esc(w.word)}</span><span class="tiny muted">此字暫保留整字；不代表一定只有一個音節</span></div>`;return `<div class="word-chunks">${p.map((x,i)=>`${i?'<span class="chunk-separator">/</span>':''}<span class="chunk">${esc(x)}</span>`).join('')}</div>`}
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
function grammarPaint(en,topic){let i=LESSONS.findIndex(x=>x.title===topic);const l=LESSONS[i];const cues=G_FOCUS[i]||[];if(cues.length)return paint(en,cues);const specials=['there','is','are','was','were','will','have','has','had','been','to','in','on','at','of','by','until','since','for','if','unless','should','could','must','may','might','would','than','not','also','either','neither','because','although','however','therefore','who','which','that','what','where','when','only','first','next','finally'];const raw=[l?.title,...(l?.rules||[]).map(x=>x[0])].join(' ').toLowerCase();return paint(en,specials.filter(x=>new RegExp('\\b'+x+'\\b').test(raw)))}
function grammarExample(x,i){return `<div class="example-row highlighted-example"><div><span class="tiny muted">${esc(x.topic||'文法例句')} · ${i+1}</span><br><strong>${grammarPaint(x.en,x.topic)}</strong><span>${esc(x.zh)}</span></div>${playBtn(x.en,'聽整句')}</div>`}
function related(title,raw,override){let items=override?.length?override.map(([en,zh])=>({en,zh})):tokens(raw).map(en=>({en:en.replace(/\s*\([^)]*\)/g,''),zh:getZ(en.replace(/\s*\([^)]*\)/g,''))})).filter(x=>x.zh);if(!items.length)return '';return `<div class="detail-line"><div class="detail-label">${esc(title)}</div><div class="chip-row">${items.map(({en,zh})=>`<div class="chip-word"><span><strong>${esc(en)}</strong><small>${esc(zh)}</small></span>${playBtn(en,'聽')}</div>`).join('')}</div></div>`}
function usage(w){const arr=collocations(w);if(!arr.length)return '';return `<div class="detail-line"><div class="detail-label">常見搭配 · 中英對照</div>${arr.map(({en,zh})=>`<div class="pair readable-pair"><div><strong>${wordPaint(en,w)}</strong><br><em>${esc(zh)}</em></div>${playBtn(en,'聽搭配')}</div>`).join('')}</div>`}
function exampleBlock(w,limit=3){const arr=examplesFor(w).slice(0,limit);if(!arr.length)return '';return `<div class="detail-line"><div class="detail-label">情境例句 · 重點已標色</div>${arr.map((x,i)=>`<div class="example-row highlighted-example"><div><small class="tiny muted">例句 ${i+1}</small><br><strong>${wordPaint(x.en,w)}</strong><span>${esc(x.zh)}</span></div>${playBtn(x.en,'聽整句')}</div>`).join('')}</div>`}
function wordDetails(w,expanded=true){const p=enriched(w),pieces=`<div class="detail-line"><div class="detail-label">🧩 拼字記憶拆分</div>${chunksHtml(w)}<div class="tiny muted">這是拼字記憶分段，不代表正式字根或音標。</div></div>`;
const full=`${usage(w)}${exampleBlock(w)}${related('同義／近義詞',w.synonyms,p.synonyms)}${related('反義／對比詞',w.antonyms,p.antonyms)}${related('容易混淆的詞',w.confusing,p.confusing)}${related('同字族與派生詞',w.family,p.family)}${w.forms?`<div class="detail-line"><div class="detail-label">動詞變化 · 聽每一種形式</div><div class="chip-row">${(Array.isArray(w.forms)?w.forms:[w.forms]).map((f,i)=>`<div class="chip-word"><small>${['原形','第三人稱','過去式','過去分詞','-ing','未來式'][i]||'變化'}</small><strong>${esc(f)}</strong>${playBtn(f,'聽')}</div>`).join('')}</div></div>`:''}${usefulNote(w)?`<div class="word-note-compact">💡 ${esc(usefulNote(w))}</div>`:''}`;
return `<div class="word-insight">${pieces}${w.base_word?`<p class="form-base-note">↳ 原形單字：<button class="mini-btn" data-route="word/${encodeURIComponent(w.base_word)}">${esc(w.base_word)}（點我查看）</button>・${esc(w.form_label||'詞形變化')}</p>`:''}${expanded?full:`<details class="more-info"><summary>查看完整例句、常見搭配與字族</summary><div class="word-insight">${full}</div></details>`}</div>`}
function stepNav(u,step,idx){const steps=['文法','單字','例句','小練習','手寫筆記'];return `<div class="lesson-tabs">${steps.map((s,i)=>`<button class="${step===i?'active':''} ${store.completed.includes(u)?'done':''}" data-route="learn/${u}/${i}/${i===1?idx:0}">${['01','02','03','04','05'][i]} ${s}</button>`).join('')}</div>`}
function learnHeader(u){const st=stage(u);return `<div class="learning-header"><div><span class="eyebrow">LEVEL ${st.id} · ${esc(st.title)}</span><h1>第 ${u+1} 單元 <span class="pill ${st.color}">2 個相關文法主題 · 5 個單字</span></h1><p>先學文法，再看單字與例句；理解後做練習，最後整理手寫筆記。</p></div><details class="lesson-switch no-print"><summary>切換單元（共 ${UNITS} 個）</summary>${unitPicker(u,'learn')}</details></div>`}
function learnGrammar(u){const {lesson,partner,concepts,examples,review}=ruleFor(u);return `<div class="step-top"><div><span class="pill blue">${review?'兩個文法主題再應用':'兩個相連的文法主題'}</span><h2>${esc(lesson.title)} ＋ ${esc(partner.title)}</h2></div></div><div class="topic-pair"><div class="topic-tag coral"><small>主題 A</small><strong>${esc(lesson.title)}</strong><p>${esc(lesson.subtitle||'')}</p><button class="mini-btn" data-route="grammar/${LESSONS.indexOf(lesson)}">完整教學 ↗</button></div><div class="topic-tag mint"><small>主題 B</small><strong>${esc(partner.title)}</strong><p>${esc(partner.subtitle||'')}</p><button class="mini-btn" data-route="grammar/${LESSONS.indexOf(partner)}">完整教學 ↗</button></div></div><div class="unit-learning-note">先把這 3 個觀念聽懂即可。更多規則和完整例句都會收錄到後面的手寫筆記。</div>${concepts.map((c,i)=>`<div class="rule-note"><span class="tiny muted">${i+1} / 3 · ${esc(c.topic)}</span><strong>${esc(c.title)}</strong><p>${esc(c.detail)}</p></div>`).join('')}<h3 class="learning-mini-heading">把兩個主題放進例句</h3>${examples.slice(0,4).map((x,i)=>grammarExample(x,i)).join('')}<div class="step-actions"><button class="btn btn-ghost" data-route="home">回首頁</button><button class="btn btn-primary" data-route="learn/${u}/1/0">繼續學 5 個單字 →</button></div>`}
function learnWord(u,idx){const w=getWords(u)[idx];if(!w)return `<div class="panel"><h2>這個單元沒有單字資料</h2></div>`;const key=`${u}:${idx}`,revealed=!!state.revealed[key];return `<div class="word-focus-head"><span class="pill peach">新單字 ${idx+1} / ${getWords(u).length}</span><span class="muted tiny">先猜意思，再翻開</span></div><div class="word-focus-box"><span class="word-number">VOCABULARY · ${esc(w.category||'基礎')}</span><h2 class="word-english">${esc(w.word)}</h2>${playBtn(w.word,'播放英文')}<div style="margin-top:19px"><span class="detail-label">🧩 拆分記憶</span>${chunksHtml(w)}</div>${morphMembership(w,true)}${revealed?`<div class="reveal-card"><div class="word-type">${esc(w.pos||'詞性待補')}</div><div class="meaning">${esc(w.meaning)}</div>${wordDetails(w,false)}</div>`:`<button class="btn btn-mint" data-reveal="${key}">翻開中文與用法 👀</button>`}</div><div class="step-actions"><button class="btn btn-ghost" data-route="learn/${u}/${idx===0?0:1}/${idx===0?0:idx-1}">← ${idx===0?'文法':'上一個'}</button><button class="btn btn-primary" data-route="learn/${u}/${idx===getWords(u).length-1?2:1}/${idx===getWords(u).length-1?0:idx+1}">${idx===getWords(u).length-1?'看例句 →':'下一個字 →'}</button></div>`}
function learnExamples(u){const pack=ruleFor(u);const examples=pack.examples.slice(0,10).map(x=>({...x,label:'文法例句'}));getWords(u).forEach(w=>examplesFor(w).slice(0,2).forEach(x=>examples.push({...x,label:'單字例句',topic:w.word}))); return `<div class="step-top"><div><span class="pill mint">把句子聽熟</span><h2>兩個文法主題的例句</h2></div></div><p>先讀英文，再聽一次、對照中文。每次只理解一個句子；文法與單字的重點會用色塊標示；整個單元的例句也會收在筆記中。</p>${examples.map((x,i)=>x.label==='單字例句'?`<div class="example-row highlighted-example"><div><span class="tiny muted">單字 ${esc(x.topic)} · ${i+1}</span><br><strong>${wordPaint(x.en,WORD_MAP.get((x.topic||'').toLowerCase())||{word:x.topic})}</strong><span>${esc(x.zh)}</span></div>${playBtn(x.en,'聽例句')}</div>`:grammarExample(x,i)).join('')}<div class="step-actions"><button class="btn btn-ghost" data-route="learn/${u}/1/${getWords(u).length-1}">← 單字</button><button class="btn btn-primary" data-route="learn/${u}/3">立即小練習 →</button></div>`}
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
function quizItem(q,key,idx){const m=String(key).match(/^p(\d+)q(\d+)$/);const a=m?(store.paperAnswers[PAPERS[Number(m[1])]?.id]||{})[Number(m[2])]:store.answers[key];return `<div class="practice-card"><span class="pill ${idx%2?'blue':'peach'}">第 ${idx+1} 題 · ${esc(q.kind)}</span><h3 style="white-space:pre-line">${esc(q.stem)}</h3>${q.audio?playBtn(q.audio,'聽英文'):'<span class="tiny muted">閱讀題：先閱讀英文再作答</span>'}<div class="options" style="margin-top:15px">${q.options.map((op,i)=>`<button class="option ${a!==undefined?(i===q.correct?'correct':i===a?'incorrect':''):''}" data-study-answer="${esc(key)}" data-answer="${i}" ${a!==undefined?'disabled':''}><b>${'ABCD'[i]}.</b> ${esc(op)}</button>`).join('')}</div>${a!==undefined?`<div class="explain"><strong>${a===q.correct?'✓ 答對了！':'再記住一次就好'}　正確答案：${'ABCD'[q.correct]}</strong><p>${esc(q.explanation)}</p>${q.detail?`<p>${esc(q.detail)}</p>`:''}${q.details?.map((x,i)=>`<div><b>${'ABCD'[i]}.</b> ${esc(x)}</div>`).join('')||''}${q.transcript?`<details class="listening-transcript"><summary>查看聽力逐字稿</summary><p>${esc(q.transcript)}</p></details>`:''}</div>`:''}</div>`}
function learnQuiz(u){const qs=quizData(u);const done=qs.filter((x,i)=>store.answers[`u${u}q${i}`]!==undefined).length;return `<div class="step-top"><div><span class="pill yellow">不用急著考多益</span><h2>${qs.length} 題小練習</h2></div><span class="tiny muted">已作答 ${done} / ${qs.length}</span></div><p>兩個文法主題都會出題，再搭配單字理解；答錯可以對照中文解釋重新看一次。</p>${qs.map((q,i)=>quizItem(q,`u${u}q${i}`,i)).join('')}${done?`<button class="mini-btn" data-reset-unit="${u}">↻ 重新練習本單元</button>`:''}<div class="step-actions"><button class="btn btn-ghost" data-route="learn/${u}/2">← 重聽例句</button><button class="btn btn-primary" data-route="learn/${u}/4">整理手寫筆記 →</button></div>`}
function noteText(u){
 const {lesson,partner,concepts,examples}=ruleFor(u),words=getWords(u);
 const lines=[`✎ 第 ${u+1} 單元｜我的英文學習手帳`,`日期：____________`,`本單元兩個主題：${lesson.title} ／ ${partner.title}`,'','════ 文法筆記｜先懂，再比較 ════',`〔主題 A〕${lesson.title}`,...(lesson.paragraphs||[]),`〔主題 B〕${partner.title}`,...(partner.paragraphs||[]),'','〔本次 3 個學習觀念〕'];
 concepts.forEach((c,i)=>lines.push(`${i+1}. ${c.title}（${c.topic}）`,`   ${c.detail}`));
 lines.push('','〔兩個主題的完整規則與判斷方法〕');
 [lesson,partner].forEach((l,k)=>{lines.push(`【${k?'B':'A'} ${l.title}】`);(l.rules||[]).forEach(([a,b],i)=>lines.push(`  ${i+1}. ${a}：${b}`));});
 lines.push('','〔例句・中英對照〕');
 examples.slice(0,10).forEach((x,i)=>lines.push(`${i+1}. ${x.en}`,`   ${x.zh}`));
 lines.push('','〔兩個觀念一起記〕',`A. ${lesson.title}：${lesson.tip||lesson.subtitle}`,`B. ${partner.title}：${partner.tip||partner.subtitle}`,'','〔中翻英・自己再寫一次〕');
 examples.slice(0,4).forEach((x,i)=>lines.push(`${i+1}. ${x.zh}`,'   英文：________________________________________'));
 lines.push('','〔常見錯誤與訂正〕',`A. ${lesson.tip||lesson.subtitle}`,`B. ${partner.tip||partner.subtitle}`,'','','〔我自己的補充筆記〕','________________________________________________','________________________________________________','','════ 單字筆記｜五個字慢慢記 ════');
 words.forEach((w,i)=>{
  lines.push(`${i+1}. ${w.word} ${w.pos||''}｜${w.meaning}`,`   拼字記憶：${spl(w).join(' / ')}`,`   字根／字族：${morphBrief(w)}`);
  collocations(w).slice(0,2).forEach(c=>lines.push(`   搭配：${c.en}（${c.zh}）`));
  examplesFor(w).slice(0,2).forEach(x=>lines.push(`   例句：${x.en}`,`   中文：${x.zh}`));
  const rel=enriched(w).synonyms?.[0];if(rel)lines.push(`   近義字：${rel[0]}（${rel[1]}）`);
  if(w.base_word)lines.push(`   基本原形：${w.base_word}（${w.form_label||'詞形變化'}）`);
  lines.push('   我自己造句：___________________________________','');
 });
 lines.push('〔讀完後試試〕□ 遮中文想意思　□ 朗讀例句　□ 自己造句');
 return lines.join('\n');
}
function noteHtml(u){
 const {lesson,partner,concepts,examples}=ruleFor(u),words=getWords(u);
 const conceptCards=concepts.map((c,i)=>`<div class="scribble-rule study-concept"><span class="ink-number">${String(i+1).padStart(2,'0')}</span><div><span class="note-topic-label">${esc(c.topic)}</span><b class="marker-underline">${esc(c.title)}</b><p>${esc(c.detail)}</p></div></div>`).join('');
 const examplesHTML=examples.slice(0,10).map((x,i)=>`<div class="hand-example"><span class="small-bubble">${i+1}</span><div><span class="note-topic-label">${esc(x.topic)}</span><b>${grammarPaint(x.en,x.topic)}</b><small>${esc(x.zh)}</small></div></div>`).join('');
 const rulesHTML=[{l:lesson,label:'A'},{l:partner,label:'B'}].map(t=>`<div class="note-rule-topic"><h4>${esc(t.l.title)}</h4>${(t.l.rules||[]).slice(0,6).map(([a,b],i)=>`<div class="note-rule-item"><span>${i+1}</span><div><b>${esc(a)}</b><p>${esc(b)}</p></div></div>`).join('')}</div>`).join('');
 const intro=[{l:lesson,label:'A'},{l:partner,label:'B'}].map(x=>`<div class="grammar-explain-block"><strong><span class="note-topic-pill">主題 ${x.label}</span> ${esc(x.l.title)}</strong>${(x.l.paragraphs||[]).slice(0,2).map(y=>`<p>${esc(y)}</p>`).join('')}</div>`).join('');
 const entries=words.map((w,i)=>{
  const common=collocations(w).slice(0,2),examples=examplesFor(w).slice(0,2),relatedWord=enriched(w).synonyms?.[0],antonym=enriched(w).antonyms?.[0],note=usefulNote(w);
  return `<div class="hand-word"><span class="hand-word-num">${i+1}</span><div class="hand-word-main"><div class="hand-word-head"><strong>${esc(w.word)}</strong><span>${esc(w.pos||'')}</span></div><div class="hand-word-meaning">${esc(w.meaning)}</div><div class="hand-word-split">🧩 拼字記憶：${esc(spl(w).join(' / '))}</div><div class="hand-word-class">🧬 分類：${esc(morphBrief(w))}</div>${common.map(c=>`<div class="hand-word-usage"><b>搭配：</b>${wordPaint(c.en,w)}　<span>${esc(c.zh)}</span></div>`).join('')}${examples.map((x,j)=>`<div class="hand-word-usage"><b>例句 ${j+1}：</b>${wordPaint(x.en,w)}<br><span>中文：${esc(x.zh)}</span></div>`).join('')}${relatedWord?`<div class="hand-word-usage"><b>近義字：</b>${esc(relatedWord[0])}（${esc(relatedWord[1])}）</div>`:''}${antonym?`<div class="hand-word-usage"><b>反義／對比：</b>${esc(antonym[0])}（${esc(antonym[1])}）</div>`:''}${w.base_word?`<div class="hand-word-usage"><b>原形：</b>${esc(w.base_word)}（${esc(w.form_label||'詞形變化')}）</div>`:''}${note?`<div class="hand-word-usage"><b>補充：</b>${esc(note)}</div>`:''}<div class="write-my-own"><b>我造句：</b><span class="writing-line"></span></div><div class="note-write-lines" aria-hidden="true"><i></i></div></div></div>`;
 }).join('');
 return `<div class="notebook-spread notebook-detailed" id="note-content" aria-label="第 ${u+1} 單元的詳細文法與單字手帳">
 <style media="print">@page{@top-right{content:"第 ${u+1} 單元 · 學習講義";font-family:"Noto Sans CJK TC",sans-serif;font-weight:600;font-size:8pt;color:#576f80}}</style>
 <article class="notebook-sheet sheet-grammar">
  <div class="notebook-holes" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="paper-sticker sticker-coral" aria-hidden="true">✿</div>
  <header class="sheet-header"><span class="sheet-eyebrow">✎ MY GRAMMAR NOTES</span><span class="sheet-number">文法篇</span></header>
  <h3 class="notebook-title">${esc(lesson.title)} <span class="notebook-plus">＋</span> ${esc(partner.title)}</h3>
  <div class="sheet-meta">第 ${u+1} 單元　／　日期：____________　／　2 個主題・3 個核心觀念・完整規則</div>
  <div class="notebook-layout"><aside class="cue-column"><strong>小提示</strong><span>先懂意思</span><span>規則與用法</span><span>例句怎麼說？</span><span>差異與易錯</span><span>自己再寫</span><span class="cue-star">✳︎</span></aside>
   <div class="notes-main"><div class="scribble-heading"><span>01</span> 上課先搞懂 <i>learn</i></div>${intro}
    <div class="scribble-heading"><span>02</span> 三個觀念＋完整規則 <i>rules</i></div>${conceptCards}${rulesHTML}
    <div class="scribble-heading"><span>03</span> 例句＋中文抄寫 <i>examples</i></div>${examplesHTML}
    <div class="scribble-heading"><span>04</span> 相似觀念放在一起 <i>compare!</i></div>
    <div class="grammar-compare"><div><small>主題 A · ${esc(lesson.title)}</small><p>${esc(lesson.tip||lesson.subtitle)}</p></div><div><small>主題 B · ${esc(partner.title)}</small><p>${esc(partner.tip||partner.subtitle)}</p></div></div>
    <div class="scribble-heading"><span>05</span> 換我寫英文 <i>try it!</i></div>
    <div class="note-translation-exercises">${examples.slice(0,4).map((x,i)=>`<div class="note-translation"><b>${i+1}. ${esc(x.zh)}</b><span class="note-write-lines"><i></i><i></i></span></div>`).join('')}</div>
    <div class="scribble-heading"><span>06</span> 我自己的補充</div><div class="note-write-lines note-free-lines" aria-label="自由書寫空間"><i></i><i></i><i></i></div>
   </div></div>
  <footer class="note-summary"><b>今天能不能自己說出？</b><span>□ 我能分清楚兩個文法主題　□ 我能讀出例句　□ 我能自己寫一句</span></footer>
 </article>
 <article class="notebook-sheet sheet-vocab">
  <div class="notebook-holes" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="paper-sticker sticker-mint" aria-hidden="true">★</div>
  <header class="sheet-header"><span class="sheet-eyebrow">✿ MY WORD COLLECTION</span><span class="sheet-number">單字篇</span></header>
  <h3 class="notebook-title">今天收集的 5 個字</h3>
  <div class="sheet-meta">中文意思 → 拆分記憶 → 搭配／例句 → 自己造句</div>
  <div class="word-notebook-collection">${entries}</div>
  <footer class="note-summary"><b>再試試這三件事</b><span>□ 遮中文想意思　□ 聽英文跟讀　□ 挑兩個字自己造句</span></footer>
 </article></div>`;
}
function learnNotes(u){return `<div class="step-top"><div><span class="pill peach">✎ NOTEBOOK TIME</span><h2>我的完整課堂筆記</h2></div></div><p class="notebook-intro">本單元有兩個相關文法主題與完整規則、六到十組中英例句、易錯提醒、四題中翻英；下方另有五個單字的拆分、變化及例句筆記。依照順序慢慢抄，不用一次抄完。</p>${noteHtml(u)}<div class="step-actions"><button class="btn btn-ghost" data-copy-note="${u}">複製完整文字筆記</button><button class="btn btn-ghost" data-print-note>列印手帳頁</button><button class="btn btn-primary" data-complete="${u}">${store.completed.includes(u)?'已完成，下一單元 →':'完成今天的學習 ✓'}</button></div>`}
function learnPage(r){const u=clip(r[1]===undefined?store.unit:Number(r[1]),0,UNITS-1),step=clip(r[2]===undefined?0:Number(r[2]),0,4),idx=clip(Number(r[3]||0),0,4);store.unit=u;store.lastLearn=`learn/${u}/${step}/${idx}`;save();const blocks=[()=>learnGrammar(u),()=>learnWord(u,idx),()=>learnExamples(u),()=>learnQuiz(u),()=>learnNotes(u)];return `${learnHeader(u)}${stepNav(u,step,idx)}<section class="panel learn-panel" aria-label="本單元內容">${blocks[step]()}</section><div class="section-header"><p class="tiny muted">需要再看其他單字時，可以打開單字庫。</p><button class="text-button" data-route="words">有需要時查單字庫 ↗</button></div>`}
function homePage(){
 const u=clip(store.unit,0,UNITS-1);
 const now=ruleFor(u);
 const resume=store.lastLearn&&store.lastLearn.startsWith(`learn/${u}/`)?store.lastLearn:`learn/${u}/0`;
 return `<section class="home-hero v11-hero"><div class="content"><span class="eyebrow">✿ MY ENGLISH JOURNAL</span><h1>今天只要<br><em>學好這一小步</em></h1><p>今天的主題：<strong>${esc(now.lesson.title)}</strong>，搭配「${esc(now.partner.title)}」。跟著課程慢慢學，不用盯著進度條。</p><div class="hero-actions"><button class="btn btn-primary" data-route="${resume}">開始今天的學習 →</button></div></div><div class="hero-art" aria-hidden="true"><div class="hero-washi"></div><div class="hero-art-top">TODAY'S LITTLE PLAN <span>✿</span></div><strong>one step<br>at a time!</strong><div class="hero-art-bottom"><span>☑ 兩個文法觀念</span><span>☑ 五個單字</span><span>☑ 例句、練習、筆記</span></div></div></section>
 <div class="v12-home-simple story-home-shortcuts"><button class="v12-home-shortcut" data-route="reading"><span>📖</span><span><strong>讀一篇短文</strong><small>逐句理解・中文對照・重點字</small></span><b>前往 ›</b></button><button class="v12-home-shortcut" data-route="listening"><span>🎧</span><span><strong>練一段聽力</strong><small>先聽不看稿・慢速朗讀・理解題</small></span><b>前往 ›</b></button></div>`;
}
function toolsPage(){return `<header class="library-header"><span class="eyebrow">MY STUDY TOOLBOX</span><h1>學習工具箱 <span class="pill mint">有需要再打開</span></h1><p>上課中遇到不懂的單字或文法，來這裡查就好。所有資料都保留，不用在上方擠滿八個選單。</p></header><div class="v11-tool-grid">
 <button class="v11-tool-card tool-coral" data-route="words"><span class="tool-icon">Aa</span><div><h2>單字庫</h2><p>${WORDS.length.toLocaleString()} 個單字與詞組，附中文、發音、拆分與相關字族。</p><small>查單字 →</small></div></button>
 <button class="v11-tool-card tool-mint" data-route="roots"><span class="tool-icon">✣</span><div><h2>字根・字族</h2><p>${MORPH.length} 組分類。學一個字，認識它的衍生字與詞綴。</p><small>找字族 →</small></div></button>
 <button class="v11-tool-card tool-lilac" data-route="grammar"><span class="tool-icon">✎</span><div><h2>文法庫</h2><p>${LESSONS.length} 個文法主題。有不清楚的規則可以回來看例句。</p><small>查文法 →</small></div></button>
 <button class="v11-tool-card tool-yellow" data-route="notes"><span class="tool-icon">✎</span><div><h2>我的英文筆記</h2><p>每單元兩個文法主題、完整規則與多個例句，還有五個單字的詞性與用法。</p><small>開啟筆記 →</small></div></button></div><div class="v11-tool-tip"><strong>不確定從哪裡開始？</strong> 正常上課直接按「開始學習」，工具箱是遇到疑問時才來查。</div>`}
function wordsPage(){const q=state.wordSearch.trim().toLowerCase(),c=state.wordCategory;let a=priority.filter(w=>(!c||w.category===c)&&(!q||w.word.toLowerCase().includes(q)||w.meaning.includes(q))),shown=a.slice(0,state.wordShown);const categories=[...new Set(WORDS.map(x=>x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-Hant'));return `<header class="library-header"><span class="eyebrow">MY VOCABULARY SHELF</span><h1>單字庫 <span class="pill peach">${WORDS.length.toLocaleString()} 字</span></h1><p>查單字時可以看完整搭配與詞族；正式學習還是建議從每天 5 個字開始。</p></header><div class="search-row"><input type="search" id="word-search" placeholder="搜尋英文或中文，例如：office、員工" value="${esc(state.wordSearch)}"><select id="category-search"><option value="">所有類別</option>${categories.map(x=>`<option ${x===c?'selected':''}>${esc(x)}</option>`).join('')}</select></div><div class="tiny muted" style="margin-bottom:15px">找到 ${a.length} 筆，現在顯示 ${shown.length} 筆</div><div class="library-grid">${shown.map(w=>`<button class="vocab-tile" data-route="word/${encodeURIComponent(w.word)}"><span class="pill mint">${esc(w.pos||'單字')}</span><strong>${esc(w.word)}</strong><p>${esc(w.meaning)}</p><small>🧩 ${esc(spl(w).join(' / '))}</small><span class="vocab-morph-label">🧬 ${esc(morphBrief(w))}</span></button>`).join('')}</div>${a.length>state.wordShown?`<div class="pager"><button class="btn btn-ghost" data-more-words>再看 30 個 ↓</button></div>`:''}`}
function wordPage(r){const w=WORD_MAP.get((r[1]||'').toLowerCase());if(!w)return `<div class="panel"><h2>找不到這個單字</h2><button class="btn btn-ghost" data-route="words">回到單字庫</button></div>`;const position=priority.indexOf(w);return `<div class="library-header"><span class="eyebrow">FOCUS ON ONE WORD</span><div class="word-detail-title"><div><h1>${esc(w.word)}</h1><span class="pill mint">${esc(w.pos||'詞性待補')}</span><span class="pill blue">${esc(w.category||'詞彙')}</span></div>${playBtn(w.word,'聽單字')}</div><p class="meaning">${esc(w.meaning)}</p></div><article class="panel word-detail-full"><span class="detail-label">一步一步記住單字</span>${morphMembership(w)}${wordDetails(w,true)}<div class="soft-recall"><strong>遮住中文，能不能說出這個字的意思？</strong><p>再聽一遍發音，從例句中找到重點色塊。</p></div></article><div class="step-actions"><button class="btn btn-ghost" data-back>← 回上一頁</button>${position>=0?`<button class="btn btn-primary" data-route="word/${encodeURIComponent(priority[(position+1)%priority.length].word)}">下一個單字 →</button>`:''}</div>`}
function grammarPage(r){if(r.length>1){const l=LESSONS[clip(Number(r[1]),0,LESSONS.length-1)];return `<header class="library-header"><span class="eyebrow">GRAMMAR LIBRARY · ${esc(l.level)}</span><h1>${esc(l.title)}</h1><p>${esc(l.subtitle)}</p></header><article class="panel"><h2>先理解基本觀念</h2>${(l.paragraphs||[]).map(x=>`<p>${esc(x)}</p>`).join('')}<div class="section-header"><h2>重要規則</h2></div>${(l.rules||[]).map(([a,b],i)=>`<div class="rule-note"><span class="tiny muted">${i+1}</span><strong>${esc(a)}</strong><p>${esc(b)}</p></div>`).join('')}<div class="section-header"><h2>例句慢慢聽</h2></div>${(l.examples||[]).map(([en,zh],i)=>grammarExample({en,zh,topic:l.title},i)).join('')}<div class="word-note-compact" style="margin-top:20px">⭐ ${esc(l.tip||'')}</div></article><div class="step-actions"><button class="btn btn-ghost" data-back>← 返回上一頁</button><button class="btn btn-primary" data-route="learn/${Math.min(LESSONS.indexOf(l)*2,UNITS-1)}/0">搭配小單元練習 →</button></div>`}
const q=state.grammarSearch.trim().toLowerCase(),level=state.grammarLevel;const levels=[...new Set(LESSONS.map(x=>x.level).filter(Boolean))];const list=LESSONS.map((x,i)=>({...x,index:i})).filter(x=>(level==='all'||x.level===level)&&(!q||x.title.toLowerCase().includes(q)||x.subtitle.toLowerCase().includes(q)||(x.rules||[]).some(rule=>rule.join(' ').toLowerCase().includes(q))));return `<header class="library-header"><span class="eyebrow">YOUR GRAMMAR HANDBOOK</span><h1>文法庫 <span class="pill blue">${LESSONS.length} 堂</span></h1><p>課程會從基本句型慢慢加深。需要複習哪個觀念，再來這裡查。</p></header><div class="search-row filter-search"><label>搜尋文法<input type="search" id="grammar-search" placeholder="現在式、主詞、關係子句…" value="${esc(state.grammarSearch)}"></label><label>學習程度<select id="grammar-level"><option value="all">全部程度</option>${levels.map(x=>`<option value="${esc(x)}" ${x===level?'selected':''}>${esc(x)}</option>`).join('')}</select></label></div><div class="filter-result-count">找到 ${list.length} / ${LESSONS.length} 個文法主題</div><div class="grammar-grid">${list.map((l,i)=>`<button class="grammar-tile" data-route="grammar/${l.index}"><span class="pill ${i%2?'peach':'mint'}">第 ${l.index+1} 堂 · ${esc(l.level)}</span><h3>${esc(l.title)}</h3><p>${esc(l.subtitle)}</p></button>`).join('')}</div>`}
function unitOptionTitle(u){
 const pair=ruleFor(u),ws=getWords(u).slice(0,2).map(w=>w.word).join('、');
 return `第 ${u+1} 單元｜${pair.lesson.title} ＋ ${pair.partner.title}${ws?'｜'+ws:''}`;
}
function unitRangeOptions(active){
 let out='<option value="all"'+(active==='all'?' selected':'')+'>全部單元</option>';
 for(let a=0;a<UNITS;a+=100){const b=Math.min(a+100,UNITS);out+=`<option value="${a/100}" ${String(active)===String(a/100)?'selected':''}>第 ${a+1}～${b} 單元</option>`;}
 return out;
}
function unitPicker(u,kind){
 const notes=kind==='notes',currentRange=Math.floor(u/100);
 if(!notes){if(state.learnRange===null||(state.learnRouteUnit!==u&&state.learnRange!=='all'&&Number(state.learnRange)!==currentRange))state.learnRange=currentRange;state.learnRouteUnit=u;}
 const range=notes?(state.noteRange===null?currentRange:state.noteRange):(state.learnRange===null?currentRange:state.learnRange);
 const q=notes?state.noteSearch.trim().toLowerCase():'';
 const entries=[];
 for(let k=0;k<UNITS;k++){
  if(range!=='all'&&Math.floor(k/100)!==Number(range))continue;
  if(q&&!String(k+1).includes(q)&&!unitOptionTitle(k).toLowerCase().includes(q)&&!getWords(k).some(w=>w.meaning.includes(q)))continue;
  entries.push(k);
 }
 const id=notes?'notes':'learn';
 return `<div class="unit-finder ${notes?'unit-finder-notes':''}">
  <div class="finder-title"><strong>選擇${notes?'筆記':'學習'}單元</strong><span>共 ${UNITS.toLocaleString('zh-TW')} 個單元 · 目前第 ${u+1} 單元</span></div>
  <div class="unit-finder-grid"><label>單元範圍<select id="${id}-range" aria-label="單元範圍">${unitRangeOptions(range)}</select></label>
  ${notes?`<label class="unit-search-box">搜尋單元或單字<input id="notes-unit-search" type="search" autocomplete="off" placeholder="單元編號、文法、英文、中文" value="${esc(state.noteSearch)}"></label>`:''}
  <label class="unit-choice-box">單元清單<select id="${id}-unit-select" aria-label="選擇要查看的單元">${entries.length?entries.map(k=>`<option value="${k}" ${k===u?'selected':''}>${esc(unitOptionTitle(k))}</option>`).join(''):'<option value="" disabled selected>沒有找到，請換個關鍵字</option>'}</select></label></div>
  <div class="finder-bottom"><span>這個範圍符合 ${entries.length} 個單元${q?' · 搜尋結果只會影響清單，不會刪除內容':''}</span>
  <div class="finder-arrows"><button class="mini-btn" data-unit-direction="${id}:-1" ${u===0?'disabled':''}>← 上一單元</button><button class="mini-btn" data-unit-direction="${id}:1" ${u===UNITS-1?'disabled':''}>下一單元 →</button></div></div></div>`;
}
function notesPage(r){
 const u=clip(r[1]===undefined?store.unit:Number(r[1]),0,UNITS-1);
 if(state.noteRange===null||(state.noteRouteUnit!==u&&state.noteRange!=='all'&&Number(state.noteRange)!==Math.floor(u/100)))state.noteRange=Math.floor(u/100);state.noteRouteUnit=u;
 return `<header class="library-header no-print"><span class="eyebrow">✎ THE LITTLE NOTEBOOK</span><h1>我的英文手帳 <span class="title-doodle">✿</span></h1><p>文法在上、單字在下，列印時使用 A4 直式。每個單元可以依實際內容自然跨頁，不強制塞在兩張紙裡。</p></header>
 <div class="note-action-area no-print">${unitPicker(u,'notes')}<div class="note-action-buttons"><span class="print-hint">列印建議：A4・直式・縮放 100%・關閉瀏覽器頁首與頁尾</span><button class="btn btn-ghost" data-copy-note="${u}">複製文字筆記</button><button class="btn btn-mint" data-print-note>列印 A4 筆記</button></div></div>
 ${noteHtml(u)}`;
}
const PAPER_GROUPS=[{id:'intro',title:'基礎入門',sub:'熟悉詞性、be 動詞和最基礎的單字',short:'基礎'},
{id:'grammar',title:'文法打底',sub:'時態、代名詞、連接詞與句型',short:'文法'},
{id:'vocab',title:'單字情境',sub:'從完整例句判斷詞義、職場字彙',short:'單字'},
{id:'toeic',title:'多益題型入門',sub:'Part 2–7 原創題型練習；Part 1 圖片題請先使用官方範例',short:'題型'}];
function getPaperGroup(i){return i<10?'intro':(i<20||(i>=36&&i<56))?'grammar':(i<30||(i>=56&&i<76))?'vocab':'toeic'}
function paperProgress(p){const ans=store.paperAnswers[p.id]||{};return Object.keys(ans).filter(k=>Number.isInteger(Number(k))&&Number(k)>=0&&Number(k)<p.questions.length).length}
function papersPage(){const g=state.paperGroup||'intro',group=PAPER_GROUPS.find(x=>x.id===g)||PAPER_GROUPS[0];const search=state.paperSearch.trim().toLowerCase();const set=PAPERS.map((p,i)=>({p,i})).filter(x=>getPaperGroup(x.i)===g&&(!search||`${x.i+1} ${x.p.title} ${x.p.subtitle||''} ${x.p.questions.map(q=>q.kind).slice(0,4).join(' ')}`.toLowerCase().includes(search)));const answered=PAPERS.reduce((acc,p)=>acc+paperProgress(p),0),total=PAPERS.reduce((acc,p)=>acc+p.questions.length,0);return `<header class="library-header paper-list-intro"><span class="eyebrow">PRACTICE GARDEN · 練習花園</span><h1>練習卷 <span class="pill peach">${PAPERS.length} 回・${total} 題</span></h1><p>先選難度，再選一回練習。前三組是基礎練習。多益題型入門與官方範例放在最後一組，等你準備好再開始。</p></header><div class="v11-paper-tabs" role="group" aria-label="練習卷類型">${PAPER_GROUPS.map(c=>`<button type="button" class="v11-tab ${g===c.id?'active':''}" data-paper-group="${c.id}" aria-pressed="${g===c.id}"><strong>${c.title}</strong><small>${PAPERS.filter((p,i)=>getPaperGroup(i)===c.id).length} 回 · ${PAPERS.reduce((n,p,i)=>n+(getPaperGroup(i)===c.id?p.questions.length:0),0)} 題</small></button>`).join('')}</div><div class="paper-finder"><label>搜尋回數或題型<input type="search" id="paper-search" placeholder="例如：40、時態、閱讀…" value="${esc(state.paperSearch)}"></label><label>直接跳至練習卷<select id="paper-jump"><option value="">選擇這一組的練習卷</option>${set.map(({p,i})=>`<option value="${i}">第 ${i+1} 回｜${esc(p.title.replace(/^第 \d+ 回[・．]/,''))}</option>`).join('')}</select></label><span class="filter-result-count">目前符合 ${set.length} 回</span></div><section class="v11-paper-group"><div class="v11-paper-header"><div><span class="eyebrow">THIS IS YOUR LEVEL</span><h2>${group.title}</h2><p>${group.sub}</p></div><span class="pill mint">${g==='toeic'?'題型各有不同':'每回約 15 題'}</span></div><div class="v11-paper-grid">${set.slice(0,state.paperShown).map(({p,i})=>{const count=paperProgress(p),next=p.questions.findIndex((q,j)=>(store.paperAnswers[p.id]||{})[j]===undefined),resume=next<0?p.questions.length:next;return `<article class="v11-paper-card"><div class="v11-paper-card-top"><span class="pill ${g==='intro'?'mint':g==='grammar'?'blue':'peach'}">${group.short} · 第 ${String(i+1).padStart(2,'0')} 回</span></div><h3>${esc(i<10?p.subtitle:p.title.replace(/^第 \d+ 回・/,''))}</h3><p>${esc(i<10?'每回 15 題，先從最常見的文法開始練。':g==='toeic'?'題型練習，含逐題解析；聽力題可播放朗讀。':p.subtitle)}</p><button class="btn btn-primary" data-route="paper/${i}/${resume}">${count===0?'開始線上練習':count===p.questions.length?'查看本回練習':'繼續上次進度'} →</button><details class="v11-pdf-details"><summary>需要列印？下載 A4 PDF</summary><div class="v11-pdf-links"><a href="papers/${String(i+1).padStart(2,'0')}_questions.pdf" download>↓ 題目卷 PDF</a><a href="papers/${String(i+1).padStart(2,'0')}_answers.pdf" download>↓ 答案解析 PDF</a></div></details></article>`}).join('')}</div>${set.length>state.paperShown?`<div class="v15-paper-more"><button class="btn btn-mint" data-paper-more>再看 ${Math.min(10,set.length-state.paperShown)} 回練習卷 ↓</button></div>`:''}</section>${g==='toeic'?`<section class="panel v12-official"><div class="v12-section-top"><div><span class="eyebrow">OFFICIAL REFERENCE · 官方資源</span><h2>官方多益樣題（另開來源網站）</h2><p>這些內容由 ETS 或台灣官方提供，可免費查看；因有著作權，不複製題目至本站。本站上方的題型練習是自行編寫，非正式考古題。</p></div></div><div class="v12-official-links"><a href="https://www.ets.org/toeic/test-takers/prepare.html" target="_blank" rel="noopener noreferrer">ETS 官方樣題 PDF ↗</a><a href="https://toeic.com.tw/toeic/listening-reading/about/content/" target="_blank" rel="noopener noreferrer">台灣多益官方題型範例 ↗</a><a href="https://www.iibc-global.org/english/toeic/test/lr/about/format.html" target="_blank" rel="noopener noreferrer">IIBC 官方 Part 1–7 範例 ↗</a></div><p class="tiny muted">聽力題使用裝置內建語音朗讀，不等同正式多益錄音檔；這些題型是練習用，不代表正式多益分數。</p></section>
<section class="panel v12-shared"><div class="v12-section-top"><div><span class="eyebrow">SHARED PRACTICE · 網友與教師的公開練習</span><h2>免費的外部題庫與測驗</h2><p>已公開分享、可以從原網站免費練習；下方僅提供連結，不搬運原作者題目、錄音或解析。外站成績不會同步到本網站。</p></div></div><div class="v12-shared-grid"><a href="https://www.englishclub.com/esl-exams/ets-toeic-practice.php" target="_blank" rel="noopener noreferrer"><span>🌿 TOEIC 分題練習</span><strong>EnglishClub</strong><small>常見 TOEIC 練習，適合逐題熟悉題型</small><b>前往練習 ↗</b></a><a href="https://www.toeic-training.com/" target="_blank" rel="noopener noreferrer"><span>🎧 聽力與閱讀</span><strong>TOEIC Training</strong><small>可在原站練習聽力與閱讀並查看答案</small><b>前往練習 ↗</b></a><a href="https://we-lang.com/quiz/?lang=en" target="_blank" rel="noopener noreferrer"><span>⏱ 12 分鐘短測</span><strong>WeLang</strong><small>20 題短測，適合準備接觸考試形式時使用</small><b>前往練習 ↗</b></a><a href="https://www.toeic.com.tw/sample-test/toeic-listening-reading/sample01.html" target="_blank" rel="noopener noreferrer"><span>📖 官方樣題</span><strong>台灣 TOEIC</strong><small>官方 Part 1～7 範例，包含聽力題型</small><b>查看官方範例 ↗</b></a></div><p class="tiny muted">「公開免費練習」不等於「可自由轉載」。若作者明確提供可重製授權，才會在標註授權與出處後納入站內題庫。</p></section>`:''}<p class="v11-bottom-hint">💡 先做一回就好。不用急著做多益題型，將基礎學會再挑戰。</p>`}
function paperPage(r){const i=clip(Number(r[1]||0),0,PAPERS.length-1),p=PAPERS[i],questionIndex=clip(Number(r[2]||0),0,p.questions.length);const ans=store.paperAnswers[p.id]||{};const answered=paperProgress(p),score=p.questions.reduce((sum,q,n)=>sum+(ans[n]===q.correct?1:0),0);if(questionIndex===p.questions.length)return `<div class="panel v11-paper-finish"><div class="completed"><span class="trophy">✿</span><h2>${esc(p.title)}｜完成本回</h2><p>作答 ${answered}/${p.questions.length} 題，答對 ${score} 題。可以回到清單換一回，或重做這回。</p><div class="hero-actions"><button class="btn btn-primary" data-paper-return>返回練習卷清單</button><button class="btn btn-ghost" data-reset-paper="${i}">↻ 重新練習本回</button></div></div></div>`;
const q=p.questions[questionIndex];return `<div class="v11-paper-top"><button class="text-button" data-paper-return>← 練習卷清單</button><span class="pill ${i<10?'mint':i<20?'blue':'peach'}">第 ${i+1} 回 · 第 ${questionIndex+1} / ${p.questions.length} 題</span></div><header class="v11-paper-title"><h1>${esc(p.title)}</h1></header><article class="panel v11-paper-question">${quizItem(q,`p${i}q${questionIndex}`,questionIndex)}<div class="step-actions"><button class="btn btn-ghost" data-route="${questionIndex===0?'papers':`paper/${i}/${questionIndex-1}`}">← ${questionIndex===0?'返回清單':'上一題'}</button><button class="btn btn-primary" data-route="paper/${i}/${questionIndex+1}">${questionIndex===p.questions.length-1?'查看這回結果 →':'下一題 →'}</button></div></article><p class="v11-bottom-hint">答題後立即顯示解析；未完成也可以先離開，下次從原題繼續。</p>`}
// 第九版：字根、字族與全詞庫分類，分批瀏覽避免一次學習過量。
const MORPH_TYPES={prefix:'字首 PREFIX',root:'字根 ROOT',suffix:'字尾 SUFFIX',family:'同字族 WORD FAMILY',topic:'主題整理 TOPIC'};
const MORPH_BY_WORD=new Map();
MORPH.forEach((g,i)=>g.words.forEach(w=>{
 const k=w.en.toLowerCase();if(!MORPH_BY_WORD.has(k))MORPH_BY_WORD.set(k,[]);MORPH_BY_WORD.get(k).push(i);
}));
const MORPH_COVERED=new Set([...MORPH_BY_WORD].filter(([word,ids])=>ids.some(id=>MORPH[id].kind!=='topic')).map(([word])=>word));
// 由「已核對到的詞庫分類」產生單字的歸屬；不把主題誤標成真實字根。
const MORPH_PRIORITY={family:0,prefix:1,root:2,suffix:3,topic:4};
function morphGroupsFor(word){
 const key=String(word?.word||word?.en||word||'').toLowerCase();
 const own=MORPH_BY_WORD.get(key)||[];
 const inherited=!own.length&&word?.base_word?(MORPH_BY_WORD.get(String(word.base_word).toLowerCase())||[]):[];
 return (own.length?own:inherited).slice().sort((a,b)=>
  (MORPH_PRIORITY[MORPH[a].kind]??9)-(MORPH_PRIORITY[MORPH[b].kind]??9)
  || MORPH[a].key.localeCompare(MORPH[b].key,'zh-Hant'));
}
function morphBrief(word){
 const ids=morphGroupsFor(word),real=ids.find(i=>MORPH[i].kind!=='topic'),topic=ids.find(i=>MORPH[i].kind==='topic');
 if(real!==undefined)return `${MORPH_TYPES[MORPH[real].kind].split(' ')[0]} ${MORPH[real].key}`;
 if(topic!==undefined)return `主題分類：${MORPH[topic].key}（字根待確認）`;
 return '尚無可靠字根／字族歸屬';
}
function morphMembership(word,brief=false){
 const groups=morphGroupsFor(word),real=groups.filter(i=>MORPH[i].kind!=='topic'),topics=groups.filter(i=>MORPH[i].kind==='topic');
 const items=[...real,...topics];
 const buttons=items.map(i=>{
  const g=MORPH[i],type=MORPH_TYPES[g.kind].split(' ')[0];
  return `<button class="morph-assoc-chip kind-${g.kind}" type="button" data-route="root/${i}" title="查看 ${esc(g.key)} 分類中的全部 ${g.words.length} 個字詞"><span class="assoc-type">${esc(type)}</span><strong>${esc(g.key)}</strong><span class="assoc-size">${g.words.length} 字 ↗</span></button>`;
 }).join('');
 const heading=brief?'這個字在哪個字族？':'🧬 所屬字根・字族與主題';
 const note=real.length
  ?'以上是目前詞庫已有的構詞／詞族關係；點擊標籤可查看同組全部已收錄單字。'
  :'目前沒有足夠依據歸入特定字根或字族，先依情境主題學習；不會隨意把拼字相似的字湊成同一字根。';
 return `<section class="morph-membership" aria-label="單字分類"><div class="morph-membership-heading"><strong>${heading}</strong><span>${real.length?`找到 ${real.length} 組構詞／字族關係`:'字根／字族待確認'}</span></div><div class="morph-assoc-list">${buttons||'<span class="tiny muted">尚未建立分類，請從字族圖鑑查找。</span>'}</div><p class="morph-membership-note">${note}</p></section>`;
}
function morphCrosslinks(word){return morphMembership(word);}

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
 const shown=state.rootWordShown[i]??(filtered.length<=24?filtered.length:12);
 const display=filtered.slice(0,shown);
 const cards=display.map((w,j)=>{
  const key=`${i}:${w.en.toLowerCase()}`;
  return `<div class="morph-word"><div class="morph-word-top"><b>${esc(w.en)}</b>${playBtn(w.en,'聽單字')}</div><small class="tiny muted">${esc(w.pos||'')}</small>${state.rootRevealed[key]?`<p class="morph-translation">${esc(w.zh)}</p>`:`<button class="morph-reveal" data-root-reveal="${esc(key)}">先猜意思 → 翻開中文</button>`}<button class="morph-inline-link" data-route="word/${encodeURIComponent(w.en)}">查看單字詳解 ↗</button></div>`;
 }).join('');
 const extra=(f.extras||[]).filter(w=>!query||w.en.toLowerCase().includes(query)||w.zh.includes(query)).slice(0,6);
 const lessonExample=f.example||(function(){for(const w of all.slice(0,40)){const record=WORD_MAP.get(w.en.toLowerCase());if(record){const ex=examplesFor(record)[0];if(ex)return {...ex,focus:w.en}}}return null})();
 // 依題號走訪本組每一個字，不再永遠只從前四個字出題。
 const questionNo=filtered.length?(state.rootQuizStep[i]||0)%filtered.length:0;
 const answer=filtered[questionNo];
 const pool=answer?[answer,...Array.from({length:Math.min(3,filtered.length-1)},(_,j)=>filtered[(questionNo+j+1)%filtered.length])]:[];
 const opts=pool.sort((a,b)=>a.en.localeCompare(b.en));
 const qid=`${i}:${query}:${questionNo}`;
 const chosen=state.rootQuiz[qid];
 return `<header class="library-header"><span class="eyebrow">${MORPH_TYPES[f.kind]} · 第 ${i+1} 組</span><h1>${esc(f.key)} <span class="pill peach">${esc(f.meaning)}</span></h1><p>${esc(f.description)}</p></header>
 <div class="morph-lesson"><div class="morph-summary"><span class="morph-summary-kicker">TODAY’S DISCOVERY · 今天的發現</span><b>這組已收錄 ${all.length} 個相關字詞</b><p>${f.kind==='topic'?'這是方便找字的主題分類，不代表每個字都具有共同字根。':all.length<=4?`目前詞庫中確實只有 ${all.length} 個可確認符合此分類的字詞，並非被限制成四個；新的字族資料確認後才會加入。`:'這裡收錄本組所有目前詞庫中的字詞，非固定四個；字多時可分批看，亦可一鍵顯示全部。'}</p><p>可從任何單字進入完整解釋、例句、發音與筆記。</p></div>
 <label class="morph-search-label" for="morph-detail-search">搜尋這一組的單字或中文</label><input id="morph-detail-search" data-morph-group="${i}" class="morph-search" type="search" placeholder="這組共有 ${all.length} 個，輸入英文或中文篩選" value="${esc(state.rootWordSearch[i]||'')}" autocomplete="off">
 <p class="morph-result-note">${query?`本組共 ${all.length} 字；搜尋符合 <strong>${filtered.length}</strong> 個`:`本組總共 <strong>${all.length}</strong> 個已收錄字詞，以下顯示 <strong>${display.length}</strong> 個`} · 完整分類已收錄，學習時可自行決定一次看多少</p>
 ${display.length?`<div class="morph-word-grid">${cards}</div>`:'<div class="soft-recall"><p>這組沒有符合搜尋的已收錄單字。</p></div>'}
 ${shown<filtered.length?`<div class="morph-more-wrap"><button class="btn btn-primary" data-root-more="${i}">再看 ${Math.min(12,filtered.length-shown)} 個字 ↓</button><button class="btn btn-ghost" data-root-all="${i}">一次展開本組全部 ${filtered.length} 個字</button></div>`:''}
 ${shown>=filtered.length&&filtered.length>24?`<div class="morph-more-wrap"><button class="btn btn-ghost" data-root-collapse="${i}">收起，回到前 12 個字 ↑</button></div>`:''}
 ${extra.length?`<details class="morph-extras"><summary>延伸學習 · ${extra.length} 個詞庫外例字</summary><p>以下是原先教材列出的補充詞，尚未列入 6,000 筆詞庫的正式學習進度。</p><div class="morph-word-grid">${extra.map(w=>`<div class="morph-word"><div class="morph-word-top"><b>${esc(w.en)}</b>${playBtn(w.en,'聽單字')}</div><p class="morph-translation">${esc(w.zh)}</p></div>`).join('')}</div></details>`:''}
 ${lessonExample?`<div class="morph-example"><small>情境例句 · 觀察重點色塊</small><div class="example-row highlighted-example"><div><strong>${paint(lessonExample.en,f.focus||lessonExample.focus||all[0]?.en||'')}</strong><span>${esc(lessonExample.zh)}</span></div>${playBtn(lessonExample.en,'聽整句')}</div></div>`:''}
 ${filtered.length>=2?`<section class="morph-practice"><div class="morph-practice-header"><span class="pill yellow">字族回想練習</span><span class="tiny muted">本組第 ${questionNo+1} / ${filtered.length} 個字</span></div><p class="tiny muted">這裡一次出一題，但會逐字輪流練到本組全部字詞，不只練前四個。</p><h3>「${esc(answer.zh)}」對應哪個英文？</h3><div class="morph-options">${opts.map((w,j)=>`<button class="morph-answer ${chosen!==undefined?(w.en===answer.en?'correct':j===chosen?'incorrect':''):''}" data-root-answer="${esc(qid)}:${j}" ${chosen!==undefined?'disabled':''}>${esc(w.en)}</button>`).join('')}</div>${chosen!==undefined?`<p class="morph-feedback">${opts[chosen]?.en===answer.en?'答對了！':'再記住一次！'} ${esc(answer.en)} = ${esc(answer.zh)}</p>`:''}<div class="morph-more-wrap"><button class="btn btn-mint" data-root-next="${i}">${questionNo+1>=filtered.length?'從第一個字再練一次 ↻':'練習下一個字 →'}</button></div></section>`:''}
 </div><div class="step-actions"><button class="btn btn-ghost" data-route="roots">← 字族總覽</button><button class="btn btn-primary" data-route="root/${(i+1)%MORPH.length}">下一組 →</button></div>`;
}

// 第十四版：原創短文、情境聽力與理解練習；從易到難，不顯示學習進度儀表板。
const STORIES=[...(window.TOEIC_SKILL_STORIES||[]),...(window.TOEIC_SKILL_STORIES_EXTRA||[])];
for(const story of STORIES)if(window.TOEIC_SKILL_OLD_EXTRA?.[story.id])story.questions.push(...window.TOEIC_SKILL_OLD_EXTRA[story.id]);
const LEVEL_NAMES={a1:'初學｜短句與公告',a2:'進階｜生活與職場',b1:'挑戰｜商務與細節'};
function storyLabel(mode){return mode==='listening'?'聽力':'閱讀'}
function storyPaint(en,vocab){
  const terms=(vocab||[]).map(x=>x.en.trim()).filter(Boolean).sort((a,b)=>b.length-a.length);
  if(!terms.length)return esc(en);
  const safe=terms.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  const re=new RegExp('\\b('+safe.join('|')+')(?:s|es|ed|d|ing)?\\b','gi');
  let html='',from=0,m;
  while((m=re.exec(en))!==null){html+=esc(en.slice(from,m.index));html+='<mark class="story-keyword">'+esc(m[0])+'</mark>';from=m.index+m[0].length;}
  return html+esc(en.slice(from));
}
function storyModePage(){
 return `<header class="library-header story-header"><span class="eyebrow">READ & LISTEN · 英文小故事屋</span><h1>讀一篇，聽一段 ✿</h1><p>先從短句開始，慢慢學會看懂通知、郵件、工作訊息。每次只選一篇，不用一次讀很多。</p></header>
 <div class="story-entrances"><button data-route="reading" class="story-entrance read"><span class="story-entrance-art">📖</span><span class="story-entrance-text"><small>01 · READ</small><strong>閱讀文章</strong><span>讀短文、圈關鍵字、看懂中英對照，再回答問題。</span></span><span class="story-arrow">開始 ›</span></button>
 <button data-route="listening" class="story-entrance listen"><span class="story-entrance-art">🎧</span><span class="story-entrance-text"><small>02 · LISTEN</small><strong>練習聽力</strong><span>先聽不看稿，再聽一次，最後打開文字稿確認。</span></span><span class="story-arrow">開始 ›</span></button></div>
 <div class="story-guide"><b>一篇小練習的順序</b><span>① 先試著讀／聽</span><span>② 找出重點</span><span>③ 看中文、記單字</span><span>④ 做 5 題理解練習</span></div>`;
}
function storyListPage(mode){
 const level=state.storyLevel[mode]||'all',q=(state.storySearch[mode]||'').trim().toLowerCase(),sort=state.storySort[mode]||'curriculum';
 let list=STORIES.filter(x=>x.mode===mode&&(level==='all'||x.level===level)&&(!q||`${x.title} ${x.scene} ${x.note||''} ${(x.vocab||[]).map(v=>v.en+' '+v.zh).join(' ')}`.toLowerCase().includes(q)));
 if(sort==='title')list.sort((a,b)=>a.title.localeCompare(b.title,'zh-Hant'));
 if(sort==='level')list.sort((a,b)=>['a1','a2','b1'].indexOf(a.level)-['a1','a2','b1'].indexOf(b.level));
 const title=mode==='reading'?'閱讀文章':'聽力練習',total=STORIES.filter(x=>x.mode===mode).length;
 return `<header class="library-header story-header"><span class="eyebrow">${mode==='reading'?'READING CORNER':'LISTENING CORNER'}</span><h1>${mode==='reading'?'📖':'🎧'} ${title}</h1><p>共 ${total} 篇、${STORIES.filter(x=>x.mode===mode).reduce((n,x)=>n+x.questions.length,0)} 題。先挑有興趣的主題，再逐步增加難度。</p></header>
 <div class="story-finder"><label>搜尋文章主題<input type="search" id="story-search" data-story-mode="${mode}" value="${esc(state.storySearch[mode]||'')}" placeholder="輸入通知、郵件、工作、單字…"></label><label>排列方式<select id="story-sort" data-story-mode="${mode}"><option value="curriculum" ${sort==='curriculum'?'selected':''}>教材原始順序</option><option value="level" ${sort==='level'?'selected':''}>由易到難</option><option value="title" ${sort==='title'?'selected':''}>標題排序</option></select></label></div>
 <div class="story-level-tabs" role="group" aria-label="挑選難度">${[['all','全部短文'],['a1','入門'],['a2','進階'],['b1','挑戰']].map(([k,v])=>`<button data-story-level="${mode}:${k}" class="${level===k?'active':''}" aria-pressed="${level===k}">${v}</button>`).join('')}</div><div class="filter-result-count">找到 ${list.length} / ${total} 篇${q?'，可清除搜尋查看全部':''}</div>
 <div class="story-list">${list.length?list.map((x,i)=>`<button class="story-mini-card" data-route="${mode}/${x.id}"><span class="story-card-doodle">${mode==='reading'?'✿':'♫'}</span><span class="pill ${x.level==='a1'?'mint':x.level==='a2'?'peach':'blue'}">${esc(LEVEL_NAMES[x.level])}</span><h2>${esc(x.title)}</h2><p>${esc(x.scene)}</p><small>逐句中英對照 · 重點字 · ${x.questions.length} 題理解</small><b>開始${storyLabel(mode)} ›</b></button>`).join(''):'<div class="empty-filter">找不到相符文章，請換個詞或選擇「全部短文」。</div>'}</div><div class="step-actions"><button class="btn btn-ghost" data-route="skills">← 閱讀・聽力首頁</button></div>`;
}
function storyDetailPage(mode,id){
 const x=STORIES.find(t=>t.id===id&&t.mode===mode);
 if(!x)return `<section class="panel"><h2>找不到這篇教材</h2><button class="btn btn-primary" data-route="${mode}">返回文章清單</button></section>`;
 const isListen=mode==='listening',showText=!isListen||!!state.storyTranscripts[id],showZh=!!state.storyTranslations[id];
 const answers=store.storyAnswers?.[id]||{};const full=x.lines.map(s=>s.en).join(' ');
 return `<div class="story-detail-nav"><button class="text-button" data-route="${mode}">← 返回${storyLabel(mode)}文章清單</button><span class="pill ${x.level==='a1'?'mint':x.level==='a2'?'peach':'blue'}">${LEVEL_NAMES[x.level]}</span></div>
 <header class="story-title-card ${isListen?'story-audio':'story-reader'}"><span class="eyebrow">${isListen?'LISTEN & LEARN':'READ & UNDERSTAND'}</span><h1>${esc(x.title)}</h1><p>${esc(x.scene)} · ${x.lines.length} 個短句</p><div class="story-title-controls">${playBtn(full,isListen?'播放整段聽力':'聽整篇文章')}${isListen?`<button class="btn btn-mint" data-story-transcript="${id}">${showText?'隱藏文字稿':'看逐句文字稿'}</button>`:`<button class="btn btn-mint" data-story-translate="${id}">${showZh?'隱藏中文':'顯示逐句中文'}</button>`}</div></header>
 ${isListen?`<div class="story-listen-guidance"><span class="story-listen-icon">♫</span><div><strong>先聽，不急著看文字稿</strong><p>第一遍先聽「誰、何時、在哪裡」，第二遍再聽細節。如果聽不懂，可以調慢上方的朗讀速度，最後打開文字稿。</p></div></div>`:`<div class="story-read-guidance">用彩色標記找出這篇的重點字。遇到生字可以先猜，再到下方看中文與發音。</div>`}
 ${showText?`<section class="story-lines" aria-label="${isListen?'聽力文字稿':'英文閱讀文章'}">${x.lines.map((s,i)=>`<article class="story-line"><div class="story-line-num">${String(i+1).padStart(2,'0')}</div><div class="story-line-content"><p class="story-line-en">${storyPaint(s.en,x.vocab)}</p>${showZh||isListen?`<p class="story-line-zh">${esc(s.zh)}</p>`:''}</div>${playBtn(s.en,'聽這句')}</article>`).join('')}</section>`:`<section class="story-transcript-hidden"><span>🎧</span><h2>文字稿暫時蓋起來</h2><p>按「播放整段聽力」先練耳朵；要對照英文與中文時，按上方「看逐句文字稿」。</p></section>`}
 ${isListen&&showText?'':isListen?`<div class="story-show-after"><button class="btn btn-ghost" data-story-transcript="${id}">聽完了，打開逐句中英對照 →</button></div>`:''}
 <section class="story-mini-notes"><div class="story-notes-heading"><span class="eyebrow">HIGHLIGHT & NOTE</span><h2>這篇要記住的字 ✍️</h2></div><div class="story-vocab">${x.vocab.map(v=>`<div class="story-vocab-item"><div><strong>${esc(v.en)}</strong><p>${esc(v.zh)}</p></div><div class="story-vocab-actions">${playBtn(v.en,'發音')}${WORD_MAP.has(v.en.toLowerCase())?`<button class="mini-btn" data-route="word/${encodeURIComponent(v.en)}">單字詳解 ↗</button>`:''}</div></div>`).join('')}</div><div class="story-grammar-hint"><b>✦ 今天的句子觀察</b><p>${esc(x.note)}</p></div></section>
 <section class="story-quiz"><div class="story-notes-heading"><span class="eyebrow">CHECK YOUR UNDERSTANDING</span><h2>讀／聽懂了嗎？</h2><p>每篇有 5 題，每題作答後會顯示中文解釋；答錯可以回到上方，再讀或聽一次。</p></div>${x.questions.map((q,qi)=>{const ans=answers[qi];return `<div class="story-question"><div class="story-q-top"><span class="pill yellow">Q${qi+1}</span><strong>${esc(q.question)}</strong></div><div class="story-q-options">${q.options.map((opt,j)=>`<button data-story-answer="${x.id}:${qi}:${j}" class="story-choice ${ans!==undefined?(j===q.correct?'correct':j===ans?'wrong':''):''}" ${ans!==undefined?'disabled':''}><span>${String.fromCharCode(65+j)}</span>${esc(opt)}</button>`).join('')}</div>${ans!==undefined?`<div class="story-q-explain ${ans===q.correct?'good':'try'}"><b>${ans===q.correct?'✓ 答對了':'✎ 再看一次'}</b><p>正確答案：${String.fromCharCode(65+q.correct)}．${esc(q.options[q.correct])}</p><p>${esc(q.why)}</p></div>`:''}</div>`}).join('')}
 <div class="story-quiz-foot"><button class="btn btn-ghost" data-story-reset="${id}">重新做本篇 ${x.questions.length} 題</button><button class="btn btn-primary" data-route="${mode}/${(STORIES.filter(t=>t.mode===mode)[(STORIES.filter(t=>t.mode===mode).findIndex(t=>t.id===id)+1)%STORIES.filter(t=>t.mode===mode).length]).id}">下一篇${storyLabel(mode)} →</button></div></section>
 <div class="step-actions"><button class="btn btn-ghost" data-route="${mode}">← 選其他${storyLabel(mode)}文章</button><button class="btn btn-mint" data-route="skills">閱讀・聽力首頁</button></div>`;
}

function render(){
 const r=route();let top=r[0],html;
 if(top==='my'||top==='review'){history.replaceState(null,'','#home');top='home';}
 switch(top){
 case'learn':html=learnPage(r.length===1?(store.lastLearn||'learn/0/0').split('/'):r);break;
 case'tools':html=toolsPage();break;
 case'skills':html=storyModePage();break;
 case'reading':html=r[1]?storyDetailPage('reading',r[1]):storyListPage('reading');break;
 case'listening':html=r[1]?storyDetailPage('listening',r[1]):storyListPage('listening');break;
 case'roots':html=morphList();break;case'root':html=morphDetail(r);break;
 case'words':html=wordsPage();break;case'word':html=wordPage(r);break;
 case'grammar':html=grammarPage(r);break;case'notes':html=notesPage(r);break;
 case'papers':html=papersPage();break;case'paper':html=paperPage(r);break;
 default:html=homePage();top='home';
 }
 PAGE.innerHTML=html;
 const nav=(['word','words','root','roots','grammar','tools','notes'].includes(top)?'tools':['skills','reading','listening'].includes(top)?'skills':top==='paper'?'papers':top==='learn'?'home':top);
 document.querySelectorAll('[data-nav]').forEach(x=>x.classList.toggle('active',x.dataset.nav===nav));
 const bar=document.getElementById('history-bar');bar.hidden=top==='home';
 const labels={learn:'今日課程',tools:'單字・文法工具箱',skills:'閱讀・聽力',reading:'閱讀文章',listening:'聽力練習',word:'單字詳解',roots:'字根字族',root:'字根字族練習',words:'單字庫',grammar:'文法庫',notes:'英文筆記',papers:'練習卷',paper:'線上練習'};
 document.getElementById('crumbs').textContent=labels[top]||'';
 document.title='小步學英文｜'+(bar.hidden?'首頁':(labels[top]||''));
}
function historyChanged(){const newHash=location.hash||'#home';if(newHash!==oldHash){if(historyTrail.length&&newHash===historyTrail[historyTrail.length-1])historyTrail.pop();else historyTrail.push(oldHash);oldHash=newHash}render();window.scrollTo({top:0,behavior:'instant'})}
window.addEventListener('hashchange',historyChanged);
function copyNotes(u){const txt=noteText(u);if(navigator.clipboard?.writeText)navigator.clipboard.writeText(txt).then(()=>toast('筆記已複製')).catch(()=>toast('複製失敗，請改用列印'));else toast('此瀏覽器不支援一鍵複製')}
document.addEventListener('click',e=>{const b=e.target.closest('button,[data-route]');if(!b)return;
if(b.dataset.speak!==undefined){play(b.dataset.speak);return}
if(b.dataset.storyLevel!==undefined){const [mode,level]=b.dataset.storyLevel.split(':');state.storyLevel[mode]=level;render();return}
if(b.dataset.storyTranscript!==undefined){const id=b.dataset.storyTranscript;state.storyTranscripts[id]=!state.storyTranscripts[id];render();return}
if(b.dataset.storyTranslate!==undefined){const id=b.dataset.storyTranslate;state.storyTranslations[id]=!state.storyTranslations[id];render();return}
if(b.dataset.storyAnswer!==undefined){const [id,qi,choice]=b.dataset.storyAnswer.split(':');const item=STORIES.find(x=>x.id===id);if(item&&item.questions[Number(qi)]&&(store.storyAnswers[id]||{})[qi]===undefined){store.storyAnswers[id]??={};store.storyAnswers[id][qi]=Number(choice);save();render()}return}
if(b.dataset.storyReset!==undefined){delete store.storyAnswers[b.dataset.storyReset];save();render();return}
if(b.dataset.rootFilter!==undefined){state.rootCategory=b.dataset.rootFilter;state.rootGroupShown=24;render();return}
if(b.hasAttribute('data-root-more-groups')){state.rootGroupShown+=24;render();return}
if(b.dataset.rootMore!==undefined){const n=b.dataset.rootMore;state.rootWordShown[n]=(state.rootWordShown[n]||12)+12;render();return}
if(b.dataset.rootAll!==undefined){const n=b.dataset.rootAll;state.rootWordShown[n]=Infinity;render();return}
if(b.dataset.rootCollapse!==undefined){const n=b.dataset.rootCollapse;state.rootWordShown[n]=12;render();return}
if(b.dataset.rootNext!==undefined){const n=b.dataset.rootNext;state.rootQuizStep[n]=(state.rootQuizStep[n]||0)+1;render();return}
if(b.dataset.rootReveal!==undefined){state.rootRevealed[b.dataset.rootReveal]=true;render();return}
if(b.dataset.rootAnswer!==undefined){const values=b.dataset.rootAnswer.split(':');const j=Number(values.pop());state.rootQuiz[values.join(':')]=j;render();return}
if(b.hasAttribute('data-paper-more')){state.paperShown+=10;render();return}
if(b.dataset.paperGroup!==undefined){state.paperGroup=b.dataset.paperGroup;state.paperShown=10;render();return}
if(b.hasAttribute('data-paper-return')){state.paperGroup=getPaperGroup(Number(route()[1]||0));go('papers');return}
if(b.dataset.route){go(b.dataset.route);return}
if(b.hasAttribute('data-back')||b.id==='back-btn'){back();return}
if(b.dataset.reveal!==undefined){state.revealed[b.dataset.reveal]=true;render();return}
if(b.dataset.studyAnswer!==undefined){const k=b.dataset.studyAnswer;const choice=Number(b.dataset.answer);if(k.startsWith('p')){let m=k.match(/^p(\d+)q(\d+)$/);if(m){let p=PAPERS[Number(m[1])];if(p){store.paperAnswers[p.id]??={};store.paperAnswers[p.id][Number(m[2])]=choice}}}else if(store.answers[k]===undefined){store.answers[k]=choice}save();render();return}
if(b.dataset.resetUnit!==undefined){const u=Number(b.dataset.resetUnit);Object.keys(store.answers).filter(k=>k.startsWith(`u${u}q`)).forEach(k=>delete store.answers[k]);save();render();toast('已清除本單元作答，可重新練習');return}
if(b.dataset.resetPaper!==undefined){const i=Number(b.dataset.resetPaper);delete store.paperAnswers[PAPERS[i]?.id];save();go(`paper/${i}/0`);toast('已清除本回作答，可重新測試');return}
if(b.dataset.complete!==undefined){let u=Number(b.dataset.complete);if(!store.completed.includes(u))store.completed.push(u);store.completed.sort((a,b)=>a-b);store.unit=Math.min(UNITS-1,u+1);store.lastLearn=`learn/${store.unit}/0/0`;save();go(`learn/${store.unit}/0`);toast('完成一堂！新的知識又多一點 🌱');return}
if(b.dataset.copyNote!==undefined){copyNotes(Number(b.dataset.copyNote));return}
if(b.hasAttribute('data-print-note')){window.print();return}
if(b.hasAttribute('data-unit-jump')){let val=Number(document.getElementById('unit-select')?.value);if(val>=1&&val<=UNITS)go(`learn/${val-1}/0`);else toast('請輸入 1 到 '+UNITS+' 的單元');return}
if(b.dataset.unitDirection!==undefined){const [kind,delta]=b.dataset.unitDirection.split(':');const u=clip(Number(route()[1]??store.unit)+Number(delta),0,UNITS-1);if(kind==='notes')state.noteRange=Math.floor(u/100);else state.learnRange=Math.floor(u/100);go(kind==='notes'?`notes/${u}`:`learn/${u}/0`);return}
if(b.hasAttribute('data-more-words')){state.wordShown+=30;render();return}
if(b.id==='audio-settings-toggle'){let a=document.getElementById('audio-settings');a.hidden=!a.hidden;return}
if(b.id==='stop-speech'){window.speechSynthesis?.cancel();document.getElementById('speech-status').textContent='已停止';return}
});
document.addEventListener('input',e=>{let x=e.target;if(x.id==='notes-unit-search'){const pos=x.selectionStart;state.noteSearch=x.value;if(x.value.trim())state.noteRange='all';render();const n=document.getElementById('notes-unit-search');n?.focus();n?.setSelectionRange(pos,pos)}else if(x.id==='story-search'){const mode=x.dataset.storyMode;const pos=x.selectionStart;state.storySearch[mode]=x.value;render();const n=document.getElementById('story-search');n?.focus();n?.setSelectionRange(pos,pos)}else if(x.id==='paper-search'){const pos=x.selectionStart;state.paperSearch=x.value;state.paperShown=10;render();const n=document.getElementById('paper-search');n?.focus();n?.setSelectionRange(pos,pos)}else if(x.id==='morph-search'){let pos=x.selectionStart;state.rootSearch=x.value;state.rootGroupShown=24;render();const n=document.getElementById('morph-search');n?.focus();n?.setSelectionRange(pos,pos)}else if(x.id==='morph-detail-search'){let pos=x.selectionStart;const i=x.dataset.morphGroup;state.rootWordSearch[i]=x.value;state.rootWordShown[i]=12;state.rootQuizStep[i]=0;render();const n=document.getElementById('morph-detail-search');n?.focus();n?.setSelectionRange(pos,pos)}else if(x.id==='word-search'){let pos=x.selectionStart;state.wordSearch=x.value;state.wordShown=30;render();const n=document.getElementById('word-search');n.focus();n.setSelectionRange(pos,pos)}else if(x.id==='grammar-search'){let pos=x.selectionStart;state.grammarSearch=x.value;render();const n=document.getElementById('grammar-search');n.focus();n.setSelectionRange(pos,pos)}});
document.addEventListener('change',e=>{const x=e.target;
 if(x.id==='notes-range'){state.noteRange=x.value==='all'?'all':Number(x.value);render();return}
 if(x.id==='learn-range'){state.learnRange=x.value==='all'?'all':Number(x.value);const d=document.querySelector('.lesson-switch');const wasOpen=!!d?.open;render();if(wasOpen)document.querySelector('.lesson-switch').open=true;return}
 if(x.id==='notes-unit-select'&&x.value!==''){const u=Number(x.value);state.noteRange=Math.floor(u/100);go(`notes/${u}`);return}
 if(x.id==='learn-unit-select'&&x.value!==''){const u=Number(x.value);state.learnRange=Math.floor(u/100);go(`learn/${u}/0`);return}
 if(x.id==='grammar-level'){state.grammarLevel=x.value;render();return}
 if(x.id==='story-sort'){state.storySort[x.dataset.storyMode]=x.value;render();return}
 if(x.id==='paper-jump'&&x.value!==''){const i=Number(x.value);const p=PAPERS[i];const first=p.questions.findIndex((q,j)=>(store.paperAnswers[p.id]||{})[j]===undefined);go(`paper/${i}/${first<0?p.questions.length:first}`);return}
 if(x.id==='category-search'){state.wordCategory=x.value;state.wordShown=30;render();return}
});

// Important: avoid silent in-memory changes when the browser refuses persistent storage.
window.addEventListener('pagehide',()=>save());
save();render();
})();
