'use strict';

// 自編教材；原書字彙及補充字彙由 data.js 載入。
const LESSONS = [
  {
    id:'parts', title:'先認識英文的詞性', level:'零基礎', subtitle:'名詞、動詞、形容詞、副詞：先知道每個字在句子中負責什麼。',
    paragraphs:[
      '詞性就是一個單字在句子中的「工作」。多益填空題常利用空格前後的字，測試你知不知道該放什麼詞性。',
      '同一個字有時可以擔任不同詞性，例如 work 可以是動詞「工作」，也可以是名詞「工作」。'
    ],
    rules:[['名詞（n.）','人、事、物、地方。例如 manager（經理）、office（辦公室）。'],['動詞（v.）','描述動作或狀態。例如 work（工作）、apply（申請）。'],['形容詞（adj.）','描述名詞的性質。例如 busy（忙碌的）、new（新的）。'],['副詞（adv.）','修飾動詞、形容詞或其他副詞。例如 carefully（仔細地）。']],
    examples:[['The manager works.','經理工作。'],['She is busy.','她很忙。'],['He reads carefully.','他仔細地閱讀。']],
    vocab:['manager','work','employee','application'],
    tip:'看到形容詞和副詞選項，不要只憑中文意思猜；先找空格要修飾的是名詞還是動詞。',
    notes:'一、詞性：\n名詞 n.：人、事、物（manager, office）\n動詞 v.：動作或狀態（work, apply）\n形容詞 adj.：修飾名詞（busy, new）\n副詞 adv.：修飾動詞、形容詞等（carefully）\n\n二、判斷：看空格前後的句子結構，再決定詞性。\n例：She is busy.（busy 是形容詞）'
  },
  {
    id:'sentence', title:'主詞、動詞與受詞', level:'零基礎', subtitle:'先看懂一句英文「誰做了什麼」。',
    paragraphs:['英文很多句子都有固定順序。主詞表示「誰」，動詞表示「做什麼」，受詞表示動作作用到「誰或什麼」。',
      '不是每句話都一定要有受詞。例如 I work.（我工作。）已經是完整句子。'],
    rules:[['主詞 Subject（S）','通常是做動作的人或事物。'],['動詞 Verb（V）','句子的核心：動作或狀態。'],['受詞 Object（O）','接受動作的人或物。'],['基本句型 S + V + O','例如 She reads a report.']],
    examples:[['I work.','我工作。主詞 I；動詞 work。'],['She reads a report.','她閱讀一份報告。主詞 She；動詞 reads；受詞 a report。'],['The company hires employees.','公司雇用員工。']],
    vocab:['work','report','hire','employee'],tip:'考題先找主詞和主要動詞，通常比直接翻譯整句更容易判斷答案。',
    notes:'一、主詞 S：誰做事（I, She, The manager）\n二、動詞 V：做什麼（work, read, hire）\n三、受詞 O：動作作用的對象（a report, employees）\n\n句型：S + V；S + V + O\n例：She reads a report.（她讀一份報告。）'
  },
  {
    id:'pronouns',title:'人稱與代名詞',level:'零基礎',subtitle:'I、You、He、She、It、We、They 是所有後續時態的基礎。',
    paragraphs:['主詞的位置會影響 be 動詞及現在式一般動詞的形式。先把七種常見的人稱背熟。','He、She、It，以及單一個人或單一物品，在文法上通常屬於第三人稱單數。'],
    rules:[['I / You','我／你（你們）'],['He / She / It','他／她／它（第三人稱單數）'],['We / They','我們／他們'],['The manager','一位經理＝第三人稱單數；The managers＝複數。']],
    examples:[['I am an employee.','我是一名員工。'],['She is a manager.','她是一名經理。'],['They are employees.','他們是員工。']],
    vocab:['employee','manager','candidate','applicant'],tip:'The manager 和 He 的文法性質相同，都是第三人稱單數。',
    notes:'主詞代名詞：\nI＝我；You＝你／你們\nHe＝他；She＝她；It＝它\nWe＝我們；They＝他們\n\n第三人稱單數：He、She、It、單數人名、單一物品。\n例：The manager＝He；The employees＝They。'
  },
  {
    id:'be',title:'be 動詞：am、is、are',level:'零基礎',subtitle:'看到主詞，就知道應該用哪一種 be 動詞。',
    paragraphs:['be 動詞可以用來描述身分、狀態與位置。現在式最常見的形式是 am、is、are。','記住三組搭配：I am；He／She／It is；You／We／They are。若主詞是單數名詞，多半用 is；複數名詞用 are。'],
    rules:[['I → am','I am a student.'],['He / She / It → is','He is busy.'],['You / We / They → are','They are ready.'],['be + 名詞／形容詞','She is a manager. / She is busy.']],
    examples:[['I am an applicant.','我是一位應徵者。'],['The manager is busy.','經理很忙。'],['The employees are ready.','員工們已準備好了。']],
    vocab:['applicant','manager','employee','ready'],tip:'He is work. 是錯的；「他工作」要說 He works.，「他正在工作」才會說 He is working.',
    notes:'be 動詞現在式：\nI → am\nHe / She / It / 單數名詞 → is\nYou / We / They / 複數名詞 → are\n\n基本句型：主詞 + be + 名詞／形容詞。\n例：He is a manager.（他是經理。）\n例：They are busy.（他們很忙。）'
  },
  {
    id:'plural',title:'單數與複數',level:'初級',subtitle:'一個員工與多個員工，英文名詞有不同寫法。',
    paragraphs:['一個可數的物品或人物通常用單數名詞；兩個以上通常用複數名詞。最常見的複數是加 -s。',
      '名詞複數不等於動詞第三人稱單數：employees 是複數名詞；works 的 -s 則可能是動詞變化。'],
    rules:[['通常 +s','employee → employees；report → reports'],['字尾 +es','box → boxes；watch → watches'],['子音+y → ies','company → companies'],['不規則複數','person → people；child → children']],
    examples:[['The company has two managers.','這間公司有兩位經理。'],['Three employees are in the office.','三位員工在辦公室。'],['She reads one report.','她讀一份報告。']],
    vocab:['company','employee','manager','report'],tip:'two、three、many、several 後面常需複數可數名詞。',
    notes:'可數名詞：一個＝單數；兩個以上＝複數。\n一般 +s：report → reports\n部分 +es：box → boxes\n子音+y → ies：company → companies\n不規則：person → people\n\n例：two employees；three reports。'
  },
  {
    id:'third',title:'第三人稱單數與一般動詞',level:'初級',subtitle:'He works. 為什麼要加 s？',
    paragraphs:['現在簡單式中，主詞如果是 He、She、It 或單數的人／物，一般動詞通常要變成第三人稱單數形式。',
      '但助動詞 does 後面，要用動詞原形。例如 Does she work? 不能寫成 Does she works?。'],
    rules:[['一般動詞 +s','work → works；read → reads'],['以 s, sh, ch, x, o 結尾，常 +es','watch → watches；go → goes'],['子音+y → ies','study → studies'],['does 後接原形','Does he work?（不是 works）']],
    examples:[['I work in an office.','我在辦公室工作。'],['She works in an office.','她在辦公室工作。'],['Does she work here?','她在這裡工作嗎？']],
    vocab:['work','office','study','manage'],tip:'先找主詞。如果是 He／She／It，且是現在簡單式肯定句，注意動詞要不要加 s。',
    notes:'現在簡單式第三人稱單數：\nHe / She / It + 動詞 s／es／ies\nwork → works；watch → watches；study → studies\n\nI work. / She works.\nDoes she work?（does 後用原形）\n\n解題：先找主詞，再看是不是現在式。'
  },
  {
    id:'questions',title:'肯定、否定與疑問句',level:'初級',subtitle:'如何從「他工作」變成「他不工作」和「他工作嗎？」',
    paragraphs:['be 動詞句與一般動詞句的否定和疑問形成方式不同。be 動詞本身可以移到句首；一般動詞通常需要 do 或 does 幫忙。',
      'does 已經表示第三人稱單數，所以 does 後面的主要動詞一定要回到原形。'],
    rules:[['be 肯定 → 否定','He is busy. → He is not busy.'],['be 疑問','He is busy. → Is he busy?'],['一般動詞否定','She works. → She does not work.'],['一般動詞疑問','She works. → Does she work?']],
    examples:[['The manager is not available.','經理目前無法接待。'],['Is the manager available?','經理有空嗎？'],['The employee does not work today.','這位員工今天不工作。']],
    vocab:['available','manager','employee','schedule'],tip:'Do／Does／Did 後面接動詞原形，不能再加 -s 或 -ed。',
    notes:'be 動詞：\n否定＝主詞 + be + not\n疑問＝Be + 主詞 + ... ?\n\n一般動詞：\n否定＝主詞 + do/does not + 原形動詞\n疑問＝Do/Does + 主詞 + 原形動詞?\n\n重點：Does she work?（不可寫 works）'
  },
  {
    id:'time',title:'現在式與過去式入門',level:'初級',subtitle:'看到 yesterday、last week，就先想到過去式。',
    paragraphs:['現在簡單式常用來表達習慣、固定事實；過去簡單式描述過去某個時間發生的事。',
      '規則動詞過去式常加 -ed，但有些不規則變化，例如 go → went、buy → bought，必須另外記憶。'],
    rules:[['現在式常見線索','every day、usually、often'],['過去式常見線索','yesterday、last week、two days ago'],['規則動詞','work → worked；submit → submitted'],['不規則動詞','go → went；buy → bought']],
    examples:[['She works every day.','她每天工作。'],['The manager submitted the report yesterday.','經理昨天提交了報告。'],['The company hired two employees last month.','公司上個月雇用了兩名員工。']],
    vocab:['submit','hire','report','yesterday'],tip:'找出時間副詞，再判斷動詞型態。yesterday 通常要求過去式，不要直接選現在式。',
    notes:'現在簡單式：習慣／事實。常見 every day、usually。\n過去簡單式：過去發生的事。常見 yesterday、last week。\n\n規則：work → worked；submit → submitted。\n不規則：go → went；buy → bought。\n\n例：The manager submitted a report yesterday。'
  }
];

