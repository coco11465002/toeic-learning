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

// 從初學者的第一課一路銜接到多益基本句型，每課獨立可複習。
LESSONS.push(
  {id:'continuous',title:'現在進行式',level:'初級',subtitle:'正在做某件事：am / is / are + V-ing。',
    paragraphs:['現在進行式描述「此刻正在進行」的動作。be 動詞要配合主詞，後面的動詞改成 ing。','現在進行式和現在簡單式不同：She works. 是平常的習慣；She is working. 是她正在工作。'],
    rules:[['I + am + V-ing','I am reading.'],['He / She / It + is + V-ing','She is working.'],['You / We / They + are + V-ing','They are preparing.']],
    examples:[['The manager is speaking.','經理正在說話。'],['We are preparing the documents.','我們正在準備文件。']],
    vocab:['prepare','work','speak','document'],tip:'選項有 working 時，確認空格前是否有 am／is／are。',
    notes:'現在進行式＝主詞 + am/is/are + V-ing。\nI am reading.／She is working.／They are preparing.\n\n現在簡單式：She works.（習慣）\n現在進行式：She is working.（正在發生）'},
  {id:'future',title:'未來式：will 與 be going to',level:'初級',subtitle:'會發生、打算做的事。',
    paragraphs:['未來式常用 will + 動詞原形，也能使用 be going to + 動詞原形來描述已有的計畫。','will 後面不加 -s，也不加 -ed。例如 He will work.'],
    rules:[['will + 原形動詞','will send / will arrive'],['be going to + 原形','is going to visit'],['未來時間線索','tomorrow、next week、soon']],
    examples:[['She will call tomorrow.','她明天會打電話。'],['We are going to meet next week.','我們下週打算見面。']],
    vocab:['tomorrow','call','meet','schedule'],tip:'看到 will 時先找原形動詞，別選 works 或 worked。',
    notes:'will + V 原形：I will work.（我將工作。）\nbe going to + V 原形：She is going to study.（她打算念書。）\n\n線索：tomorrow、next week、soon。'},
  {id:'perfect',title:'現在完成式：have / has + p.p.',level:'中級入門',subtitle:'做過、已完成，或從過去持續到現在。',
    paragraphs:['現在完成式使用 have／has 加上過去分詞（p.p.）。第三人稱單數要用 has。','已完成的工作經常搭配 already；經驗則常搭配 ever、never。'],
    rules:[['I / You / We / They + have + p.p.','We have finished.'],['He / She / It + has + p.p.','She has submitted.'],['常見時間副詞','already、yet、ever、since、for']],
    examples:[['The manager has approved the report.','經理已核准報告。'],['We have received your email.','我們已收到你的電子郵件。']],
    vocab:['approve','receive','already','report'],tip:'has／have 後面通常選過去分詞，注意不規則動詞。',
    notes:'現在完成式＝have/has + p.p.（過去分詞）。\nI have finished.／She has finished.\n\nalready 已經；yet 還沒／已經；since 自從；for 持續多久。'},
  {id:'articles',title:'冠詞：a、an、the',level:'初級',subtitle:'看名詞前面為什麼有 a、an、the。',
    paragraphs:['單數可數名詞通常不能直接孤零零地出現，前面常需 a、an、the 或其他限定詞。','a 與 an 要根據發音而不是單純拼字決定；the 常表示已知或特定的對象。'],
    rules:[['a + 子音音素','a report / a university'],['an + 母音音素','an employee / an hour'],['the + 特定對象','the meeting we discussed']],
    examples:[['She is an employee.','她是一名員工。'],['Please read the report.','請閱讀那份報告。']],
    vocab:['employee','report','meeting','office'],tip:'a／an 是看緊跟其後的發音；「an university」是錯的。',
    notes:'a：子音音素前 → a report。\nan：母音音素前 → an employee。\nthe：特定的人或物 → the report。\n\n注意發音：an hour、a university。'},
  {id:'wordforms',title:'形容詞、副詞與詞性變化',level:'中級入門',subtitle:'多益 Part 5 最常見的詞性判斷。',
    paragraphs:['同一字根可以變成不同詞性。空格前後的文法位置，往往比中文翻譯更有用。','形容詞通常修飾名詞；副詞常修飾動詞，部分副詞以 -ly 結尾。'],
    rules:[['形容詞 + 名詞','careful review'],['動詞 + 副詞','work carefully'],['常見字尾','-tion 名詞；-ive 形容詞；-ly 副詞']],
    examples:[['She is a careful worker.','她是一位仔細的工作者。'],['She works carefully.','她工作得很仔細。']],
    vocab:['carefully','important','effective','effectively'],tip:'名詞前可能需要形容詞；修飾動詞時可能需要副詞。',
    notes:'adj. 形容詞：修飾名詞，a careful worker。\nadv. 副詞：修飾動詞，work carefully。\n\n常見詞族：effect（n.）→ effective（adj.）→ effectively（adv.）。'},
  {id:'comparatives',title:'比較級與最高級',level:'中級入門',subtitle:'比較兩者與多者的差異。',
    paragraphs:['比較兩個人或物時，常使用比較級 + than。比較三者以上的最高程度，常使用 the + 最高級。','部分形容詞加 -er／-est；較長的形容詞常用 more／most。'],
    rules:[['比較級 + than','faster than'],['the + 最高級','the fastest'],['長形容詞','more expensive / most expensive']],
    examples:[['This computer is faster than that one.','這部電腦比那部快。'],['This is the most expensive product.','這是最昂貴的產品。']],
    vocab:['expensive','fast','product','computer'],tip:'看到 than，先考慮比較級；看到 the 和範圍，留意最高級。',
    notes:'比較兩者：adj.-er / more adj. + than。\n比較多者：the adj.-est / the most adj.。\n\nfast → faster → fastest。\nexpensive → more expensive → most expensive。'},
  {id:'prepositions',title:'時間與地點介系詞',level:'初級',subtitle:'in、on、at、by、until 有什麼不同？',
    paragraphs:['介系詞常和時間、地點一起出現，多益填空題很常考。','先從三組記憶：in 接月份／年份；on 接日期／星期；at 接確切時間。'],
    rules:[['in','in October；in 2026；in the office'],['on','on Monday；on October 5'],['at','at 9 a.m.；at the station'],['by / until','by Friday＝不晚於週五；until Friday＝持續到週五']],
    examples:[['The meeting starts at nine.','會議九點開始。'],['Submit the form by Friday.','請最晚星期五提交表格。']],
    vocab:['in','on','at','before'],tip:'by 表示期限；until 表示動作持續到某時間，不可完全互換。',
    notes:'時間：in + 月／年；on + 星期／日期；at + 幾點。\n地點：in the office；at the station。\n\nby Friday：最晚週五。\nuntil Friday：持續到週五。'},
  {id:'conjunctions',title:'連接詞：and、but、because、although',level:'中級入門',subtitle:'弄清楚兩個句子是什麼關係。',
    paragraphs:['連接詞可以連接字詞或句子。考題常藉由前後語意測試原因、對比或補充。','because 表示原因；although 表示讓步；but 表示轉折。'],
    rules:[['and','而且；並且'],['but / although','但是／雖然（句型不同）'],['because / so','因為／所以']],
    examples:[['We stayed home because it rained.','因為下雨，我們待在家。'],['Although it rained, we went out.','雖然下雨，我們還是出門。']],
    vocab:['because','although','however','therefore'],tip:'先抓兩句是「因果」還是「轉折」，再比較選項詞性與句型。',
    notes:'and：並且；but：但是。\nbecause：因為，後接完整子句。\nalthough：雖然，後接完整子句。\n\n例：Although she was busy, she helped us.'},
  {id:'passive',title:'被動語態：be + p.p.',level:'中級',subtitle:'報告被提交、貨物被寄出。',
    paragraphs:['如果句子強調承受動作的人或物，可以使用被動語態。基本結構是 be 動詞 + 過去分詞。','時態改變時，be 也會跟著變：is delivered、was delivered、will be delivered。'],
    rules:[['現在式被動','is / are + p.p.'],['過去式被動','was / were + p.p.'],['未來式被動','will be + p.p.']],
    examples:[['The order was shipped yesterday.','訂單昨天已寄出。'],['The report will be reviewed tomorrow.','報告明天會被審查。']],
    vocab:['ship','review','order','submit'],tip:'看到 be + p.p.，先判斷主詞是否「被」做某件事。',
    notes:'被動語態＝be + p.p.。\n現在：is/are reviewed。\n過去：was/were reviewed。\n未來：will be reviewed。\n\nThe order was shipped.（訂單被寄出。）'},
  {id:'infinitives',title:'不定詞與動名詞',level:'中級',subtitle:'to do 和 doing 該怎麼選？',
    paragraphs:['有些動詞後面常接 to + 原形動詞，另一些後面常接 V-ing。這是多益常見固定搭配。','want to、plan to、decide to；avoid doing、enjoy doing、finish doing，先記熟高頻搭配。'],
    rules:[['want / decide / plan + to V','plan to attend'],['enjoy / avoid / finish + V-ing','avoid making mistakes'],['介系詞後常接 V-ing','interested in learning']],
    examples:[['We plan to attend the meeting.','我們計畫出席會議。'],['Please avoid making errors.','請避免犯錯。']],
    vocab:['plan','attend','avoid','finish'],tip:'先找空格前的動詞／介系詞；固定搭配比直接翻譯更可靠。',
    notes:'to + V：want to／plan to／decide to。\nV-ing：avoid／enjoy／finish + V-ing。\n介系詞 + V-ing：interested in learning。'},
  {id:'modals',title:'情態助動詞：can、must、should',level:'中級入門',subtitle:'表示能力、必要與建議。',
    paragraphs:['can、could、may、must、should、might 等情態助動詞後面通常接動詞原形。','must 表示必須，should 表示應該，may／might 表示可能，意思不一樣。'],
    rules:[['can / could + V','can help'],['must / should + V','must submit / should check'],['may / might + V','may arrive']],
    examples:[['Employees must wear ID cards.','員工必須配戴識別證。'],['You should check the schedule.','你應該確認時程。']],
    vocab:['must','should','check','schedule'],tip:'看到 can、must、should，後面不加 -s／-ed。',
    notes:'情態助動詞 + V 原形。\ncan 能夠；must 必須；should 應該；may 可能。\n\nShe must work.（不可寫 must works）'},
  {id:'relative',title:'關係代名詞：who、which、that',level:'中級',subtitle:'把資訊加到名詞後面，讀懂多益長句。',
    paragraphs:['關係代名詞用來補充前面的人或物的資訊。who 常指人；which 常指物；that 在限制性關係子句中可指人或物。','閱讀時先抓主句，再把 who／which 後面的補充說明放進來理解。'],
    rules:[['who','The manager who called…'],['which','The report which arrived…'],['that','The product that we ordered…']],
    examples:[['The employee who called is new.','打電話的那位員工是新進人員。'],['The product that we ordered arrived.','我們訂購的產品已送達。']],
    vocab:['employee','product','order','arrive'],tip:'遇到長句時，先找主要動詞，關係子句通常用來修飾前方名詞。',
    notes:'who：常指人；which：常指物；that：可指人／物。\n\nThe employee who called is new.\n先找主句 The employee is new.，再看補充資訊 who called。'}
);

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

