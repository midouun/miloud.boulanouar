// --- 1. نظام التحليل النفسي (Psychographic Onboarding) ---
const questions = [
    {
        text: "لو كان بإمكانك اختيار مكان للدراسة الآن، أين ستجلس؟",
        options: [
            { text: "مكتبة الجامعة (رسمي)", score: "official" },
            { text: "غرفة مظلمة وهادئة", score: "dark" },
            { text: "حديقة طبيعية", score: "calm" },
            { text: "مقهى كلاسيكي دافئ", score: "reader" }
        ]
    },
    {
        text: "ماهو الصوت الذي يساعدك على التركيز حالياً؟",
        options: [
            { text: "صوت عقارب الساعة", score: "official" },
            { text: "الصمت التام", score: "dark" },
            { text: "صوت المطر/الطبيعة", score: "calm" },
            { text: "موسيقى هادئة", score: "reader" }
        ]
    },
    {
        text: "كيف تصف حالة ذهنك في هذه اللحظة؟",
        options: [
            { text: "عملي ومستعد", score: "official" },
            { text: "أحتاج للتركيز الشديد", score: "dark" },
            { text: "متوتر قليلاً", score: "calm" },
            { text: "متأمل وعميق", score: "reader" }
        ]
    },
    {
        text: "ماذا يوجد أمامك الآن بالإضافة للجهاز؟",
        options: [
            { text: "أوراق رسمية", score: "official" },
            { text: "لا شيء، الظلام فقط", score: "dark" },
            { text: "نبتة خضراء", score: "calm" },
            { text: "كوب قهوة وكتاب", score: "reader" }
        ]
    },
    {
        text: "كيف تريد أن تشعر بعد الانتهاء؟",
        options: [
            { text: "بالإنجاز والدقة", score: "official" },
            { text: "براحة العين", score: "dark" },
            { text: "بالهدوء والطمأنينة", score: "calm" },
            { text: "بالاستيعاب العميق", score: "reader" }
        ]
    }
];

let currentQIndex = 0;
let scores = { official: 0, dark: 0, calm: 0, reader: 0 };

function loadQuestion() {
    const q = questions[currentQIndex];
    document.getElementById('q-text').innerText = q.text;
    const optionsDiv = document.getElementById('q-options');
    optionsDiv.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        btn.onclick = () => handleAnswer(opt.score);
        optionsDiv.appendChild(btn);
    });

    // تحديث شريط التقدم
    document.getElementById('progress-bar').style.width = `${((currentQIndex) / questions.length) * 100}%`;
}

function handleAnswer(scoreType) {
    scores[scoreType]++;
    currentQIndex++;

    if (currentQIndex < questions.length) {
        loadQuestion();
    } else {
        document.getElementById('progress-bar').style.width = '100%';
        finishOnboarding();
    }
}

function finishOnboarding() {
    // تحديد النمط الفائز
    let bestTheme = Object.keys(scores).reduce((a, b) => scores[a] >= scores[b] ? a : b);
    
    // تطبيق النمط (Theme)
    document.body.className = `theme-${bestTheme}`;
    
    // إخفاء الشاشة
    const overlay = document.getElementById('psych-onboarding');
    overlay.classList.add('hidden-overlay');
    
    // رسالة ترحيب في الكونسول
    console.log(`User Theme Selected: ${bestTheme}`);
}


// --- 2. وظائف المنصة العامة ---

function displayDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    document.getElementById('currentDate').innerText = today.toLocaleDateString('ar-DZ', options);
}

function openSection(sectionId) {
    const titles = {
        'lectures': 'قسم المحاضرات والدروس',
        'laws': 'قسم النصوص والمواد القانونية',
        'exams': 'بنك الامتحانات السابقة',
        'methodology': 'ركن المنهجية والبحث العلمي'
    };

    const contentArea = document.getElementById('content-area');
    const titleEl = document.getElementById('section-title');
    const grid = document.querySelector('.grid-menu');
    const search = document.querySelector('.search-section');

    grid.classList.add('hidden');
    search.classList.add('hidden');
    contentArea.classList.remove('hidden');
    
    titleEl.innerText = titles[sectionId];
}

function closeSection() {
    const contentArea = document.getElementById('content-area');
    const grid = document.querySelector('.grid-menu');
    const search = document.querySelector('.search-section');

    contentArea.classList.add('hidden');
    grid.classList.remove('hidden');
    search.classList.remove('hidden');
}

// التشغيل الأولي
window.addEventListener('DOMContentLoaded', () => {
    loadQuestion(); // بدء الأسئلة
    displayDate();  // عرض التاريخ
});