const QUESTIONS = [
  {id:'g1',cat:'基礎文法',part:'入門',stem:'I _____ an employee.',translation:'我是一名員工。',options:['am','is','are','be'],correct:0,hint:'先看主詞 I。',why:'主詞 I 在現在式搭配 am。',reasons:['am 專門與 I 搭配。','is 用於第三人稱單數，不與 I 搭配。','are 用於 You／We／They 等主詞。','be 是原形，不符合這裡的現在式肯定句。']},
  {id:'g2',cat:'基礎文法',part:'入門',stem:'The managers _____ in the office.',translation:'經理們在辦公室。',options:['am','is','are','be'],correct:2,hint:'managers 是複數。',why:'The managers 是複數主詞，現在式應使用 are。',reasons:['am 只與 I 搭配。','is 與單數主詞搭配。','are 與複數主詞搭配。','be 不能直接代替這裡的現在式 are。']},
  {id:'g3',cat:'基礎文法',part:'入門',stem:'She _____ in the sales department.',translation:'她在業務部門工作。',options:['work','works','working','worked'],correct:1,hint:'主詞是 She，而且沒有表示過去的時間。',why:'現在簡單式中 She 是第三人稱單數，因此動詞 work 要變 works。',reasons:['work 是原形；在此第三人稱單數肯定句不適用。','works 是第三人稱單數現在式。','working 需要 is 等助動詞才能表示正在工作。','worked 是過去式，本句沒有過去的時間線索。']},
  {id:'g4',cat:'基礎文法',part:'入門',stem:'Does the manager _____ here?',translation:'經理在這裡工作嗎？',options:['works','work','working','worked'],correct:1,hint:'Does 後面的主要動詞用原形。',why:'助動詞 Does 已經表示第三人稱單數，主要動詞回到原形 work。',reasons:['works 不能放在 Does 後面。','work 是原形，符合 Does + 主詞 + 原形動詞。','working 是現在分詞，不能直接放在 Does 後。','worked 是過去式，不能接在 Does 後。']},
  {id:'g5',cat:'基礎文法',part:'入門',stem:'The company has three _____.',translation:'這間公司有三名員工。',options:['employee','employees','employed','employment'],correct:1,hint:'three 後面接可數名詞複數。',why:'three 表示三個，因此需要 employees（複數員工）。',reasons:['employee 是單數名詞。','employees 是複數名詞。','employed 通常為形容詞或動詞形式，不表示「三名員工」。','employment 表示就業或雇用狀態，不是可數的三名員工。']},
  {id:'g6',cat:'基礎文法',part:'Part 5',stem:'The manager _____ the report yesterday.',translation:'經理昨天提交了報告。',options:['submit','submits','submitted','submitting'],correct:2,hint:'yesterday 是過去時間線索。',why:'yesterday 表示過去，因此使用 submit 的過去式 submitted。',reasons:['submit 是動詞原形，不能直接表示此過去動作。','submits 是現在式第三人稱單數。','submitted 是正確的過去式。','submitting 是現在分詞，缺少助動詞，不能單獨作為此句主要動詞。']},
  {id:'g7',cat:'基礎文法',part:'Part 5',stem:'Ms. Lin is _____ experienced manager.',translation:'林女士是一位經驗豐富的經理。',options:['a','an','the','some'],correct:1,hint:'experienced 的第一個發音是母音。',why:'單數可數名詞 manager 前需要限定詞，experienced 以母音音素開頭，因此用 an。',reasons:['a 通常接子音音素開頭的單字。','an 接母音音素開頭的單數可數名詞片語。','the 表示特定對象，本句一般介紹身分時不合適。','some 不接此處的單數可數名詞。']},
  {id:'g8',cat:'基礎文法',part:'Part 5',stem:'The new policy will _____ all employees.',translation:'這項新政策將影響所有員工。',options:['affect','effect','effective','effectively'],correct:0,hint:'will 後面需要動詞原形。',why:'affect（v. 影響）是符合句意的動詞原形。',reasons:['affect 是動詞，表示影響。','effect 多半為名詞「效果」；作動詞時表示「促成」，與本句所需意思不同。','effective 是形容詞「有效的」。','effectively 是副詞「有效地」。']},
  {id:'v1',cat:'單字比較',part:'Part 5',stem:'The company decided to _____ the meeting until next Monday.',translation:'公司決定將會議延後至下星期一。',options:['cancel','postpone','purchase','increase'],correct:1,hint:'until next Monday 暗示時間延後。',why:'postpone 表示延後，且可用 postpone ... until ...。',reasons:['cancel 表示取消，不是延到下一週。','postpone 表示延期，符合句意。','purchase 表示購買。','increase 表示增加。']},
  {id:'v2',cat:'單字比較',part:'Part 5',stem:'Please _____ your application before Friday.',translation:'請在星期五之前提交申請。',options:['submit','subtract','subscribe','substitute'],correct:0,hint:'application 是申請書，題目需要「提交」。',why:'submit an application 是常見固定搭配。',reasons:['submit 表示提交、呈交。','subtract 表示減去。','subscribe 表示訂閱。','substitute 表示代替。']},
  {id:'v3',cat:'單字比較',part:'Part 5',stem:'A copy of the _____ will be emailed to each attendee.',translation:'會議紀錄的副本將以電子郵件寄給每位出席者。',options:['minutes','seconds','hours','dates'],correct:0,hint:'會議記錄有一個與時間單位同形的英文單字。',why:'meeting minutes 表示會議紀錄，minutes 在這裡不是分鐘。',reasons:['minutes 在會議語境中表示會議紀錄。','seconds 是秒，並非會議紀錄。','hours 是小時。','dates 是日期。']},
  {id:'v4',cat:'單字比較',part:'Part 5',stem:'The store offers a ten-percent _____ on all office supplies.',translation:'商店對所有辦公用品提供九折優惠。',options:['discount','invoice','salary','vacancy'],correct:0,hint:'ten-percent 和 store 提示優惠。',why:'discount 表示折扣；a ten-percent discount 是九折優惠。',reasons:['discount 是折扣。','invoice 是發票。','salary 是薪資。','vacancy 是空缺、職缺。']},
  {id:'l1',cat:'聽力入門',part:'模擬問答',stem:'Where is the manager?',translation:'經理在哪裡？',options:['In the office.','On Friday.','Two employees.','A new report.'],correct:0,audio:'The manager is in the office today.',hint:'注意表示地點的介系詞片語。',why:'錄音說經理今天在辦公室，因此地點是 in the office。',reasons:['In the office 回答地點。','On Friday 回答時間，不是位置。','Two employees 回答數量或人物。','A new report 是物品，不是地點。']},
  {id:'l2',cat:'聽力入門',part:'模擬問答',stem:'What time will the train depart?',translation:'火車幾點出發？',options:['At 8:15.','At 9:15.','At 10:30.','At 11:00.'],correct:1,audio:'Attention passengers. The train to Boston will depart at nine fifteen.',hint:'留意英文的時間 nine fifteen。',why:'nine fifteen 等於 9:15。',reasons:['8:15 並非錄音中的時間。','9:15 是 nine fifteen。','10:30 並非錄音中的時間。','11:00 並非錄音中的時間。']},
  {id:'r1',cat:'短文閱讀',part:'Part 6 模擬',context:'Dear Ms. Chen,\nWe have received your job application. We will _____ you next week to arrange an interview.\nBest regards,\nHR Department',stem:'Which word best completes the email?',translation:'這封郵件表示收到求職申請，並將於下星期與申請人聯絡安排面試。',options:['contact','cancel','reduce','ship'],correct:0,hint:'安排面試需要和申請人聯繫。',why:'contact you 是「與你聯絡」，符合上下文。',reasons:['contact you 符合人資安排面試的情境。','cancel you 不符合英文搭配與文意。','reduce you 不符合文意。','ship you 表示運送人員，不符合此郵件情境。']},
  {id:'r2',cat:'短文閱讀',part:'Part 7 模擬',context:'NOTICE\nThe office will be closed on Monday, November 9, for maintenance. Employees can work from home. Normal operations will resume on Tuesday.',stem:'When will normal operations resume?',translation:'辦公室將於 11 月 9 日星期一維修關閉；員工可在家工作，星期二恢復正常營運。',options:['Sunday','Monday','Tuesday','Friday'],correct:2,hint:'找到 Normal operations will resume ... 這一句。',why:'文章最後一句清楚指出 on Tuesday。',reasons:['Sunday 未在公告中作為恢復日期。','Monday 是關閉維修的日期。','Tuesday 是正常營運恢復的日期。','Friday 未出現在公告的恢復安排。']}
];

