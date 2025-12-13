/* =========================================
   1. منطق المشهد والتسلق (Logic)
   ========================================= */

function startSequence() {
    // 1. إخفاء الزر
    document.getElementById('start-control').style.display = 'none';
    
    const char = document.getElementById('character');
    const ladderHeight = document.querySelector('.ladder-container').offsetHeight;
    const bulbPos = 120; // المسافة من الأعلى تقريبا
    
    // 2. بدء التسلق (تحريك الشخصية للأعلى + تشغيل الأنيميشن)
    char.classList.add('climbing');
    
    // نحرك الشخصية إلى موضع أسفل اللمبة بقليل
    // نستخدم top لضبط المكان بدقة بالنسبة للسقف
    char.style.bottom = "auto";
    char.style.top = "calc(100vh - 50px)"; // البداية
    
    // الحركة الفعلية (مدة 3.5 ثانية)
    setTimeout(() => {
        char.style.transition = "top 3.5s linear";
        char.style.top = "180px"; // الموضع النهائي (تحت اللمبة)
    }, 50);

    // 3. عند الوصول
    setTimeout(() => {
        char.classList.remove('climbing'); // توقف الأرجل
        pullTheString(); // سحب الخيط
    }, 3600);
}

function pullTheString() {
    const arm = document.getElementById('action-arm');
    const string = document.getElementById('pull-string');
    
    // 1. رفع اليد
    arm.classList.add('reaching-arm');
    
    setTimeout(() => {
        // 2. سحب اليد والخيط للأسفل
        arm.classList.add('pulling-arm');
        string.classList.add('pulled');
        
        // 3. تشغيل النور
        setTimeout(() => {
            toggleLights();
            // إعادة اليد والخيط
            setTimeout(() => {
                arm.classList.remove('pulling-arm', 'reaching-arm');
                string.classList.remove('pulled');
            }, 300);
        }, 200);
    }, 600);
}

function toggleLights() {
    const bulb = document.getElementById('main-bulb');
    const scene = document.getElementById('intro-scene');
    const door = document.getElementById('secret-door');
    
    bulb.classList.add('on');
    scene.classList.add('lit'); // يزيل الظلام
    
    // إظهار الباب السري
    door.classList.remove('hidden');
    setTimeout(() => { door.classList.add('visible'); }, 100);
}

function openDataForm() {
    document.getElementById('data-modal').classList.remove('hidden');
}

/* =========================================
   2. منطق البيانات و JSON
   ========================================= */

function saveData() {
    const name = document.getElementById('inp-name').value;
    const surname = document.getElementById('inp-surname').value;
    const email = document.getElementById('inp-email').value;
    const idea = document.getElementById('inp-idea').value;
    
    if(!name || !surname || !email || !idea) {
        alert("يرجى ملء جميع الحقول");
        return;
    }
    
    // تخزين الاسم للعرض لاحقاً
    localStorage.setItem('studentName', name + ' ' + surname);
    
    // تكوين كائن البيانات
    const userData = {
        firstName: name,
        lastName: surname,
        email: email,
        ideaContent: idea,
        date: new Date().toISOString()
    };
    
    // تحميل ملف JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `idea_${name}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    // الانتقال للمرحلة التالية
    transitionToPsych();
}

function transitionToPsych() {
    // إخفاء المودال
    document.getElementById('data-modal').classList.add('hidden');
    
    // رفع المشهد الأول للأعلى (اختفاء)
    document.getElementById('intro-scene').style.transform = "translateY(-100%)";
    
    // إظهار واجهة الأسئلة بعد لحظة
    setTimeout(() => {
        document.getElementById('psych-ui').classList.remove('hidden');
        loadQuestion();
    }, 800);
}

/* =========================================
   3. منطق الأسئلة النفسية (Logic)
   ========================================= */

const questions = [
    { text: "عندما تدرس، ماهو الوقت المفضل لديك؟", options: [
        {txt:"الصباح الباكر (نشاط)", type:"official"}, {txt:"الليل الهادئ (تركيز)", type:"dark"}, 
        {txt:"بعد الظهر (استرخاء)", type:"calm"}, {txt:"أي وقت (قراءة)", type:"reader"}
    ]},
    { text: "ما الذي يشتت انتباهك أكثر؟", options: [
        {txt:"الفوضى", type:"official"}, {txt:"الضوضاء", type:"dark"}, 
        {txt:"الهاتف", type:"reader"}, {txt:"التوتر", type:"calm"}
    ]},
    { text: "اختر لوناً يريح عينيك الآن:", options: [
        {txt:"أزرق سماوي", type:"official"}, {txt:"أسود/رمادي", type:"dark"}, 
        {txt:"أخضر طبيعي", type:"calm"}, {txt:"أصفر دافئ", type:"reader"}
    ]},
    { text: "ما هو هدفك من دخول المنصة؟", options: [
        {txt:"البحث عن قانون", type:"official"}, {txt:"مراجعة للامتحان", type:"dark"}, 
        {txt:"تصفح بهدوء", type:"calm"}, {txt:"قراءة معمقة", type:"reader"}
    ]},
    { text: "كيف تشعر حالياً؟", options: [
        {txt:"متحمس", type:"official"}, {txt:"جاد", type:"dark"}, 
        {txt:"قلق قليلاً", type:"calm"}, {txt:"فضولي", type:"reader"}
    ]}
];

let qIdx = 0;
let scores = { official:0, dark:0, calm:0, reader:0 };

function loadQuestion() {
    if(qIdx >= questions.length) { finishPsych(); return; }
    
    const q = questions[qIdx];
    
    // تحديث النصوص
    document.getElementById('q-text').innerText = q.text;
    document.getElementById('q-counter').innerText = `0${qIdx+1} / 05`;
    document.getElementById('p-bar').style.width = `${((qIdx+1)/5)*100}%`;
    
    // توليد الخيارات
    const container = document.getElementById('options-area');
    container.innerHTML = '';
    
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt.txt;
        btn.onclick = () => {
            scores[opt.type]++;
            qIdx++;
            // تأثير خروج ودخول ناعم
            document.querySelector('.question-area').style.opacity = 0;
            setTimeout(() => {
                loadQuestion();
                document.querySelector('.question-area').style.opacity = 1;
            }, 300);
        };
        container.appendChild(btn);
    });
}

function finishPsych() {
    // حساب النتيجة
    let bestTheme = Object.keys(scores).reduce((a, b) => scores[a] >= scores[b] ? a : b);
    
    // تطبيق الثيم على الـ Body
    document.body.className = bestTheme;
    document.body.style.overflow = "auto"; // إعادة التمرير
    
    // إخفاء الأسئلة وإظهار المنصة
    document.getElementById('psych-ui').classList.add('hidden');
    document.getElementById('final-platform').classList.remove('hidden');
    
    // إعداد بيانات المنصة
    document.getElementById('final-student-name').innerText = localStorage.getItem('studentName');
    
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = new Date().toLocaleDateString('ar-DZ', dateOpts);
}