const state = {page:'home',lesson:LESSONS[0].id,wordLimit:12,practiceCategory:'全部',practiceIndex:0,answers:{},unit:1,completedUnits:new Set(),focusWords:[],focusIndex:0,focusRevealed:false,focusOrigin:'words',unitQuizAnswers:{},navDepth:0};
const vocab = Array.isArray(window.TOEIC_VOCAB) ? window.TOEIC_VOCAB : [];
const WORDS_PER_UNIT=10;
const priorityWords=['i','you','he','she','it','we','they','be','have','do','work','office','company','employee','manager','student','teacher','job','team','meeting','report','email','read','write','study','learn','help','start','finish','need','apply','application','hire','submit'];
const priorityIndex=new Map(priorityWords.map((word,i)=>[word,i]));
const sourcesOrder={'基礎增補':0,'基礎字庫':1,'原書':2,'補充':3};
const learningVocabulary=[...vocab].sort((a,b)=>{
  const ia=priorityIndex.get(a.word.toLowerCase())??9999,ib=priorityIndex.get(b.word.toLowerCase())??9999;
  if(ia!==ib)return ia-ib;
  return (sourcesOrder[a.source]??9)-(sourcesOrder[b.source]??9);
});
const $ = sel => document.querySelector(sel);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const compact = value => !value || value==='—' ? '無常見直接對應／尚未補充' : value;
const voiceButton = (phrase, label='🔊') => `<button class="play-button" type="button" data-say="${escapeHTML(phrase)}" aria-label="播放：${escapeHTML(phrase)}">${label}</button>`;