const state = {page:'home',lesson:LESSONS[0].id,wordLimit:12,practiceCategory:'全部',practiceIndex:0,answers:{}};
const vocab = Array.isArray(window.TOEIC_VOCAB) ? window.TOEIC_VOCAB : [];
const $ = sel => document.querySelector(sel);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const compact = value => !value || value==='—' ? '無常見直接對應／尚未補充' : value;
const voiceButton = (phrase, label='🔊') => `<button class="play-button" type="button" data-say="${escapeHTML(phrase)}" aria-label="播放：${escapeHTML(phrase)}">${label}</button>`;

function selectPage(page) {
  if (!['home','grammar','words','practice','notes'].includes(page)) return;
  state.page=page;
  document.querySelectorAll('.page').forEach(el=>el.classList.toggle('active',el.id==='page-'+page));
  document.querySelectorAll('.nav-button').forEach(btn=>{const on=btn.dataset.pageTarget===page;btn.classList.toggle('active',on);btn.setAttribute('aria-current',on?'page':'false')});
  window.scrollTo({top:0,behavior:'instant'});
}

let lastAudio='',audioSeq=0;
function speak(phrase) {
  const status=$('#audio-status');
  const synth=window.speechSynthesis;
  if (!synth || typeof window.SpeechSynthesisUtterance === 'undefined') {status.textContent='瀏覽器不支援語音';return;}
  if (!phrase) return;
  const seq=++audioSeq;
  lastAudio=phrase;
  synth.cancel();
  const utterance=new SpeechSynthesisUtterance(phrase);
  utterance.lang=$('#accent-select').value;
  utterance.rate=Number($('#rate-select').value);
  const voices=synth.getVoices();
  const voice=voices.find(v=>v.lang.toLowerCase()===utterance.lang.toLowerCase()) || voices.find(v=>v.lang.toLowerCase().startsWith('en-'));
  if (voice) utterance.voice=voice;
  utterance.onstart=()=>{if(audioSeq===seq)status.textContent='播放中…'};
  utterance.onend=()=>{if(audioSeq===seq)status.textContent='播放完成'};
  utterance.onerror=e=>{if(audioSeq===seq&&!['canceled','interrupted'].includes(e.error))status.textContent='播放失敗，請檢查裝置語音設定'};
  status.textContent='準備播放…';
  synth.speak(utterance);
}

