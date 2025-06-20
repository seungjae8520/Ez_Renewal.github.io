// 신청 페이지 인터랙션
(function() {
    'use strict';

    const form = document.getElementById('applyForm');
    const modal = document.getElementById('successModal');
    const modalButton = document.querySelector('.modal__button');

    // 폼 제출 처리
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 유효성 검사
            if (!validateForm()) {
                return;
            }
            
            // 폼 데이터 수집
            const formData = new FormData(form);
            
            // 여기서 실제로는 서버로 데이터를 전송합니다
            console.log('Form submitted:', Object.fromEntries(formData));
            
            // 성공 모달 표시
            showModal();
        });
    }

    // 폼 유효성 검사
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        // 서비스 선택 확인
        const services = form.querySelectorAll('input[name="service"]:checked');
        if (services.length === 0) {
            alert('서비스를 하나 이상 선택해주세요.');
            isValid = false;
        }

        return isValid;
    }

    // 모달 표시
    function showModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 모달 닫기
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // 폼 리셋
        form.reset();
        // 홈으로 이동
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 300);
    }

    // 모달 버튼 클릭
    if (modalButton) {
        modalButton.addEventListener('click', closeModal);
    }

    // 모달 외부 클릭으로 닫기
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // 전화번호 자동 포맷팅
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value.length >= 11) {
                value = value.slice(0, 11);
            }
            if (value.length >= 7) {
                value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
            } else if (value.length >= 3) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            }
            e.target.value = value;
        });
    }

    // 사업자등록번호 자동 포맷팅
    const businessNumberInput = document.getElementById('business-number');
    if (businessNumberInput) {
        businessNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value.length >= 10) {
                value = value.slice(0, 10);
            }
            if (value.length >= 6) {
                value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5);
            } else if (value.length >= 3) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            }
            e.target.value = value;
        });
    }

    // 에러 상태 제거
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
})();