const PAGES=['home','path','grammar','words','focus','practice','notes'];
function showPage(page) {
  if (!PAGES.includes(page)) return;
  state.page=page;
  document.body.classList.toggle('focus-mode',page==='focus');
  document.querySelectorAll('.page').forEach(el=>el.classList.toggle('active',el.id==='page-'+page));
  document.querySelectorAll('.nav-button').forEach(btn=>{const on=btn.dataset.pageTarget===page;btn.classList.toggle('active',on);btn.setAttribute('aria-current',on?'page':'false')});
  $('#page-back').hidden=page==='home';
  $('#page-back-label').textContent={path:'循序學習',grammar:'文法教室',words:'單字小卡',focus:'單字專注模式',practice:'練習與詳解',notes:'手寫筆記'}[page]||'';
  window.scrollTo({top:0,behavior:'instant'});
}
function selectPage(page,{record=true}={}) {
  if (!PAGES.includes(page)) return;
  if(record && state.page!==page) {
    window.history.pushState({toeicPage:page,toeicDepth:state.navDepth+1},'',`#${page}`);
    state.navDepth++;
  }
  showPage(page);
}
window.addEventListener('popstate',e=>{
  const page=e.state?.toeicPage||window.location.hash.slice(1)||'home';
  state.navDepth=Math.max(0,Number(e.state?.toeicDepth)||0);
  showPage(PAGES.includes(page)?page:'home');
});
function goBack() {
  if(state.navDepth>0){window.history.back();return;}
  selectPage('home');
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
  const lessonIndex=LESSONS.indexOf(lesson);
  $('#lesson-detail').innerHTML=`
    <div class="lesson-title-row"><div><span class="pill">${escapeHTML(lesson.level)}</span><h2>${escapeHTML(lesson.title)}</h2><p class="lesson-subtitle">${escapeHTML(lesson.subtitle)}</p></div><span style="font-size:25px" aria-hidden="true">📖</span></div>
    <h3 class="section-mini">先理解這個觀念</h3>
    ${lesson.paragraphs.map(p=>`<p class="paragraph">${escapeHTML(p)}</p>`).join('')}
    <h3 class="section-mini">觀念重點</h3><div class="lesson-rules">${lesson.rules.map(r=>`<div class="rule-card"><strong>${escapeHTML(r[0])}</strong><p>${escapeHTML(r[1])}</p></div>`).join('')}</div>
    <h3 class="section-mini">例句：點一下就可以聽</h3>${lesson.examples.map(ex=>`<div class="example-row"><div><strong>${escapeHTML(ex[0])}</strong><small>${escapeHTML(ex[1])}</small></div>${voiceButton(ex[0])}</div>`).join('')}
    <h3 class="section-mini">搭配單字</h3><div class="word-tags">${lesson.vocab.map(w=>`<button class="tag green" type="button" data-word-jump="${escapeHTML(w)}">${escapeHTML(w)} ↗</button>`).join('')}</div>
    <div class="tip-box">🔎 <strong>多益解題提示：</strong>${escapeHTML(lesson.tip)}</div>
    <h3 class="section-mini">📝 這堂課的手寫筆記</h3><div class="note-snippet">${escapeHTML(lesson.notes)}</div>
    <div class="lesson-actions"><button class="primary-button" type="button" data-page-target="practice">做幾題試試看 →</button><button class="outline-button" type="button" data-notes-jump="${lesson.id}">查看筆記本 →</button></div>
    <div class="lesson-pagination"><button class="outline-button" type="button" data-lesson-step="prev" ${lessonIndex===0?'disabled':''}>← 上一堂</button><span>第 ${lessonIndex+1} / ${LESSONS.length} 堂</span><button class="primary-button" type="button" data-lesson-step="next" ${lessonIndex===LESSONS.length-1?'disabled':''}>下一堂文法 →</button></div>`;
}