function renderLessons() {
  $('#lesson-list').innerHTML=LESSONS.map((lesson,i)=>`<button class="lesson-nav ${lesson.id===state.lesson?'active':''}" type="button" data-lesson="${lesson.id}"><span class="lesson-num">${String(i+1).padStart(2,'0')}</span><span class="lesson-name">${escapeHTML(lesson.title)}</span></button>`).join('');
  const lesson=LESSONS.find(x=>x.id===state.lesson) || LESSONS[0];
  $('#lesson-detail').innerHTML=`
    <div class="lesson-title-row"><div><span class="pill">${escapeHTML(lesson.level)}</span><h2>${escapeHTML(lesson.title)}</h2><p class="lesson-subtitle">${escapeHTML(lesson.subtitle)}</p></div><span style="font-size:25px" aria-hidden="true">📖</span></div>
    <h3 class="section-mini">先理解這個觀念</h3>
    ${lesson.paragraphs.map(p=>`<p class="paragraph">${escapeHTML(p)}</p>`).join('')}
    <h3 class="section-mini">觀念重點</h3><div class="lesson-rules">${lesson.rules.map(r=>`<div class="rule-card"><strong>${escapeHTML(r[0])}</strong><p>${escapeHTML(r[1])}</p></div>`).join('')}</div>
    <h3 class="section-mini">例句：點一下就可以聽</h3>${lesson.examples.map(ex=>`<div class="example-row"><div><strong>${escapeHTML(ex[0])}</strong><small>${escapeHTML(ex[1])}</small></div>${voiceButton(ex[0])}</div>`).join('')}
    <h3 class="section-mini">搭配單字</h3><div class="word-tags">${lesson.vocab.map(w=>`<button class="tag green" type="button" data-word-jump="${escapeHTML(w)}">${escapeHTML(w)} ↗</button>`).join('')}</div>
    <div class="tip-box">🔎 <strong>多益解題提示：</strong>${escapeHTML(lesson.tip)}</div>
    <h3 class="section-mini">📝 這堂課的手寫筆記</h3><div class="note-snippet">${escapeHTML(lesson.notes)}</div>
    <div class="lesson-actions"><button class="primary-button" type="button" data-page-target="practice">做幾題試試看 →</button><button class="outline-button" type="button" data-notes-jump="${lesson.id}">查看筆記本 →</button></div>`;
}

