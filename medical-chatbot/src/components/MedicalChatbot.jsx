import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

const TypewriterText = ({ content, onComplete }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (currentIndex < content.length) {
      intervalRef.current = setInterval(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 20);
    } else {
      onComplete && onComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, content, onComplete]);

  return <p className="whitespace-pre-line">{displayedContent}</p>;
};

const Message = ({ message, isLatest }) => {
  const [isComplete, setIsComplete] = useState(!isLatest);

  return (
    <div className={`flex w-full ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${
          message.type === 'user' ? 'bg-blue-500 ml-3' : 'bg-purple-500 mr-3'
        } flex items-center justify-center text-white font-semibold`}>
          {message.type === 'user' ? 'U' : 'B'}
        </div>
        <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block rounded-lg px-4 py-2 ${
            message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}>
            {isLatest && !isComplete && message.type === 'bot' ? (
              <TypewriterText 
                content={message.content} 
                onComplete={() => setIsComplete(true)} 
              />
            ) : (
              <p className="whitespace-pre-line">{message.content}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const symptomsDatabase = {
  '두통': {
    keywords: ['두통', '머리 아픔', '머리가 아프', '머리가 띵하', '편두통'],
    categories: ['신경계', '통증'],
    relatedSymptoms: ['어지러움', '구토', '발열', '목통증'],
    possibleConditions: ['긴장성 두통', '편두통', '군발성 두통', '부비동염'],
    severity: {
      mild: '가벼운 두통은 휴식과 충분한 수면으로 호전될 수 있습니다.',
      moderate: '진통제 복용을 고려해볼 수 있으며, 지속될 경우 진료가 필요합니다.',
      severe: '심한 두통이 지속되면 즉시 진료가 필요합니다.'
    },
    treatment: '충분한 휴식, 규칙적인 수면, 스트레스 관리, 적절한 수분 섭취가 도움될 수 있습니다.',
    warning: '추가로 갑자기 발생한 극심한 두통, 발열이나 목이 뻣뻣한 증상이 동반될 때, 의식이 혼미하거나 어지러운 증상이 나타나면 ~병원에서 추가 처치를 받는 것을 추천드려요.'
  },
  '발열': {
    keywords: ['열', '발열', '미열', '체온', '열이 나'],
    categories: ['전신증상'],
    relatedSymptoms: ['오한', '근육통', '두통', '피로'],
    possibleConditions: ['감기', '독감', '폐렴', '바이러스 감염'],
    severity: {
      mild: '미열은 휴식과 충분한 수분 섭취로 호전될 수 있습니다.',
      moderate: '38도 이상의 발열이 지속되면 진료가 필요할 수 있습니다.',
      severe: '고열이 지속되거나 다른 심각한 증상과 동반되면 즉시 진료가 필요합니다.'
    },
    treatment: '충분한 휴식, 수분 보충, 해열제 복용을 고려해볼 수 있습니다.',
    warning: '추가로 39도 이상의 고열, 심한 오한과 근육통 동반, 의식이 흐릿해지는 증상이 나타나면 ~병원에서 추가 처치를 받는 것을 추천드려요.'
  },
  '복통': {
    keywords: ['복통', '배 아픔', '배가 아프', '속이 아프', '위가 아프', '배가 걸리'],
    categories: ['소화기계', '통증'],
    relatedSymptoms: ['구토', '설사', '소화불량', '메스꺼움'],
    possibleConditions: ['소화불량', '위염', '장염', '과민성 대장증후군', '식중독'],
    severity: {
      mild: '가벼운 복통은 식이조절과 휴식으로 호전될 수 있습니다.',
      moderate: '증상이 지속되면 진료를 받아보시는 것이 좋습니다.',
      severe: '심한 복통이 지속되면 즉시 응급실을 방문하세요.'
    },
    treatment: '소화가 잘되는 음식 섭취, 충분한 수분 섭취, 규칙적인 식사가 도움됩니다.',
    warning: '추가로 극심한 복통, 혈변, 지속적인 구토, 고열 동반 증상이 나타나면 ~병원에서 추가 처치를 받는 것을 추천드려요.'
  },
  '피로': {
    keywords: ['피로', '피곤', '무기력', '에너지가 없', '졸림', '나른'],
    categories: ['전신증상'],
    relatedSymptoms: ['두통', '근육통', '집중력 저하', '식욕부진'],
    possibleConditions: ['수면부족', '스트레스', '빈혈', '갑상선 기능 저하증', '만성피로증후군'],
    severity: {
      mild: '일시적인 피로는 휴식으로 회복될 수 있습니다.',
      moderate: '지속적인 피로감이 있다면 기초 검사를 받아보세요.',
      severe: '심한 피로가 장기간 지속되면 전문의 상담이 필요합니다.'
    },
    treatment: '규칙적인 수면, 균형 잡힌 영양 섭취, 적절한 운동이 도움됩니다.',
    warning: '추가로 3개월 이상 지속되는 피로, 일상생활이 어려울 정도의 피로, 다른 증상이 동반될 증상이 나타나면 ~병원에서 추가 처치를 받는 것을 추천드려요.'
  },
  '기침': {
    keywords: ['기침', '켁켁', '가래', '기침이 나'],
    categories: ['호흡기계'],
    relatedSymptoms: ['가래', '인후통', '코막힘', '발열'],
    possibleConditions: ['감기', '기관지염', '폐렴', '알레르기'],
    severity: {
      mild: '가벼운 기침은 휴식과 수분 섭취로 호전될 수 있습니다.',
      moderate: '1주일 이상 지속되면 진료를 받아보세요.',
      severe: '심한 기침이 지속되거나 호흡곤란이 있으면 즉시 진료가 필요합니다.'
    },
    treatment: '충분한 휴식, 수분 섭취, 가습기 사용이 도움될 수 있습니다.',
    warning: '추가로 호흡곤란 동반, 피가 섞인 가래, 고열 동반, 2주 이상 지속되는 기침 증상이 나타나면 ~병원에서 추가 처치를 받는 것을 추천드려요.'
  },
  '어지러움': {
    keywords: ['어지럽', '어질어질', '현기증', '눈앞이 빙글', '회전성 어지러움'],
    categories: ['신경계'],
    relatedSymptoms: ['두통', '메스꺼움', '구토', '이명'],
    possibleConditions: ['빈혈', '저혈압', '메니에르병', '전정신경염'],
    severity: {
      mild: '가벼운 어지러움은 휴식으로 호전될 수 있습니다.',
      moderate: '반복되는 어지러움은 진료를 받아보세요.',
      severe: '심한 어지러움이 지속되면 즉시 진료가 필요합니다.'
    },
    treatment: '충분한 휴식, 수분 섭취, 천천히 자세 변경하기가 도움됩니다.',
    warning: '추가로 의식 저하, 심한 두통 동반, 마비 증상, 말이 어눌해지는 증상이 나타나면 ~병원에서 추가 처치를 받는 것을 추천드려요.'
  }
};

// 여러 증상을 동시에 분석하는 함수
const analyzeMultipleSymptoms = (input) => {
  const foundSymptoms = [];
  let severity = 'mild';
  
  // 모든 증상 검사
  for (const [symptom, data] of Object.entries(symptomsDatabase)) {
    if (data.keywords.some(keyword => input.includes(keyword))) {
      foundSymptoms.push({ symptom, data });
    }
  }

  // 심각도 분석
  if (input.includes('심한') || input.includes('극심한') || input.includes('매우')) {
    severity = 'severe';
  } else if (input.includes('조금') || input.includes('약간')) {
    severity = 'moderate';
  }

  // 증상 간의 연관성 분석
  const relatedConditions = new Set();
  const commonCategories = new Set();
  
  foundSymptoms.forEach(({ data }) => {
    data.possibleConditions.forEach(condition => relatedConditions.add(condition));
    data.categories.forEach(category => commonCategories.add(category));
  });

  return {
    foundSymptoms,
    severity,
    relatedConditions: Array.from(relatedConditions),
    commonCategories: Array.from(commonCategories)
  };
};

// 챗봇 응답 생성 함수
const generateResponse = (analysis) => {
  if (!analysis.foundSymptoms.length) {
    return {
      type: 'bot',
      content: '죄송합니다. 말씀하신 증상을 정확히 이해하지 못했습니다. 증상을 조금 더 자세히 설명해 주시거나, 다른 표현으로 설명해 주시겠어요?'
    };
  }

  let response = ``;

  // 각 증상별 분석
  analysis.foundSymptoms.forEach(({ symptom, data }) => {
    response += `${symptom}떄문에 불편하시군요. 지금부터 증상 완화를 위해 다음 절차를 따라주세요.\n`;
    response += `• 심각도: ${data.severity[analysis.severity]}\n`;
    response += `• 관련될 수 있는 증상: ${data.relatedSymptoms.join(', ')}\n`;
    response += `• 권장 조치: ${data.treatment}\n\n`;
  });

  // 종합 분석
  if (analysis.foundSymptoms.length > 1) {                        
    response += `📊 종합 분석\n`;
    response += `• 증상 카테고리: ${analysis.commonCategories.join(', ')}\n`;
    response += `• 고려해볼 수 있는 상태: ${analysis.relatedConditions.join(', ')}\n\n`;
  }

  // 주의사항
  response += `⚠️ 주의사항\n`;
  response += analysis.foundSymptoms.map(({ data }) => data.warning).join('\n\n');
  response += `\n\n다른 도움이 필요하시면 언제든 말씀해 주세요!`;

  return {
    type: 'bot',
    content: response
  };
};


const AIMedicalChatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: '안녕하세요? 저는 베이맥스. 당신의 개인 의료 도우미입니다. 현재 어떤 증상들이 있으신지 자세히 설명해 주시겠어요?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messageContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      const scrollHeight = messageContainerRef.current.scrollHeight;
      const height = messageContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      messageContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const scrollInterval = setInterval(scrollToBottom, 10);
    if (!isTyping) {
      clearInterval(scrollInterval);
    }
    return () => clearInterval(scrollInterval);
  }, [isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const analysis = analyzeMultipleSymptoms(input);
      const botResponse = generateResponse(analysis);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 메시지 영역 */}
      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        {messages.map((message, index) => (
          <Message 
            key={index} 
            message={message} 
            isLatest={index === messages.length - 1 && message.type === 'bot'}
          />
        ))}
        {isTyping && (
          <div className="flex w-full justify-start">
            <div className="flex max-w-[80%] flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 mr-3 flex items-center justify-center text-white font-semibold">
                B
              </div>
              <div className="flex-1">
                <div className="inline-block rounded-lg px-4 py-2 bg-gray-100">
                  <p className="text-gray-500">입력중...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="flex-none p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="여러 증상을 자세히 설명해주세요..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            className={`p-3 rounded-lg ${
              isTyping ? 
              'bg-gray-300 cursor-not-allowed' : 
              'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={isTyping}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIMedicalChatbot;