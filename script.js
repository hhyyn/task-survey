// 페이지 로드 시 실행할 코드
document.addEventListener('DOMContentLoaded', function() {
    // 모든 라디오 버튼에 변경 이벤트 추가
    const allRadios = document.querySelectorAll('input[type="radio"]');
    allRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                // 선택된 라디오 버튼에 클릭 효과 추가
                const label = this.nextElementSibling;
                label.style.backgroundColor = '#e2e0f7';
                setTimeout(() => {
                    label.style.backgroundColor = '';
                }, 300);
            }
        });
    });
});

// 폼 제출 이벤트 처리
document.getElementById('surveyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 폼 데이터 수집
    const completionTime = document.querySelector('input[name="completion-time"]:checked').value;
    const serviceInterest = document.querySelector('input[name="service-interest"]:checked').value;
    const contact = document.getElementById('contact').value;
    
    // 로딩 상태 표시
    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = '제출 중...';
    submitBtn.disabled = true;
    
    // 데이터를 서버로 전송
    // 여기서는 Google Apps Script 웹 앱 URL을 사용합니다
    // 실제 사용 시에는 아래 URL을 Google Apps Script 웹 앱 배포 URL로 변경해야 합니다
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxbv3ysNxDj6JqSjHsrK8rkt6R_bM0zAfeHW0T6FhIVhZZimfnTfvc5h-lSiOBkG_l-/exec';
    
    // 현재 시간 정보 추가
    const timestamp = new Date().toISOString();
    
    // 데이터 준비
    const formData = new FormData();
    formData.append('completionTime', completionTime);
    formData.append('serviceInterest', serviceInterest);
    formData.append('contact', contact);
    formData.append('timestamp', timestamp);
    
    // 로컬 스토리지에 임시 저장 (백업)
    const surveyData = {
        completionTime,
        serviceInterest,
        contact,
        timestamp
    };
    
    const existingData = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
    existingData.push(surveyData);
    localStorage.setItem('surveyResponses', JSON.stringify(existingData));
    
    // 데이터 전송 (Google Apps Script 웹 앱으로)
    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Success!', response);
        
        // 제출 완료 처리
        submitBtn.textContent = '제출 완료!';
        
        // 성공 메시지 표시
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = '설문에 참여해주셔서 감사합니다💝<br>입력하신 연락처로 기프티콘이 발송될 예정입니다.';
        
        // 폼 요소들 숨기기
        const formElements = document.querySelectorAll('#surveyForm > *:not(.success-message)');
        formElements.forEach(element => {
            element.style.display = 'none';
        });
        
        // 폼에 성공 메시지 추가
        document.querySelector('.form-container').appendChild(successMessage);
        
        // 콘솔에 데이터 출력 (디버깅용)
        console.log('저장된 설문 데이터:', surveyData);
    })
    .catch(error => {
        console.error('Error!', error.message);
        // 오류 발생 시 로컬 저장 데이터로 성공 메시지 표시 (오프라인 대응)
        submitBtn.textContent = '제출 완료!';
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = '설문에 참여해주셔서 감사합니다💝<br>입력하신 연락처로 기프티콘이 발송될 예정입니다.';
        
        const formElements = document.querySelectorAll('#surveyForm > *:not(.success-message)');
        formElements.forEach(element => {
            element.style.display = 'none';
        });
        
        document.querySelector('.form-container').appendChild(successMessage);
    });
});