function vocabMatches() {
  const query=$('#word-query').value.trim().toLocaleLowerCase();
  const category=$('#word-category').value;
  const source=$('#word-source').value;
  const matches=vocab.filter(w=>(!category||w.category===category)&&(!source||w.source===source)&&(!query||[w.word,w.meaning,w.usage,w.family,w.synonyms,w.confusing].some(x=>String(x||'').toLocaleLowerCase().includes(query))));
  if (!query && !category && !source) {
    const firstWords=['work','office','company','employee','manager','student','teacher','job','team','meeting','report','email','read','write','study','learn','help','start','finish','need','apply','application','hire','submit'];
    const order=new Map(firstWords.map((name,i)=>[name,i]));
    return matches.sort((a,b)=>(order.get(a.word.toLowerCase())??10000)-(order.get(b.word.toLowerCase())??10000));
  }
  return matches;
}
function renderVocabCard(w,index) {
  const details=[['常見搭配',w.usage],['同義／近義',w.synonyms],['反義詞',w.antonyms],['容易混淆',w.confusing],['詞族',w.family],['學習提醒',w.note]];
  const forms=['原形','第三人稱單數','過去式','過去分詞','V-ing','未來式'];
  return `<article class="word-card"><div class="word-head"><div><h3>${escapeHTML(w.word)}</h3><div class="meaning">${escapeHTML(w.meaning)}</div></div>${voiceButton(w.word)}</div>
    <div class="word-tags"><span class="tag green">${escapeHTML(w.pos)}</span><span class="tag">${escapeHTML(w.category)}</span><span class="tag orange">${escapeHTML(w.source)}</span></div>
    ${w.split?`<div class="split-tiles" aria-label="拼字拆分">${w.split.split('/').map(s=>`<span class="split-piece">${escapeHTML(s)}</span>`).join('<span style="color:#8ca9a1">/</span>')}</div>`:''}
    ${w.usage?`<div class="word-usage">📌 ${escapeHTML(w.usage)} ${voiceButton(w.usage)}</div>`:''}
    <button class="details-toggle" type="button" data-detail-toggle="${index}" aria-expanded="false">查看用法、相似詞及變化 <span aria-hidden="true">⌄</span></button>
    <div class="word-detail" id="word-detail-${index}"><dl>${details.map(d=>`<dt>${escapeHTML(d[0])}</dt><dd>${escapeHTML(compact(d[1]))}</dd>`).join('')}</dl>
    ${w.forms?`<h4 style="margin:15px 0 6px">動詞變化</h4><div class="forms-grid">${w.forms.map((f,i)=>`<div class="form-chip"><strong>${forms[i]}</strong>${escapeHTML(f)}</div>`).join('')}</div>`:''}</div>
  </article>`;
}
function renderWords(reset=false) {
  if(reset)state.wordLimit=12;
  const filtered=vocabMatches();
  const subset=filtered.slice(0,state.wordLimit);
  $('#word-result-status').textContent=`找到 ${filtered.length} 個字詞，顯示 ${subset.length} 個；點卡片查看詳細資料。`;
  $('#word-grid').innerHTML=subset.length?subset.map(renderVocabCard).join(''):'<div class="surface-card">找不到符合的字詞，試試其他英文、中文或主題。</div>';
  $('#show-more-words').hidden=subset.length>=filtered.length;
}

