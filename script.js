// عرض التاريخ الحالي
function displayDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    document.getElementById('currentDate').innerText = today.toLocaleDateString('ar-DZ', options);
}

// فتح الأقسام
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

    // إخفاء الشبكة وإظهار المحتوى
    grid.classList.add('hidden');
    contentArea.classList.remove('hidden');
    
    // تغيير العنوان
    titleEl.innerText = titles[sectionId];
}

// إغلاق القسم والعودة للقائمة
function closeSection() {
    const contentArea = document.getElementById('content-area');
    const grid = document.querySelector('.grid-menu');

    contentArea.classList.add('hidden');
    grid.classList.remove('hidden');
}

// تشغيل عند التحميل
window.onload = displayDate;
