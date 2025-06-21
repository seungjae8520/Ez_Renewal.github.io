// 무선 단말기 신청 폼 관리
class WirelessTerminalFormManager {
    constructor() {
        this.form = document.getElementById('wirelessTerminalForm');
        this.sections = document.querySelectorAll('.form-section');
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.successMessage = document.getElementById('successMessage');
        this.terminalTypeInputs = document.querySelectorAll('input[name="terminalType"]');
        
        this.init();
    }
    
    init() {
        // 스크롤 이벤트 리스너
        this.setupScrollListener();
        
        // 진행 상태 클릭 이벤트
        this.setupProgressClickListener();
        
        // 신청 유형 변경 처리
        this.setupTerminalTypeListener();
        
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
        const steps = ['type', 'documents', 'basic', 'additional'];
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
    
    setupTerminalTypeListener() {
        this.terminalTypeInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateFormFields(input.value);
            });
        });
        
        // 초기 상태 설정
        const checkedType = document.querySelector('input[name="terminalType"]:checked');
        if (checkedType) {
            this.updateFormFields(checkedType.value);
        }
    }
    
    updateFormFields(type) {
        // 서류 섹션 업데이트
        const documentGroups = document.querySelectorAll('.document-group');
        documentGroups.forEach(group => {
            const groupTypes = group.dataset.type.split(',');
            if (groupTypes.includes(type)) {
                group.style.display = 'block';
                // 필수 필드 설정
                group.querySelectorAll('input[type="file"]').forEach(input => {
                    if (type === 'business' && input.id === 'biz_license') {
                        input.setAttribute('required', '');
                    } else if (input.id !== 'food_license') {
                        input.removeAttribute('required');
                    }
                });
            } else {
                group.style.display = 'none';
                // 숨겨진 필드는 필수 해제
                group.querySelectorAll('input[type="file"]').forEach(input => {
                    input.removeAttribute('required');
                });
            }
        });
        
        // 라벨 텍스트 업데이트
        const businessLabels = document.querySelectorAll('.label-text-business, .text-business');
        const individualLabels = document.querySelectorAll('.label-text-individual, .text-individual');
        const pgLabels = document.querySelectorAll('.label-text-pg, .text-pg');
        
        // 모든 라벨 숨기기
        businessLabels.forEach(el => el.style.display = 'none');
        individualLabels.forEach(el => el.style.display = 'none');
        pgLabels.forEach(el => el.style.display = 'none');
        
        // 선택된 유형의 라벨만 표시
        if (type === 'business') {
            businessLabels.forEach(el => el.style.display = 'inline');
        } else if (type === 'individual') {
            individualLabels.forEach(el => el.style.display = 'inline');
        } else if (type === 'pg') {
            pgLabels.forEach(el => el.style.display = 'inline');
        }
        
        // 이름 필드 표시/숨김 처리
        const nameField = document.getElementById('name-field');
        const nameInput = document.getElementById('name');
        if (type === 'individual' || type === 'pg') {
            nameField.style.display = 'block';
            nameInput.setAttribute('required', '');
        } else {
            nameField.style.display = 'none';
            nameInput.removeAttribute('required');
        }
        
        // 추가 정보 섹션 업데이트
        const additionalGroups = document.querySelectorAll('.additional-group');
        additionalGroups.forEach(group => {
            const groupTypes = group.dataset.type.split(',');
            if (groupTypes.includes(type)) {
                group.style.display = 'block';
                // PG인 경우 서비스 설명 필수
                if (type === 'pg') {
                    const serviceDesc = group.querySelector('#service_description');
                    if (serviceDesc) {
                        serviceDesc.setAttribute('required', '');
                    }
                }
            } else {
                group.style.display = 'none';
                // 숨겨진 필드는 필수 해제
                group.querySelectorAll('[required]').forEach(field => {
                    if (field.id !== 'terms_agree') {
                        field.removeAttribute('required');
                    }
                });
            }
        });
        
        // 주소 필드 필수 설정
        const addressField = document.getElementById('address_main');
        if (type === 'individual' || type === 'business') {
            addressField.setAttribute('required', '');
        } else {
            addressField.removeAttribute('required');
        }
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
        
        // URL 유효성 검사
        if (field.type === 'url' && field.value) {
            try {
                new URL(field.value);
            } catch {
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
        const currentType = document.querySelector('input[name="terminalType"]:checked').value;
        let isValid = true;
        
        // 보이는 필드만 검사
        const visibleFields = this.form.querySelectorAll('input:not([type="hidden"]), textarea, select');
        
        visibleFields.forEach(field => {
            // 숨겨진 섹션의 필드는 건너뛰기
            const section = field.closest('.document-group, .additional-group');
            if (section && section.style.display === 'none') {
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
    new WirelessTerminalFormManager();
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