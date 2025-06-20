// 전역 변수
let currentService = null;
let currentStep = 1;
let currentTerminalType = 'business';

// 뒤로가기 기능
function goBack() {
    if (currentService) {
        // 서비스 선택 화면으로 돌아가기
        currentService = null;
        currentStep = 1;
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('serviceSelection').style.display = 'block';
    } else {
        // 이전 페이지로 돌아가기
        window.history.back();
    }
}

// 서비스 선택
function selectService(service) {
    currentService = service;
    currentStep = 1;
    
    // 모든 섹션 숨기기
    document.getElementById('serviceSelection').style.display = 'none';
    document.getElementById('mobileTransferForm').style.display = 'none';
    document.getElementById('wirelessTerminalForm').style.display = 'none';
    document.getElementById('multiTidForm').style.display = 'none';
    
    // 선택한 서비스 폼 표시
    switch(service) {
        case 'mobile-transfer':
            document.getElementById('mobileTransferForm').style.display = 'block';
            initializeForm('bulletTransferForm');
            break;
        case 'wireless-terminal':
            document.getElementById('wirelessTerminalForm').style.display = 'block';
            initializeForm('businessTerminalForm');
            break;
        case 'multi-tid':
            document.getElementById('multiTidForm').style.display = 'block';
            initializeForm('multiTidFormElement');
            break;
    }
    
    updateProgressIndicator();
}

// 무선 단말기 타입 선택
function selectTerminalType(type) {
    currentTerminalType = type;
    currentStep = 1; // 탭 전환 시 단계 초기화
    
    // 탭 활성화 상태 변경
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 폼 전환
    document.querySelectorAll('.terminal-form-content').forEach(form => {
        form.style.display = 'none';
    });
    
    let formId;
    switch(type) {
        case 'business':
            formId = 'businessTerminalForm';
            break;
        case 'individual':
            formId = 'individualTerminalForm';
            break;
        case 'pg':
            formId = 'pgTerminalForm';
            break;
    }
    
    document.getElementById(formId).style.display = 'block';
    initializeForm(formId);
}

// 폼 초기화
function initializeForm(formId) {
    const form = document.getElementById(formId);
    const sections = form.querySelectorAll('.form-section');
    
    // 첫 번째 섹션만 표시
    sections.forEach((section, index) => {
        section.style.display = index === 0 ? 'block' : 'none';
    });
    
    // 현재 단계를 1로 초기화
    currentStep = 1;
    
    // 진행 상태 업데이트
    updateProgressIndicator();
    
    // 버튼 상태 업데이트
    updateButtons();
}

// 다음 단계
function nextStep() {
    const form = getActiveForm();
    const sections = form.querySelectorAll('.form-section');
    const currentSection = sections[currentStep - 1];
    const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
    
    // 유효성 검사
    let isValid = true;
    let errorMessages = [];
    
    inputs.forEach(input => {
        // 전화번호 필드인 경우 하이픈 제거 후 검사
        if (input.type === 'tel') {
            const cleanValue = input.value.replace(/-/g, '');
            if (!cleanValue) {
                input.classList.add('error');
                isValid = false;
                if (input.name === 'phone') {
                    errorMessages.push('연락처를 입력해주세요.');
                }
            } else if (cleanValue.length < 10 || cleanValue.length > 11) {
                input.classList.add('error');
                isValid = false;
                if (input.name === 'phone') {
                    errorMessages.push('올바른 형식의 연락처를 입력해주세요.');
                }
            } else {
                input.classList.remove('error');
            }
        } else if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
            
            // 필드별 에러 메시지
            const label = currentSection.querySelector(`label[for="${input.id}"]`);
            if (label) {
                errorMessages.push(label.textContent + '를(을) 입력해주세요.');
            }
        } else {
            input.classList.remove('error');
        }
    });
    
    if (!isValid) {
        if (errorMessages.length > 0) {
            alert(errorMessages.join('\n'));
        } else {
            alert('필수 항목을 모두 입력해주세요.');
        }
        return;
    }
    
    // 다음 단계로
    if (currentStep < sections.length) {
        currentSection.style.display = 'none';
        currentStep++;
        sections[currentStep - 1].style.display = 'block';
        updateProgressIndicator();
        updateButtons();
        
        // 상단으로 스크롤 (진행 상태 표시가 보이도록)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 이전 단계
function previousStep() {
    const form = getActiveForm();
    const sections = form.querySelectorAll('.form-section');
    
    if (currentStep > 1) {
        sections[currentStep - 1].style.display = 'none';
        currentStep--;
        sections[currentStep - 1].style.display = 'block';
        updateProgressIndicator();
        updateButtons();
        
        // 상단으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 진행 상태 업데이트
function updateProgressIndicator() {
    let steps;
    
    // 현재 활성화된 서비스에 따라 진행 상태 표시기 찾기
    if (currentService === 'mobile-transfer') {
        steps = document.querySelector('#mobileTransferForm .progress-indicator').querySelectorAll('.progress-step');
    } else if (currentService === 'wireless-terminal') {
        // 현재 활성화된 탭의 폼에서 진행 상태 찾기
        const activeForm = document.querySelector('.terminal-form-content[style*="block"]');
        if (activeForm) {
            steps = activeForm.querySelector('.progress-indicator').querySelectorAll('.progress-step');
        }
    } else if (currentService === 'multi-tid') {
        steps = document.querySelector('#multiTidForm .progress-indicator').querySelectorAll('.progress-step');
    }
    
    if (steps) {
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
            }
        });
    }
}

