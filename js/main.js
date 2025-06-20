// 토스 스타일 미니멀 인터랙션
(function() {
    'use strict';

    // DOM 요소
    const moreServicesCard = document.querySelector('.more-services-card');
    const serviceSwitcher = document.querySelector('.service-switcher');
    const switcherClose = document.querySelector('.service-switcher__close');
    const switcherOverlay = document.querySelector('.service-switcher__overlay');
    const serviceCards = document.querySelectorAll('.service-card');

    // 서비스 스위처 토글
    function toggleServiceSwitcher() {
        serviceSwitcher.classList.toggle('active');
        document.body.style.overflow = serviceSwitcher.classList.contains('active') ? 'hidden' : '';
    }

    // 서비스 카드 클릭 처리
    serviceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 화살표 링크 클릭 시에는 바로 페이지 이동
            if (e.target.closest('.service-card__link')) {
                return;
            }
            
            // 카드가 이미 활성화되어 있으면 페이지로 이동
            if (this.classList.contains('active')) {
                const link = this.querySelector('.service-card__link');
                if (link) {
                    window.location.href = link.href;
                }
            } else {
                // 다른 카드들의 active 클래스 제거
                serviceCards.forEach(c => c.classList.remove('active'));
                // 현재 카드에 active 클래스 추가
                this.classList.add('active');
            }
        });
    });

    // 이벤트 리스너
    if (moreServicesCard) {
        moreServicesCard.addEventListener('click', toggleServiceSwitcher);
    }

    if (switcherClose) {
        switcherClose.addEventListener('click', toggleServiceSwitcher);
    }

    if (switcherOverlay) {
        switcherOverlay.addEventListener('click', toggleServiceSwitcher);
    }

    // ESC 키로 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && serviceSwitcher.classList.contains('active')) {
            toggleServiceSwitcher();
        }
    });

    // 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 페이지 로드 애니메이션
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
})();