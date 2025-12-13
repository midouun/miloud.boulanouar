// --- الجزء 1: منطق المشهد التفاعلي (السلم واللمبة) ---

function startClimbing() {
    // إخفاء زر البدء
    document.getElementById('start-climb-btn').classList.add('hidden');
    
    const climber = document.getElementById('climber');
    climber.classList.add('climbing-anim'); // إضافة حركة الاهتزاز
    
    // تحريك الشخصية للأعلى (CSS Transition)
    // حساب ارتفاع السلم تقريباً للوصول للمبة
    climber.style.bottom = "85%"; 
    
    // الانتظار حتى يصل (3 ثواني حسب الـ CSS)
    setTimeout(() => {
        climber.classList.remove('climbing-anim'); // توقف الاهتزاز
        turnOnLight();
    }, 3000);
}

function turnOnLight() {
    const bulb = document.getElementById('main-bulb');
    bulb.classList.add('on');
    
    // تشغيل صوت "تكه" (اختياري)
    // فتح الباب السري (إظهار زر الفكرة)
    setTimeout(() => {
        document.getElementById('idea-section').classList.remove('hidden');
    }, 500);
}

function openIdeaForm() {
    document.getElementById('data-modal').classList.remove('hidden');
}

// --- الجزء 2: إدارة الاستمارة و JSON ---

let userData = {};

function goToStep2() {
    const name = document.getElementById('user-name').value;
    const surname = document.getElementById('user-surname').value;
    const email = document.getElementById('user-email').value;

    if(name && surname && email) {
        userData = { name, surname, email };
        document.getElementById('step-1').classList.add('hidden');
        document.getElementById('step-2').classList.remove('hidden');
    } else {
        alert("يرجى ملء جميع الحقول");
    }
}

function saveAndProceed() {
    const idea = document.getElementById('user-idea').value;
    if(!idea) { alert("من فضلك اكتب فكرتك"); return; }
    
    userData.idea = idea;
    userData.timestamp = new Date().toISOString();

    // 1. إنشاء ملف JSON وتحميله
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `idea_${userData.name}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    // 2. الانتقال للمرحلة التالية (الأسئلة النفسية)
    document.getElementById('data-modal').classList.add('hidden');
    
    // إزالة مشهد المقدمة بتأثير اختفاء
    const intro = document.getElementById('intro-scene');
    intro.style.transform = "translateY(-100%)"; // يرتفع للأعلى
    
    // تحديث اسم الطالب في المنصة
    document.getElementById('display-name').innerText = userData.name + ' ' + userData.surname;

    // بدء الأسئلة بعد ثانية
    setTimeout(() => {
        document.getElementById('psych-onboarding').classList.remove('hidden');
        loadQuestion(); // دالة من الكود السابق
    }, 1000);
}

// --- الجزء 3: نظام التحليل النفسي (الذي صممناه سابقاً) ---
// (هنا نضع نفس كود الأسئلة السابق مع تعديل بسيط في النهاية لإظهار المنصة)

const questions = [
    { text: "أين تفضل الدراسة؟", options: [{text:"مكتبة", score:"official"}, {text:"غرفة مظلمة", score:"dark"}] },
    { text: "الصوت المفضل؟", options: [{text:"سكون", score:"dark"}, {text:"مطر", score:"calm"}] },
    { text: "حالتك الذهنية؟", options: [{text:"تركيز", score:"official"}, {text:"استرخاء", score:"calm"}] },
    { text: "اللون المريح لك؟", options: [{text:"أزرق", score:"official"}, {text:"أصفر قديم", score:"reader"}] },
    { text: "هدفك اليوم؟", options: [{text:"حفظ", score:"dark"}, {text:"فهم", score:"reader"}] }
];
// (اختصرت الأسئلة هنا، استخدم القائمة الكاملة من الرد السابق)

let qIndex = 0;
let scores = { official: 0, dark: 0, calm: 0, reader: 0 };

function loadQuestion() {
    if(qIndex >= questions.length) { finishPsych(); return; }
    const q = questions[qIndex];
    document.getElementById('q-text').innerText = q.text;
    const div = document.getElementById('q-options');
    div.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn'; 
        btn.innerText = opt.text;
        // تنسيق بسيط للأزرار بالجافاسكريبت أو CSS
        btn.style.margin = "5px"; btn.style.padding = "10px";
        btn.onclick = () => { scores[opt.score]++; qIndex++; loadQuestion(); };
        div.appendChild(btn);
    });
}

function finishPsych() {
    // تحديد النمط وتطبيقه
    let best = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    document.body.className = `theme-${best}`; // تأكد أن لديك الـ CSS لهذه الفئات
    
    // إخفاء الأسئلة وإظهار المنصة النهائية
    document.getElementById('psych-onboarding').classList.add('hidden');
    document.getElementById('main-header').classList.remove('hidden');
    document.getElementById('main-platform').classList.remove('hidden');
}
