# 이지웍스 홈페이지 리뉴얼 프로젝트

## 프로젝트 개요

토스의 디자인 철학 "Simple but Powerful"를 적용하여 이지웍스 홈페이지를 전면 리뉴얼한 프로젝트입니다.

### 핵심 디자인 원칙

1. **극도의 단순화**: 불필요한 시각적 요소를 모두 제거
2. **명확한 정보 위계**: 3단계 이내의 텍스트 계층 구조
3. **직관적 네비게이션**: 서비스별 독립적인 페이지 구조
4. **모바일 최적화**: 터치 인터페이스에 최적화된 UI

## 프로젝트 구조

```
ezworks_renewal/
├── index.html          # 메인 페이지
├── css/
│   ├── reset.css      # CSS 리셋
│   ├── main.css       # 메인 스타일
│   ├── apply.css      # 신청 페이지 스타일
│   └── service.css    # 서비스 페이지 스타일
├── js/
│   ├── main.js        # 메인 JavaScript
│   └── apply.js       # 신청 페이지 JavaScript
├── pages/
│   ├── apply.html           # 신청하기
│   ├── mobile-transfer.html # 모바일 송금
│   ├── wireless-terminal.html # 무선 단말기
│   └── multi-tid.html       # TID 다중 결제
└── images/             # 이미지 파일들
```

## 주요 특징

### 1. 미니멀 디자인 시스템

- **색상**: 흑백 중심 + 최소한의 액센트 색상
- **타이포그래피**: 시스템 폰트 사용으로 로딩 속도 개선
- **여백**: 일관된 8px 그리드 시스템
- **애니메이션**: 0.2초 이내의 빠른 전환 효과만 사용

### 2. 개선된 사용자 경험

- **빠른 로딩**: 불필요한 리소스 제거로 성능 최적화
- **명확한 CTA**: 단일 액션 버튼으로 사용자 행동 유도
- **간편한 폼**: 필수 정보만 수집하는 간소화된 신청서

### 3. 확장 가능한 구조

- 서비스 스위처를 통한 멀티 서비스 확장 준비
- 컴포넌트 기반 CSS 구조
- 모듈화된 JavaScript

## 기술 스택

- HTML5 (시맨틱 마크업)
- CSS3 (CSS 변수, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- 반응형 디자인 (Mobile First)

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)
- Mobile Safari
- Chrome for Android

## 성능 최적화

- 이미지 최적화 필요
- Critical CSS 인라인 처리 권장
- JavaScript 번들링 고려
- CDN 활용 권장

## 향후 개선사항

1. 이미지 최적화 (WebP 포맷 지원)
2. PWA 적용
3. 다크모드 지원
4. A/B 테스트 환경 구축
5. 분석 도구 연동

## 라이선스

Copyright © 2025 이지웍스. All rights reserved.