// 버튼 상태 업데이트
function updateButtons() {
    const form = getActiveForm();
    const sections = form.querySelectorAll('.form-section');
    const prevBtn = form.querySelector('button[onclick="previousStep()"]');
    const nextBtn = form.querySelector('button[onclick="nextStep()"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // 이전 버튼
    if (prevBtn) {
        prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    }
    
    // 다음/제출 버튼
    if (currentStep === sections.length) {
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'block';
    } else {
        if (nextBtn) nextBtn.style.display = 'block';
        if (submitBtn) submitBtn.style.display = 'none';
    }
}

// 활성 폼 가져오기
function getActiveForm() {
    if (currentService === 'mobile-transfer') {
        return document.getElementById('bulletTransferForm');
    } else if (currentService === 'wireless-terminal') {
        if (currentTerminalType === 'business') {
            return document.getElementById('businessTerminalForm');
        } else if (currentTerminalType === 'individual') {
            return document.getElementById('individualTerminalForm');
        } else {
            return document.getElementById('pgTerminalForm');
        }
    } else if (currentService === 'multi-tid') {
        return document.getElementById('multiTidFormElement');
    }
}

// 파일 업로드 처리
function handleFileUpload(input) {
    const fileUpload = input.closest('.file-upload');
    const label = fileUpload.querySelector('.file-upload__label');
    const text = label.querySelector('.file-upload__text');
    
    if (input.files && input.files[0]) {
        const fileName = input.files[0].name;
        text.textContent = fileName;
        fileUpload.classList.add('file-upload--uploaded');
    }
}

// 폼 제출 처리
document.addEventListener('DOMContentLoaded', function() {
    // 모든 폼에 제출 이벤트 리스너 추가
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // 전화번호 입력 자동 포맷팅
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', formatPhoneNumber);
    });
    
    // placeholder 업데이트
    updatePhonePlaceholders();
});

// 전화번호 포맷팅
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // 숫자만 남긴 후 길이 체크
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    // 포맷팅 적용
    if (value.length >= 7) {
        if (value.startsWith('02')) {
            // 서울 지역번호
            value = value.slice(0, 2) + '-' + value.slice(2, 6) + '-' + value.slice(6, 10);
        } else if (value.length === 10) {
            // 10자리 전화번호 (031-123-4567)
            value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
        } else {
            // 11자리 휴대폰 번호 (010-1234-5678)
            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }
    } else if (value.length >= 3) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    }
    
    e.target.value = value;
}

// placeholder 수정
function updatePhonePlaceholders() {
    // placeholder는 하이픈 포함 형태로 유지
}

// 폼 제출 처리
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // 전화번호 필드에서 하이픈 제거
    const phoneInputs = form.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        if (input.value) {
            const cleanValue = input.value.replace(/-/g, '');
            formData.set(input.name, cleanValue);
        }
    });
    
    // 로딩 표시
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> 처리중...';
    
    try {
        // API 엔드포인트는 기존 백엔드와 동일하게 사용
        const response = await fetch('/api/submit_application.php', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            // 성공 메시지 표시
            showSuccessMessage();
        } else {
            throw new Error('신청 처리 중 오류가 발생했습니다.');
        }
    } catch (error) {
        alert(error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// 성공 메시지 표시
function showSuccessMessage() {
    // 모든 섹션 숨기기
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // 성공 메시지 표시
    document.getElementById('successMessage').style.display = 'block';
    
    // 스크롤 상단으로
    window.scrollTo(0, 0);
}

// CSS 에러 클래스 스타일 추가
const style = document.createElement('style');
style.textContent = `
    .form-field__input.error {
        border-color: var(--color-red);
    }
    .form-field__input.error:focus {
        box-shadow: 0 0 0 3px rgba(255, 82, 82, 0.1);
    }
`;
document.head.appendChild(style);
