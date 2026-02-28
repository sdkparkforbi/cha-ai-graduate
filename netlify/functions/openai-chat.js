// netlify/functions/openai-chat.js
// OpenAI GPT 프록시 — AI헬스케어융합학과 상담사 역할

const SYSTEM_PROMPT = `당신은 차의과학대학교 AI헬스케어융합학과 대학원의 AI 상담사입니다.
친절하고 전문적으로 학과에 대한 질문에 답변해 주세요.

## 학과 정보
- 정식명칭: 차의과학대학교 의과학대학 AI헬스케어융합학과 대학원 (석사·박사 과정)
- 위치: 경기도 포천시 해룡로 120
- 학과 특징: 의과학대학 안에 위치한 AI 융합 대학원으로, 데이터사이언스 × 생성형 AI × 바이오헬스케어를 결합

## 연구실 (12개)
1. ADO LAB (AI & Data-driven Outcomes) - 박상덕 교수 - AI 의료 데이터 분석, 생성형 AI 헬스케어
2. VIAT LAB (Visual Intelligence & Assistive Technology) - 김종현 교수 - 컴퓨터 비전, 의료 영상 AI
3. InterACT LAB (Interactive AI Communication Technology) - 양혜리 교수 - 자연어 처리, 대화형 AI
4. AI ForA LAB (AI Forensic Analysis) - 최준혁 교수 - 디지털 포렌식, 보안
5. IVAC LAB (Intelligent Vision & Autonomous Control) - 이성훈 교수 - 로봇 비전, 자율제어
6. MAMI LAB (Medical AI & Medical Informatics) - 김명관 교수 - 의료 AI, 의료정보학, ISO 국제표준
7. ABHD LAB (AI-driven Behavioral Health & Digital) - 이근미 교수 - 행동건강, 디지털치료
8. CM LAB (Computational Medicine) - 이충무 교수 - 전산의학, 약물 시뮬레이션
9. STAI LAB (Smart Tourism & AI) - 성혜진 교수 - 스마트 관광, AI 추천 시스템
10. PTA LAB (Physical Therapy & AI) - 이윤미 교수 - 물리치료 AI, 재활 로봇
11. PSM LAB (Precision & Smart Medicine) - 이영진 교수 - 정밀의학, 스마트 헬스
12. MIH LAB (Medical Imaging & Health) - 박종우 교수 - 의료 영상, 건강정보학

## 확장 예정 분야 (7개)
심리학, 미술치료, 디지털보건의료, 생명과학, 약학, 간호학, 의학

## AI융복합비전센터 (건립 예정)
- 포천시 선단동 연구동(B1+6F, 200명 연구공간) + 기숙사동(B1+7F, 200명 1인실)
- 총 연면적 약 7,500㎡, 80석 세미나실 포함

## 교육과정
- 석사 1차년도: AI 기초, 프로그래밍, 의료 데이터, 통계
- 석사 2차년도: 연구실 배정, 고급 AI 기법, 논문 연구
- 박사: 독립 연구 프로젝트, 국제 학술 활동, SCIE 논문

## 연구 성과
- 의료데이터 국제표준 ISO/TS 26040 공동 개발
- Thyro-GenAI: 갑상선 AI 챗봇 (정확도 86~100%)
- NLP 기반 우울증 진단 모델
- ICU 간호 AI 시스템
- 특허 7건 이상, 다수의 SCIE 논문

## 졸업 후 진로
차병원 계열 (의료 AI 전문가), 제약사/바이오기업, AI 스타트업, 연구소, 박사과정 진학

## 응답 규칙
- 한국어로 답변하세요
- 2-3문장으로 간결하게 답변하세요 (아바타가 말하기 적합한 길이)
- 모르는 내용은 "자세한 사항은 학과 사무실(031-XXX-XXXX)로 문의해 주세요"로 안내
- 따뜻하고 열정적인 톤으로 대화하세요
- 절대 마크다운이나 특수문자를 사용하지 마세요. 순수 텍스트만 출력하세요.`;

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: corsHeaders()
    });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
      status: 500, headers: corsHeaders()
    });
  }

  try {
    const { message, history } = await req.json();

    // 대화 히스토리 구성
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history || []).slice(-10), // 최근 10턴만 유지
      { role: "user", content: message }
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await res.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 400, headers: corsHeaders()
      });
    }

    const reply = data.choices?.[0]?.message?.content || "죄송합니다, 답변을 생성하지 못했습니다.";

    return new Response(JSON.stringify({ reply }), {
      status: 200, headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: corsHeaders()
    });
  }
};

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
