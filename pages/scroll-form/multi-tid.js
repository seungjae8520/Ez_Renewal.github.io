// TID 다중결제 신청 폼 관리
class MultiTidFormManager {
    constructor() {
        this.form = document.getElementById('multiTidForm');
        this.sections = document.querySelectorAll('.form-section');
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.successMessage = document.getElementById('successMessage');
        this.account2TypeInputs = document.querySelectorAll('input[name="account2_type"]');
        this.account1RatioInput = document.getElementById('account1_ratio');
        this.account2RatioInput = document.getElementById('account2_ratio');
        
        this.init();
    }
    
    init() {
        // 스크롤 이벤트 리스너
        this.setupScrollListener();
        
        // 진행 상태 클릭 이벤트
        this.setupProgressClickListener();
        
        // 계좌 유형 변경 처리
        this.setupAccount2TypeListener();
        
        // 비율 자동 계산
        this.setupRatioCalculation();
        
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
        const steps = ['account1', 'account2', 'contact'];
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
    
    setupAccount2TypeListener() {
        this.account2TypeInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateAccount2Fields(input.value);
            });
        });
    }
    
    updateAccount2Fields(type) {
        const businessLabels = document.querySelectorAll('.label-text-business, .text-business');
        const individualLabels = document.querySelectorAll('.label-text-individual, .text-individual');
        const representativeField = document.getElementById('representative_id_field');
        const representativeInput = document.getElementById('id_tid2_representative');
        
        if (type === 'business') {
            // 사업자 계좌인 경우
            businessLabels.forEach(el => el.style.display = 'inline');
            individualLabels.forEach(el => el.style.display = 'none');
            representativeField.style.display = 'block';
            representativeInput.setAttribute('required', '');
        } else {
            // 개인 계좌인 경우
            businessLabels.forEach(el => el.style.display = 'none');
            individualLabels.forEach(el => el.style.display = 'inline');
            representativeField.style.display = 'none';
            representativeInput.removeAttribute('required');
        }
    }
    
    setupRatioCalculation() {
        this.account1RatioInput.addEventListener('input', () => {
            const value = parseInt(this.account1RatioInput.value) || 0;
            
            // 1~99 사이로 제한
            if (value < 1) {
                this.account1RatioInput.value = '';
                this.account2RatioInput.value = '';
                return;
            }
            
            if (value > 99) {
                this.account1RatioInput.value = 99;
            }
            
            // 2번 계좌 비율 자동 계산
            const ratio1 = parseInt(this.account1RatioInput.value);
            this.account2RatioInput.value = 100 - ratio1;
        });
    }
    
    setupFormValidation() {
        // 실시간 유효성 검사
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                const parent = input.closest('.form-field') || input.closest('.terms-section');
                if (parent && parent.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    validateField(field) {
        const parent = field.closest('.form-field') || field.closest('.terms-section');
        
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
        
        // 비율 유효성 검사
        if (field.id === 'account1_ratio' && field.value) {
            const value = parseInt(field.value);
            if (value < 1 || value > 99) {
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
                const firstError = this.form.querySelector('.form-field.error, .terms-section.error');
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
                
                // API 호출 시뮬레이션
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
        const currentAccount2Type = document.querySelector('input[name="account2_type"]:checked').value;
        let isValid = true;
        
        // 보이는 필드만 검사
        const visibleFields = this.form.querySelectorAll('input:not([type="hidden"]), textarea');
        
        visibleFields.forEach(field => {
            // 숨겨진 필드는 건너뛰기
            if (field.id === 'id_tid2_representative' && currentAccount2Type === 'individual') {
                return;
            }
            
            if (field.hasAttribute('required')) {
                if (!this.validateField(field)) {
                    isValid = false;
                }
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
    new MultiTidFormManager();
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