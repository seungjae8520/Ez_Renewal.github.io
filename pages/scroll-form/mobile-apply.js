// 스크롤 기반 진행 상태 업데이트
class ScrollFormManager {
    constructor() {
        this.form = document.getElementById('mobileTransferForm');
        this.sections = document.querySelectorAll('.form-section');
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.successMessage = document.getElementById('successMessage');
        
        this.init();
    }
    
    init() {
        // 스크롤 이벤트 리스너
        this.setupScrollListener();
        
        // 진행 상태 클릭 이벤트
        this.setupProgressClickListener();
        
        // 폼 유효성 검사
        this.setupFormValidation();
        
        // 파일 업로드 처리
        this.setupFileUpload();
        
        // 폼 제출 처리
        this.setupFormSubmit();
    }
    
    setupScrollListener() {
        let ticking = false;
        
        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // 현재 보이는 섹션 찾기
            let currentSection = null;
            let maxVisibility = 0;
            
            this.sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top;
                const sectionBottom = rect.bottom;
                const sectionHeight = rect.height;
                
                // 섹션의 가시성 계산
                if (sectionTop < windowHeight && sectionBottom > 200) {
                    const visibleHeight = Math.min(sectionBottom, windowHeight) - Math.max(sectionTop, 200);
                    const visibility = visibleHeight / sectionHeight;
                    
                    if (visibility > maxVisibility) {
                        maxVisibility = visibility;
                        currentSection = section;
                    }
                }
            });
            
            // 진행 상태 업데이트
            if (currentSection) {
                const currentStep = currentSection.dataset.section;
                this.updateProgressIndicator(currentStep);
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        });
        
        // 초기 상태 업데이트
        updateProgress();
    }
    
    updateProgressIndicator(currentStep) {
        const steps = ['basic', 'business', 'documents', 'terms'];
        const currentIndex = steps.indexOf(currentStep);
        
        this.progressSteps.forEach((step, index) => {
            const stepName = step.dataset.step;
            const stepIndex = steps.indexOf(stepName);
            
            step.classList.remove('active', 'completed');
            
            if (stepIndex < currentIndex) {
                step.classList.add('completed');
            } else if (stepIndex === currentIndex) {
                step.classList.add('active');
            }
        });
    }
    
    setupProgressClickListener() {
        this.progressSteps.forEach(step => {
            step.addEventListener('click', () => {
                const targetStep = step.dataset.step;
                const targetSection = document.querySelector(`[data-section="${targetStep}"]`);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    setupFormValidation() {
        // 실시간 유효성 검사
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.parentElement.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    validateField(field) {
        const parent = field.closest('.form-field');
        
        if (!parent) return;
        
        let isValid = true;
        
        // 빈 값 체크
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
        }
        
        // 이메일 유효성 검사
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
            }
        }
        
        // 전화번호 유효성 검사
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[0-9-]+$/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
            }
        }
        
        // 체크박스 유효성 검사
        if (field.type === 'checkbox' && field.hasAttribute('required')) {
            isValid = field.checked;
        }
        
        // 에러 표시
        if (isValid) {
            parent.classList.remove('error');
        } else {
            parent.classList.add('error');
        }
        
        return isValid;
    }
    
    setupFileUpload() {
        const fileInputs = document.querySelectorAll('.file-upload__input');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                const parent = input.closest('.file-upload');
                const filename = parent.querySelector('.file-upload__filename');
                
                if (file) {
                    parent.classList.add('has-file');
                    filename.textContent = file.name;
                    
                    // 파일 크기 체크 (5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        alert('파일 크기는 5MB 이하여야 합니다.');
                        input.value = '';
                        parent.classList.remove('has-file');
                        filename.textContent = '';
                    }
                    
                    // 파일 형식 체크
                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                    if (!allowedTypes.includes(file.type)) {
                        alert('JPG, JPEG, PNG 형식의 이미지만 업로드 가능합니다.');
                        input.value = '';
                        parent.classList.remove('has-file');
                        filename.textContent = '';
                    }
                } else {
                    parent.classList.remove('has-file');
                    filename.textContent = '';
                }
                
                // 유효성 검사
                this.validateField(input);
            });
        });
    }
    
    setupFormSubmit() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 전체 유효성 검사
            if (!this.validateForm()) {
                // 첫 번째 에러 필드로 스크롤
                const firstError = this.form.querySelector('.form-field.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // 로딩 상태
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '처리중...';
            submitBtn.disabled = true;
            
            try {
                // FormData 생성
                const formData = new FormData(this.form);
                
                // API 호출 시뮬레이션 (실제로는 백엔드 API 호출)
                await this.simulateApiCall(formData);
                
                // 성공 메시지 표시
                this.showSuccessMessage();
                
            } catch (error) {
                console.error('Form submission error:', error);
                alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
                
                // 버튼 복원
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async simulateApiCall(formData) {
        // 실제 API 호출 시뮬레이션
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data submitted:', Object.fromEntries(formData));
                resolve();
            }, 1500);
        });
    }
    
    showSuccessMessage() {
        this.successMessage.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ScrollFormManager();
});

// 전화번호 자동 포맷팅
document.addEventListener('DOMContentLoaded', () => {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9]/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 7) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                } else if (value.length <= 11) {
                    value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
                } else {
                    value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
                }
            }
            
            e.target.value = value;
        });
    });
});