function getQuestions() {return state.practiceCategory==='全部'?QUESTIONS:QUESTIONS.filter(q=>q.cat===state.practiceCategory)}
function renderPractice() {
  const options=['全部',...new Set(QUESTIONS.map(q=>q.cat))];
  $('#practice-filter').innerHTML=options.map(v=>`<button class="filter-button ${v===state.practiceCategory?'active':''}" type="button" data-practice-cat="${escapeHTML(v)}">${escapeHTML(v)}</button>`).join('');
  const items=getQuestions();
  if(!items.length)return;
  state.practiceIndex=Math.max(0,Math.min(state.practiceIndex,items.length-1));
  const q=items[state.practiceIndex];
  const chosen=state.answers[q.id];
  const solved=chosen!==undefined;
  $('#practice-container').innerHTML=`<article class="question-card">
     <div class="question-top"><span class="pill">${escapeHTML(q.part)}</span><span class="muted" style="font-size:12px">題目 ${state.practiceIndex+1} / ${items.length}</span></div>
     ${q.audio?`<p class="muted" style="font-size:13px;margin-top:14px">🎧 先點播放，再看題目作答。答題後才會顯示逐字稿。</p><div style="margin-bottom:10px">${voiceButton(q.audio,'▶ 播放聽力題')}</div>`:''}
     ${q.context?`<div class="question-context">${escapeHTML(q.context)}</div>`:''}
     <div class="question-text">${escapeHTML(q.stem)} ${!q.audio?voiceButton(q.stem):''}</div>
     <div class="option-list">${q.options.map((opt,i)=>`<button type="button" class="option-button ${solved?(i===q.correct?'correct':chosen===i?'incorrect':''):''}" data-choose="${i}" ${solved?'disabled':''}><span class="choice-letter">${'ABCD'[i]}.</span>${escapeHTML(opt)}</button>`).join('')}</div>
     <div class="solution-box ${solved?'open':''}">
       <div class="answer-title">${chosen===q.correct?'✓ 答對了！':'解析｜再理解一次'} 正確答案：${'ABCD'[q.correct]}. ${escapeHTML(q.options[q.correct])}</div>
       ${q.audio?`<p><strong>英文逐字稿：</strong>${escapeHTML(q.audio)}</p>`:''}
       <p><strong>題目中文：</strong>${escapeHTML(q.translation)}</p><p><strong>關鍵線索：</strong>${escapeHTML(q.hint)}</p><p><strong>解題理由：</strong>${escapeHTML(q.why)}</p>
       <p style="font-weight:800;margin-bottom:4px">四個選項逐一解析</p><ol class="explain-list" type="A">${q.reasons.map(t=>`<li>${escapeHTML(t)}</li>`).join('')}</ol>
     </div>
    </article><div class="practice-bottom"><button type="button" class="outline-button" data-practice-nav="prev" ${state.practiceIndex===0?'disabled':''}>← 上一題</button><span class="practice-counter">${Object.keys(state.answers).length} 題已有作答</span><button type="button" class="primary-button" data-practice-nav="next" ${state.practiceIndex===items.length-1?'disabled':''}>下一題 →</button></div>`;
}

