// ========================================
// DOM要素の取得
// ========================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderDots = document.getElementById('sliderDots');
const contactForm = document.getElementById('contactForm');
const tabBtns = document.querySelectorAll('.tab-btn');
const projectContents = document.querySelectorAll('.project-content');

// ========================================
// プロジェクトタブ切り替え
// ========================================
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const projectId = btn.dataset.project;
        
        // すべてのタブとコンテンツからactiveクラスを削除
        tabBtns.forEach(tab => tab.classList.remove('active'));
        projectContents.forEach(content => content.classList.remove('active'));
        
        // クリックされたタブと対応するコンテンツにactiveクラスを追加
        btn.classList.add('active');
        document.getElementById(projectId).classList.add('active');
        
        // スライダーをリセット（シフト管理アプリの場合）
        if (projectId === 'shift-app' && slides.length > 0) {
            currentSlide = 0;
            showSlide(0);
        }
    });
});

// ========================================
// ナビゲーション制御
// ========================================

// スクロール時のナビバー背景変更
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// モバイルメニュートグル
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // ハンバーガーアイコンのアニメーション
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ナビリンククリック時の処理
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // モバイルメニューを閉じる
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        
        // スムーズスクロール
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // ナビバーの高さを考慮
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 画像スライダー機能
// ========================================
let currentSlide = 0;
const totalSlides = slides.length;

// ドットインジケーターの生成
function createDots() {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDots.appendChild(dot);
    }
}

// スライド表示
function showSlide(index) {
    // インデックスの範囲チェック
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    
    // すべてのスライドからactiveクラスを削除
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // 現在のスライドにactiveクラスを追加
    slides[currentSlide].classList.add('active');
    
    // ドットの更新
    updateDots();
}

// ドットの更新
function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// 特定のスライドへ移動
function goToSlide(index) {
    showSlide(index);
}

// 次のスライドへ
function nextSlide() {
    showSlide(currentSlide + 1);
}

// 前のスライドへ
function prevSlide() {
    showSlide(currentSlide - 1);
}

// ボタンイベント
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// 自動スライド（5秒ごと）
let autoSlideInterval = setInterval(nextSlide, 5000);

// スライダーにマウスオーバーで自動スライド停止
slider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

slider.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(nextSlide, 5000);
});

// キーボード操作対応
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// スライダー初期化
createDots();

// ========================================
// スクロールアニメーション
// ========================================
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
const animateElements = document.querySelectorAll(
    '.section-header, .about-text, .feature-card, .skill-category, .detail-section, .contact-form, .info-card'
);

animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ========================================
// コンタクトフォーム送信処理
// ========================================
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // フォームデータ取得
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // フォームバリデーション
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showNotification('すべての必須項目を入力してください', 'error');
        return;
    }
    
    // メールアドレスの検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('有効なメールアドレスを入力してください', 'error');
        return;
    }
    
    // 実際のアプリケーションでは、ここでサーバーにデータを送信します
    // 今回はデモなので、ローカルストレージに保存してコンソールに出力
    console.log('フォームデータ:', formData);
    
    // 成功メッセージ表示
    showNotification('お問い合わせありがとうございます！\n内容を確認の上、ご連絡させていただきます。', 'success');
    
    // フォームをリセット
    contactForm.reset();
});

// 通知表示関数
function showNotification(message, type = 'success') {
    // 既存の通知を削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 通知要素を作成
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: 'Noto Sans JP', sans-serif;
        font-size: 1rem;
        font-weight: 600;
        white-space: pre-line;
        max-width: 400px;
        animation: slideInRight 0.4s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // アニメーションスタイルを追加
    if (!document.querySelector('#notification-animation')) {
        const style = document.createElement('style');
        style.id = 'notification-animation';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 3秒後に通知を削除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}

// ========================================
// パフォーマンス最適化：画像の遅延読み込み
// ========================================
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
});

// data-src属性を持つ画像を監視
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ========================================
// スクロールトップボタン（オプション）
// ========================================
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8B5CF6, #10B981);
    color: white;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    z-index: 999;
`;

document.body.appendChild(scrollTopBtn);

// スクロール位置に応じてボタン表示/非表示
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

// ボタンクリックでトップへスクロール
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ボタンホバー効果
scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'translateY(-5px) scale(1.1)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'translateY(0) scale(1)';
});

// ========================================
// 初期化完了メッセージ
// ========================================
console.log('🎨 Portfolio Site Initialized');
console.log('📱 Responsive Design Active');
console.log('✨ Smooth Animations Enabled');