function vocabMatches() {
  const query=$('#word-query').value.trim().toLocaleLowerCase();
  const category=$('#word-category').value;
  const source=$('#word-source').value;
  const matches=vocab.filter(w=>(!category||w.category===category)&&(!source||w.source===source)&&(!query||[w.word,w.meaning,w.usage,w.family,w.synonyms,w.confusing].some(x=>String(x||'').toLocaleLowerCase().includes(query))));
  if (!query && !category && !source) return learningVocabulary;
  return matches;
}
function renderVocabCard(w,index) {
  const details=[['常見搭配',w.usage],['同義／近義',w.synonyms],['反義詞',w.antonyms],['容易混淆',w.confusing],['詞族',w.family],['學習提醒',w.note]].filter(d=>d[1]&&d[1]!=='—');
  const forms=['原形','第三人稱單數','過去式','過去分詞','V-ing','未來式'];
  return `<article class="word-card"><div class="word-head"><div><h3>${escapeHTML(w.word)}</h3><div class="meaning">${escapeHTML(w.meaning)}</div></div>${voiceButton(w.word)}</div>
    <div class="word-tags"><span class="tag green">${escapeHTML(w.pos)}</span><span class="tag">${escapeHTML(w.category)}</span><span class="tag orange">${escapeHTML(w.source)}</span></div>
    <div class="split-tiles" aria-label="拼字拆分">${(w.split||w.word).split('/').map(s=>`<span class="split-piece">${escapeHTML(s.trim())}</span>`).join('<span style="color:#8ca9a1">/</span>')}</div>
    ${w.usage?`<div class="word-usage">📌 ${escapeHTML(w.usage)} ${voiceButton(w.usage)}</div>`:''}
    <button class="details-toggle" type="button" data-detail-toggle="${index}" aria-expanded="false">查看用法、相似詞及變化 <span aria-hidden="true">⌄</span></button>
    <button class="details-toggle" type="button" data-focus-index="${index}">◉ 單一單字專注畫面 →</button>
    <div class="word-detail" id="word-detail-${index}">${details.length?`<dl>${details.map(d=>`<dt>${escapeHTML(d[0])}</dt><dd>${escapeHTML(d[1])}</dd>`).join('')}</dl>`:'<p class="muted">本字的詞族與延伸比較資料尚未補充。</p>'}
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

function openFocus(words,index=0,origin='words') {
  state.focusWords=words.length?words:learningVocabulary;
  state.focusIndex=Math.min(Math.max(0,index),state.focusWords.length-1);
  state.focusRevealed=false;
  state.focusOrigin=origin;
  renderFocus();
  selectPage('focus');
}
function renderFocus() {
  const words=state.focusWords.length?state.focusWords:learningVocabulary;
  const w=words[state.focusIndex];
  if(!w)return;
  $('#exit-focus').textContent=state.focusOrigin==='path'?'返回學習單元':'返回單字列表';
  $('#focus-position').textContent=`${(state.focusIndex+1).toLocaleString('en-US')} / ${words.length.toLocaleString('en-US')}`;
  const splits=(w.split||w.word).split('/').map(x=>x.trim());
  const single=splits.length===1;
  $('#focus-card').innerHTML=`
    <span class="focus-label">Vocabulary Flashcard · ${escapeHTML(w.category)}</span>
    <div class="focus-word">${escapeHTML(w.word)}</div>
    ${voiceButton(w.word,'▶ 聽發音')}
    <div class="split-tiles">${splits.map((x,i)=>`${i?'<span style="color:#a8bbb3">/</span>':''}<span class="split-piece">${escapeHTML(x)}</span>`).join('')}</div>
    ${single?'<div class="focus-one-syllable">單音節或固定詞組：不強制拆分</div>':''}
    ${!state.focusRevealed?`<button type="button" class="primary-button focus-reveal" data-focus-reveal="1">顯示中文與詳解 ↓</button>`:
    `<div class="focus-answer"><h3>${escapeHTML(w.meaning)}</h3>
      <p><strong>詞性：</strong>${escapeHTML(w.pos)}　｜　<strong>來源：</strong>${escapeHTML(w.source)}</p>
      ${w.usage?`<p><strong>常見搭配：</strong>${escapeHTML(w.usage)} ${voiceButton(w.usage)}</p>`:''}
      ${w.synonyms?`<p><strong>同義／近義：</strong>${escapeHTML(w.synonyms)}</p>`:''}
      ${w.antonyms?`<p><strong>反義詞：</strong>${escapeHTML(w.antonyms)}</p>`:''}
      ${w.confusing?`<p><strong>易混淆詞：</strong>${escapeHTML(w.confusing)}</p>`:''}
      ${w.family?`<p><strong>字根／詞族：</strong>${escapeHTML(w.family)}</p>`:''}
      ${w.note?`<p><strong>學習提醒：</strong>${escapeHTML(w.note)}</p>`:''}
      ${w.forms?`<div class="forms-grid">${['原形','現在第三人稱','過去式','過去分詞','進行式 V-ing','未來式'].map((name,i)=>`<div class="form-chip"><strong>${name}</strong>${escapeHTML(w.forms[i])}</div>`).join('')}</div>`:''}
      <div class="focus-actions"><button type="button" class="outline-button" data-focus-reveal="0">重新遮住答案 ↑</button></div>
    </div>`}`;
  const back=$('[data-focus-nav="prev"]'),next=$('[data-focus-nav="next"]');
  back.disabled=state.focusIndex===0;
  next.disabled=state.focusIndex>=words.length-1;
}

function loadProgress() {
  try {
    const item=JSON.parse(window.localStorage.getItem('toeic_progress_v2')||'{}');
    state.unit=Math.min(Math.max(1,Number(item.unit)||1),Math.ceil(vocab.length/WORDS_PER_UNIT));
    state.completedUnits=new Set(Array.isArray(item.completed)?item.completed.filter(x=>Number.isInteger(x)&&x>=1&&x<=300):[]);
  } catch { state.unit=1;state.completedUnits=new Set(); }
}
function saveProgress() {
  try{window.localStorage.setItem('toeic_progress_v2',JSON.stringify({unit:state.unit,completed:[...state.completedUnits]}));}
  catch { /* 仍可使用，不要求登入或啟用儲存權限 */ }
}
function unitWords(unit=state.unit) {return learningVocabulary.slice((unit-1)*WORDS_PER_UNIT,unit*WORDS_PER_UNIT)}
function getUnitQuiz(unit=state.unit) {
  const words=unitWords(unit),picks=[0,3,7].filter(i=>i<words.length);
  return picks.map((wordIndex,qIndex)=>{
    const answer=words[wordIndex];
    const pool=[answer],used=new Set([answer.meaning]);
    for(const w of [...words.slice(qIndex+1),...words.slice(0,qIndex+1),...learningVocabulary.slice(unit*3,unit*3+20)]){
      if(w.word===answer.word||used.has(w.meaning))continue;
      pool.push(w);used.add(w.meaning);
      if(pool.length===4)break;
    }
    const rotated=[...pool.slice(qIndex%4),...pool.slice(0,qIndex%4)];
    return {answer,options:rotated,correct:rotated.indexOf(answer),id:`${unit}-${wordIndex}`};
  });
}
function renderUnitQuiz() {
  const el=$('#path-quiz');if(!el)return;
  const questions=getUnitQuiz();
  el.innerHTML=`<span class="path-eyebrow">🎯 單元自測</span><h2>學完後，試著自己選中文意思</h2>
    <p>先作答再看詳解；每題的四個選項都會說明對應到哪一個字。</p>
    ${questions.map((q,i)=>{
      const selected=state.unitQuizAnswers[q.id],solved=selected!==undefined;
      return `<div class="path-mini-quiz"><p><strong>第 ${i+1} 題：</strong>${escapeHTML(q.answer.word)} ${voiceButton(q.answer.word)}</p>
        <div class="path-mini-options">${q.options.map((w,j)=>`<button type="button" class="option-button ${solved?(j===q.correct?'correct':selected===j?'incorrect':''):''}" data-unit-choose="${i}:${j}" ${solved?'disabled':''}><span class="choice-letter">${'ABCD'[j]}.</span>${escapeHTML(w.meaning)}</button>`).join('')}</div>
        ${solved?`<div class="path-mini-feedback"><strong>${selected===q.correct?'✓ 答對了':'再記一次'}</strong>　${escapeHTML(q.answer.word)}（${escapeHTML(q.answer.pos)}）＝${escapeHTML(q.answer.meaning)}。<div>${q.options.map((w,j)=>`${'ABCD'[j]}：${escapeHTML(w.meaning)} 是 ${escapeHTML(w.word)} 的意思。`).join('<br>')}</div></div>`:''}
      </div>`;
    }).join('')}`;
}
function renderPath() {
  const total=Math.ceil(learningVocabulary.length/WORDS_PER_UNIT),words=unitWords();
  const lesson=LESSONS[Math.floor((state.unit-1)/2)%LESSONS.length];
  const reviewed=Math.floor((state.unit-1)/2)>=LESSONS.length;
  const completed=state.completedUnits.size;
  $('#path-summary').innerHTML=`
    <div class="path-stat"><small>目前學習單元</small><strong>${state.unit} / ${total}</strong><p>每單元 10 個字</p><div class="progress-track"><div class="progress-fill" style="width:${Math.round(completed/total*100)}%"></div></div></div>
    <div class="path-stat"><small>已完成</small><strong>${completed} 單元</strong><p>僅儲存在目前瀏覽器</p></div>
    <div class="path-stat"><small>單字總量</small><strong>${learningVocabulary.length.toLocaleString('en-US')} 字</strong><p>常用英文 → 商務多益</p></div>`;
  $('#path-lesson').innerHTML=`<span class="path-eyebrow">📘 ${reviewed?'文法複習':'本單元文法課'}</span><h2>${escapeHTML(lesson.title)}</h2>
    <p>${escapeHTML(lesson.subtitle)}</p>
    <ol class="path-steps"><li>先看這一課的中文文法說明。</li><li>點英文例句旁的播放鍵聽發音。</li><li>手寫簡短筆記並練習題目。</li></ol>
    <div class="lesson-actions"><button type="button" class="primary-button" data-path-grammar="${escapeHTML(lesson.id)}">開始文法課 →</button><button type="button" class="outline-button" data-notes-jump="${escapeHTML(lesson.id)}">抄寫本課筆記</button></div>`;
  $('#path-words').innerHTML=`<span class="path-eyebrow">🧩 本單元 10 個單字</span><h2>先聽、再看、最後回想</h2><p>點單字可進入只有一張字卡的畫面。</p>
    <div class="path-word-list">${words.map((w,i)=>`<div class="path-word"><button type="button" data-focus-unit-word="${i}"><strong>${escapeHTML(w.word)}</strong><small>${escapeHTML(w.meaning)}</small></button>${voiceButton(w.word)}</div>`).join('')}</div>`;
  $('#path-bottom').innerHTML=`<div class="path-actions"><button type="button" class="outline-button" data-unit-nav="prev" ${state.unit===1?'disabled':''}>← 前一單元</button><button type="button" class="outline-button" data-unit-nav="next" ${state.unit===total?'disabled':''}>下一單元 →</button></div>
    <button type="button" class="primary-button" data-unit-nav="done">${state.completedUnits.has(state.unit)?'✓ 已完成本單元，繼續下一個':'✓ 標記已完成並繼續'} →</button>`;
  renderUnitQuiz();
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
  if(e.target.closest('#go-back')){goBack();return;}
  if(e.target.closest('#exit-focus')){if(state.navDepth>0)goBack();else selectPage(state.focusOrigin);return;}
  if(e.target.closest('#start-focus')){openFocus(vocabMatches(),0,'words');return;}
  const focusIndex=e.target.closest('[data-focus-index]');if(focusIndex){openFocus(vocabMatches(),Number(focusIndex.dataset.focusIndex),'words');return;}
  const focusUnit=e.target.closest('[data-focus-unit-word]');if(focusUnit){openFocus(unitWords(),Number(focusUnit.dataset.focusUnitWord),'path');return;}
  const focusNav=e.target.closest('[data-focus-nav]');if(focusNav){const delta=focusNav.dataset.focusNav==='next'?1:-1;state.focusIndex=Math.max(0,Math.min(state.focusWords.length-1,state.focusIndex+delta));state.focusRevealed=false;renderFocus();return;}
  const reveal=e.target.closest('[data-focus-reveal]');if(reveal){state.focusRevealed=reveal.dataset.focusReveal==='1';renderFocus();return;}
  const unitNav=e.target.closest('[data-unit-nav]');if(unitNav){
    if(unitNav.dataset.unitNav==='done')state.completedUnits.add(state.unit);
    if(unitNav.dataset.unitNav==='prev')state.unit=Math.max(1,state.unit-1);
    else state.unit=Math.min(Math.ceil(learningVocabulary.length/WORDS_PER_UNIT),state.unit+1);
    saveProgress();renderPath();return;
  }
  const choose=e.target.closest('[data-unit-choose]');if(choose){
    const [qIndex,option]=choose.dataset.unitChoose.split(':').map(Number),q=getUnitQuiz()[qIndex];
    if(q&&state.unitQuizAnswers[q.id]===undefined){state.unitQuizAnswers[q.id]=option;renderUnitQuiz();}
    return;
  }
  const pathGrammar=e.target.closest('[data-path-grammar]');if(pathGrammar){state.lesson=pathGrammar.dataset.pathGrammar;renderLessons();selectPage('grammar');return;}
  const lessonStep=e.target.closest('[data-lesson-step]');if(lessonStep){const index=LESSONS.findIndex(x=>x.id===state.lesson),shift=lessonStep.dataset.lessonStep==='next'?1:-1;state.lesson=LESSONS[Math.max(0,Math.min(LESSONS.length-1,index+shift))].id;renderLessons();return;}
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
loadProgress();
renderLessons();renderWords(true);renderPractice();renderNotes();renderPath();
const firstPage=window.location.hash.slice(1);
const safePage=PAGES.includes(firstPage)?firstPage:'home';
if(safePage==='focus'){
  state.focusWords=learningVocabulary;
  state.focusIndex=0;
  state.focusOrigin='words';
  renderFocus();
}
window.history.replaceState({toeicPage:safePage,toeicDepth:0},'',`#${safePage}`);
showPage(safePage);