function renderNotes() {
  const select=$('#notes-lesson');
  const id=select.value||state.lesson;
  const lesson=LESSONS.find(x=>x.id===id)||LESSONS[0];
  const backup={manage:'管理',busy:'忙碌的',available:'有空的；可使用的',schedule:'時間表；安排'};
  $('#notes-content').innerHTML=`<p class="kicker">HANDWRITTEN NOTES</p><h2>${escapeHTML(lesson.title)}</h2><div class="handwritten-note">${escapeHTML(lesson.notes)}</div><h3>搭配記憶的單字</h3><ul>${lesson.vocab.map(name=>{const w=vocab.find(x=>x.word.toLowerCase()===name.toLowerCase());return `<li>${escapeHTML(name)}${w?'（'+escapeHTML(w.pos)+'）'+escapeHTML(w.meaning):'：'+escapeHTML(backup[name]||'')}${voiceButton(name)}</li>`}).join('')}</ul><h3>多益解題提醒</h3><p>${escapeHTML(lesson.tip)}</p>`;
}
function notesText(lesson) {
  const words=lesson.vocab.map(name=>{
    const w=vocab.find(x=>x.word.toLowerCase()===name.toLowerCase());
    return `${name}：${w?.meaning||'課堂搭配詞'}`;
  });
  return `${lesson.title}\n\n${lesson.notes}\n\n搭配單字：\n${words.join('\n')}\n\n多益解題提醒：${lesson.tip}`;
}

