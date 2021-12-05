
# 멍하냥 이커머스 플랫폼

### 프로젝트 협업 멤버

- 강래현
- 전준호
- 최상철
- 황길성



## 프로젝트 컨셉

   고양이와 강아지를 반려동물로 키우는 사람들을 대상으로 만든 사이트로,  커뮤니티 및 쇼핑몰을 만들어 정보공유와 물품구매 서비스를 제공한다.  간단한 문의는 'AI챗봇'과 '채팅'시스템에서 1차적으로 처리할 수 있도록 하여  유저와 서비스제공자 모두가 사이트를 빠르고 효율적으로 사용할 수 있게 한다. 



## 프로젝트 주요기능

- 로그인 - 마이페이지, 프로필 설정, JWT토큰
- 회원가입 - 비밀번호 암호화, SNS 계정 로그인  
- 팔로우 언팔로우
- 커뮤니티 CRUD(create, read, update, delete) - 썸머노트 API사용으로 여러 이미지 업로드 가능
- 댓글 대댓글
- 좋아요 추천 기능
- 해쉬태그 기능
- 장바구니 수량 변경 및 체크상태에 따라 즉각 적용해서 합계를 계산
- 아임포트 결제 API 사용
- 네이버 AI 챗봇 - 이미지, 버튼, 답변 기능 사용
- 웹소켓으로 실시간 1대1 채팅 구현
- 관리자 페이지 - 유저의 문의글에 대한 답글



## 개발환경

 **Installation**

- SpringToolSuite4 - 4.12.0.RELEASE
- eclipse IDE version - 2020-12 (4.18.0)
- Apache Tomcat v9.0
- MySQL 8.0
- Lombok



**사용기술**

- Springsecurity

- JsonWebToken(JWT)

- OAuth2 AutoConfigure

- Bcrypt

- MyBatis

- WebSocket

- kakao login API

- Summernote API

- i'mport API

- Naver CLOVA chatbot - Custum API

- json

- ajax

  

**브라우저 서포트**

- Google Chrome - v94.0.4606.81(공식 빌드)(64비트)





## 역할분담

- 강래현 - 로그인, 회원가입, JWT, Spring security, 관리자게시판, 문의게시판
- 전준호 - 커뮤니티페이지, 쇼핑몰페이지, 상품 디테일페이지, 반려동물 등록페이지, 자료 수집
- 최상철 - 댓글 대댓글, 해쉬태그, 장바구니, 결제페이지, 주문내역, 챗봇
- 황길성 - DB구상, 실시간 1대1 채팅, 좋아요, 팔로우, 마이페이지, 프론트 레이아웃 설계 및 구현, 전체 css디자인





## Maintain

not yet





## License

not yet





## 프로젝트 후기

not yet
