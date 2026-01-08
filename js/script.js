// ====================================
// DOM要素の取得
// ====================================
const searchBtn = document.getElementById('searchBtn');
const searchResult = document.getElementById('searchResult');
const birthdateInput = document.getElementById('birthdate');
const gradeSelect = document.getElementById('grade');
const dayCheckboxes = document.querySelectorAll('input[name="day"]');
const faqItems = document.querySelectorAll('.faq-item');
const scrollTopBtn = document.getElementById('scrollTop');

// ====================================
// 検索機能
// ====================================
searchBtn.addEventListener('click', function() {
    // バリデーション
    if (!birthdateInput.value) {
        alert('生年月日を入力してください');
        birthdateInput.focus();
        return;
    }

    if (!gradeSelect.value) {
        alert('学年を選択してください');
        gradeSelect.focus();
        return;
    }

    const selectedDays = Array.from(dayCheckboxes).filter(cb => cb.checked);
    if (selectedDays.length === 0) {
        alert('通いたい曜日を選択してください');
        return;
    }

    // 検索処理(実際のロジックは実装側で追加)
    performSearch();
});

function performSearch() {
    const birthdate = new Date(birthdateInput.value);
    const today = new Date();
    const age = Math.floor((today - birthdate) / (365.25 * 24 * 60 * 60 * 1000));
    const grade = gradeSelect.value;
    const selectedDays = Array.from(dayCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // 曜日の日本語変換
    const dayNames = {
        'mon': '月曜日',
        'tue': '火曜日',
        'wed': '水曜日',
        'thu': '木曜日',
        'fri': '金曜日',
        'sat': '土曜日',
        'sun': '日曜日'
    };

    const selectedDayNames = selectedDays.map(day => dayNames[day]).join('、');

    // 簡易的な判定ロジック(実際は条件に応じて判定)
    let canJoin = true;
    let message = '';

    // 年齢チェック(生後6ヶ月未満の場合)
    if (age < 0.5) {
        canJoin = false;
        message = '申し訳ございません。生後6ヶ月からのご参加となります。';
    } 
    // ランダムで80%の確率で通える設定(デモ用)
    else if (Math.random() > 0.2) {
        canJoin = true;
        message = `${selectedDayNames}のクラスにご参加いただけます!<br>お選びいただいた曜日でレッスンを受講できます。`;
    } else {
        canJoin = false;
        message = `申し訳ございません。現在${selectedDayNames}のクラスは満席となっております。<br>他の曜日または別の時間帯をご検討いただくか、直接お問い合わせください。`;
    }

    // 結果表示
    displaySearchResult(canJoin, message);
}

function displaySearchResult(canJoin, message) {
    const resultContent = searchResult.querySelector('.result-content');
    const resultIcon = searchResult.querySelector('.result-icon');
    const resultTitle = searchResult.querySelector('.result-title');
    const resultDescription = searchResult.querySelector('.result-description');

    // スタイルのリセット
    searchResult.classList.remove('success', 'warning');

    if (canJoin) {
        // 通える場合
        searchResult.classList.add('success');
        resultIcon.innerHTML = '<i class="fas fa-check-circle" style="color: #4caf50;"></i>';
        resultTitle.textContent = 'おめでとうございます!';
        resultTitle.style.color = '#4caf50';
        resultDescription.innerHTML = message;
    } else {
        // 通えない場合
        searchResult.classList.add('warning');
        resultIcon.innerHTML = '<i class="fas fa-exclamation-circle" style="color: #ff9800;"></i>';
        resultTitle.textContent = 'お問い合わせください';
        resultTitle.style.color = '#ff9800';
        resultDescription.innerHTML = message;
    }

    // 結果を表示
    searchResult.style.display = 'block';

    // スムーススクロール
    setTimeout(() => {
        searchResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// ====================================
// FAQ アコーディオン
// ====================================
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // 他のアイテムを閉じる
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // クリックされたアイテムをトグル
        item.classList.toggle('active');
    });
});

// ====================================
// スクロールトップボタン
// ====================================
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ====================================
// スムーススクロール(アンカーリンク)
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // #のみの場合はスキップ
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ====================================
// スクロールアニメーション
// ====================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// アニメーション対象要素
const animateElements = document.querySelectorAll(`
    .overview-card,
    .feature-item,
    .flow-item,
    .faq-item,
    .contact-card,
    .school-card
`);

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ====================================
// ヘッダーのスクロール時の変化
// ====================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.padding = '10px 0';
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.padding = '15px 0';
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ====================================
// 入力フォームのバリデーション表示
// ====================================
birthdateInput.addEventListener('change', function() {
    const birthdate = new Date(this.value);
    const today = new Date();
    const age = Math.floor((today - birthdate) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (age < 0.5) {
        this.style.borderColor = '#f44336';
        showValidationMessage(this, '生後6ヶ月からのご参加となります');
    } else {
        this.style.borderColor = '#4caf50';
        removeValidationMessage(this);
    }
});

gradeSelect.addEventListener('change', function() {
    if (this.value) {
        this.style.borderColor = '#4caf50';
        removeValidationMessage(this);
    } else {
        this.style.borderColor = '#f44336';
    }
});

dayCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const selectedDays = Array.from(dayCheckboxes).filter(cb => cb.checked);
        const checkboxGroup = this.closest('.checkbox-group');
        
        if (selectedDays.length > 0) {
            removeValidationMessage(checkboxGroup);
        }
    });
});

function showValidationMessage(element, message) {
    removeValidationMessage(element);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'validation-message';
    messageDiv.textContent = message;
    messageDiv.style.color = '#f44336';
    messageDiv.style.fontSize = '0.9rem';
    messageDiv.style.marginTop = '5px';
    
    element.parentElement.appendChild(messageDiv);
}

function removeValidationMessage(element) {
    const parent = element.parentElement || element;
    const existingMessage = parent.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// ====================================
// 数字カウントアップアニメーション
// ====================================
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ====================================
// ページ読み込み時の初期化
// ====================================
window.addEventListener('DOMContentLoaded', () => {
    // ヒーローセクションのアニメーション
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease';
    }
    
    // 今日の日付を最大値として設定(未来の日付を選択できないように)
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    birthdateInput.setAttribute('max', maxDate);
    
    // 最小日付を設定(例: 20年前まで)
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 20);
    birthdateInput.setAttribute('min', minDate.toISOString().split('T')[0]);
    
    console.log('スイミングスクール おためし教室LP - 読み込み完了');
});

// ====================================
// パフォーマンス最適化: 画像遅延読み込み
// ====================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ====================================
// ユーティリティ関数
// ====================================

// デバウンス関数(パフォーマンス向上)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// スロットル関数(パフォーマンス向上)
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 要素が表示範囲にあるかチェック
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ====================================
// エラーハンドリング
// ====================================
window.addEventListener('error', (e) => {
    console.error('エラーが発生しました:', e.error);
});

// ====================================
// モバイルメニューの対応(将来的な拡張用)
// ====================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        const nav = document.querySelector('.nav');
        nav.classList.toggle('active');
    });
}

// ====================================
// コンソールメッセージ
// ====================================
console.log('%c🏊 スイミングスクール おためし教室LP', 'color: #00a0e9; font-size: 20px; font-weight: bold;');
console.log('%c1ヶ月4,400円で安心スタート!', 'color: #ff9800; font-size: 14px;');
console.log('%cWebサイト制作に関するお問い合わせは各スクールまで', 'color: #666; font-size: 12px;');