document.addEventListener('click', e=>{
  const say=e.target.closest('[data-say]');if(say){speak(say.dataset.say);return;}
  const jump=e.target.closest('[data-page-target]');if(jump){selectPage(jump.dataset.pageTarget);return;}
  const lesson=e.target.closest('[data-lesson]');if(lesson){state.lesson=lesson.dataset.lesson;renderLessons();return;}
  const word=e.target.closest('[data-word-jump]');if(word){selectPage('words');$('#word-query').value=word.dataset.wordJump;$('#word-category').value='';$('#word-source').value='';renderWords(true);return;}
  const note=e.target.closest('[data-notes-jump]');if(note){$('#notes-lesson').value=note.dataset.notesJump;renderNotes();selectPage('notes');return;}
  const detail=e.target.closest('[data-detail-toggle]');if(detail){const div=$('#word-detail-'+detail.dataset.detailToggle);const open=div.classList.toggle('open');detail.setAttribute('aria-expanded',open?'true':'false');detail.lastElementChild.textContent=open?'⌃':'⌄';return;}
  const filter=e.target.closest('[data-practice-cat]');if(filter){state.practiceCategory=filter.dataset.practiceCat;state.practiceIndex=0;renderPractice();return;}
  const ans=e.target.closest('[data-choose]');if(ans){const q=getQuestions()[state.practiceIndex];if(state.answers[q.id]===undefined){state.answers[q.id]=Number(ans.dataset.choose);renderPractice();}return;}
  const nav=e.target.closest('[data-practice-nav]');if(nav){state.practiceIndex+=nav.dataset.practiceNav==='next'?1:-1;renderPractice();return;}
});

$('#word-query').addEventListener('input',()=>renderWords(true));
$('#word-category').addEventListener('change',()=>renderWords(true));
$('#word-source').addEventListener('change',()=>renderWords(true));
$('#show-more-words').addEventListener('click',()=>{state.wordLimit+=12;renderWords();});
$('#notes-lesson').addEventListener('change',renderNotes);
$('#repeat-audio').addEventListener('click',()=>lastAudio?speak(lastAudio):$('#audio-status').textContent='請先播放英文');
$('#stop-audio').addEventListener('click',()=>{audioSeq++;window.speechSynthesis?.cancel();$('#audio-status').textContent='已停止'});
$('#copy-notes').addEventListener('click',async()=>{
  const lesson=LESSONS.find(x=>x.id===$('#notes-lesson').value)||LESSONS[0];
  const text=notesText(lesson);
  try {await navigator.clipboard.writeText(text);$('#copy-notes').textContent='✓ 已複製';}
  catch {$('#copy-notes').textContent='無法複製，請手動選取筆記';}
  setTimeout(()=>$('#copy-notes').textContent='複製筆記',1800);
});
$('#print-notes').addEventListener('click',()=>{selectPage('notes');window.print();});

const categories=[...new Set(vocab.map(w=>w.category))].sort((a,b)=>a.localeCompare(b,'zh-Hant'));
$('#word-category').innerHTML='<option value="">全部主題</option>'+categories.map(name=>`<option value="${escapeHTML(name)}">${escapeHTML(name)}</option>`).join('');
$('#notes-lesson').innerHTML=LESSONS.map(x=>`<option value="${x.id}">${escapeHTML(x.title)}</option>`).join('');
$('#current-word-count').textContent=vocab.length.toLocaleString('en-US');
$('#current-lesson-count').textContent=LESSONS.length;
renderLessons();renderWords(true);renderPractice();renderNotes();
