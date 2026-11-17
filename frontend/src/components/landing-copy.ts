import type { SiteLanguage } from "@/lib/siteLanguage";

export type LandingTool = { name: string; tag: string; path: string };
export type LandingCopy = {
  nav: { home: string; tools: string; about: string; questions: string; faq: string };
  login: string;
  getStarted: string;
  hero: {
    a: string;
    b: string;
    sub: string;
    cta1: string;
    cta2: string;
    scroll: string;
    pill1: string;
    pill2: string;
  };
  tools: LandingTool[];
  about: {
    tag: string;
    a: string;
    b: string;
    desc: string;
    items: { title: string; text: string; path: string; img: number }[];
    open: string;
  };
  spot: {
    weather: string;
    rain: string;
    near: string;
    openWeather: string;
    askTitle: string;
    askChips: string[];
    askCta: string;
    loading: string;
  };
  stats: { value: number | null; label: string; word?: string }[];
  carousel: { tag: string; a: string; b: string; desc: string };
  questions: { tag: string; a: string; b: string; desc: string; items: string[]; ask: string };
  faq: { tag: string; a: string; b: string; desc: string; items: { q: string; a: string }[] };
  cta: { a: string; b: string; desc: string; button: string };
  footer: {
    desc: string;
    quick: string;
    toolsTitle: string;
    important: string;
    disclaimer: string;
    rights: string;
  };
};

export const landingCopy: Record<SiteLanguage, LandingCopy> = {
  en: {
    nav: { home: "Home", tools: "Tools", about: "About", questions: "Ask", faq: "FAQ" },
    login: "Login",
    getStarted: "Get Started",
    hero: {
      a: "Smart Farming for",
      b: "Future Generations",
      sub: "Loans, schemes, weather, mandi prices and crop advice in Hindi, Marathi and English. Simple to use, free to start.",
      cta1: "Start with Kishan Saathi",
      cta2: "Explore tools",
      scroll: "SCROLL",
      pill1: "Hindi · Marathi · English",
      pill2: "Free to start",
    },
    tools: [
      { name: "AI Assistant", tag: "Get instant advice", path: "/assistant" },
      { name: "Crop Calendar", tag: "Plan your sowing", path: "/crop-calendar" },
      { name: "Crop Disease Check", tag: "Identify & treat", path: "/crop-health" },
      { name: "Government Schemes", tag: "Avail benefits", path: "/schemes" },
      { name: "Weather Alerts", tag: "Plan better", path: "/weather" },
      { name: "Mandi Prices", tag: "Live market rates", path: "/mandi" },
      { name: "EMI Calculator", tag: "Plan your finances", path: "/emi-calculator" },
    ],
    about: {
      tag: "About Kishan Saathi",
      a: "Smart Farming Solutions",
      b: "That Make Decisions Easier",
      desc: "Kishan Saathi explains loans and schemes in simple words and brings weather, market prices and crop help into one place.",
      open: "Open tool",
      items: [
        {
          title: "Loan & scheme guidance",
          text: "Find out which agricultural loans and government schemes may suit your farm, and which documents to keep ready.",
          path: "/loan-eligibility",
          img: 0,
        },
        {
          title: "Weather you can plan around",
          text: "See the forecast for your location and get practical farming alerts before you sow, spray or harvest.",
          path: "/weather",
          img: 1,
        },
        {
          title: "Crop health check",
          text: "Upload a photo of your crop and get careful first guidance. Always confirm with a local expert.",
          path: "/crop-health",
          img: 0,
        },
        {
          title: "Mandi prices & EMI",
          text: "Compare market prices before you sell and estimate your loan EMI before you apply.",
          path: "/mandi",
          img: 1,
        },
      ],
    },
    spot: {
      weather: "Today's weather",
      rain: "Chance of rain",
      near: "Near you",
      openWeather: "See full forecast",
      askTitle: "Ask Kishan Saathi",
      askChips: ["Which scheme fits my farm?", "Documents for a farm loan"],
      askCta: "Ask a question",
      loading: "Loading…",
    },
    stats: [
      { value: 3, label: "Languages" },
      { value: 7, label: "Farming tools" },
      { value: 1, label: "App for loans, schemes, weather and prices" },
      { value: null, label: "Ask by speaking", word: "Voice" },
    ],
    carousel: {
      tag: "Tools",
      a: "Smart Solutions for",
      b: "Modern Farming",
      desc: "Everything a farmer needs to plan, borrow and sell with confidence.",
    },
    questions: {
      tag: "Ask",
      a: "Questions You Can Ask",
      b: "Kishan Saathi",
      desc: "Tap a question to start. Answers are guidance only, so always confirm with your bank or the official scheme office.",
      ask: "Ask this",
      items: [
        "Which loan or scheme fits my 2 acre farm?",
        "What documents does the bank need for a Kisan Credit Card?",
        "How should I plan sowing around this week's rain?",
        "What is a fair price for my crop in the mandi today?",
        "How can I tell if my crop has a disease?",
        "How much monthly EMI will I pay on my loan?",
      ],
    },
    faq: {
      tag: "FAQ",
      a: "Common Farmer",
      b: "Questions",
      desc: "Quick answers about using Kishan Saathi.",
      items: [
        {
          q: "Is Kishan Saathi free?",
          a: "Yes. You can log in with Google and use the tools without paying.",
        },
        {
          q: "Will it guarantee my loan or scheme?",
          a: "No. Kishan Saathi only explains options. The bank or the government office decides approval.",
        },
        {
          q: "Which languages can I use?",
          a: "English, Hindi and Marathi. You can switch language anytime from the top of the page.",
        },
        {
          q: "Where do mandi prices come from?",
          a: "Prices come from the Government of India open data portal (data.gov.in) through our server.",
        },
        {
          q: "Is it safe to log in?",
          a: "Login uses Google through Firebase. Never share Aadhaar numbers, bank details or OTPs in the chat.",
        },
      ],
    },
    cta: {
      a: "Make farming smarter,",
      b: "stronger, and simpler",
      desc: "Start with one question about your farm.",
      button: "Get Started",
    },
    footer: {
      desc: "A simple farming companion for loans, schemes, weather and market prices.",
      quick: "Quick links",
      toolsTitle: "Tools",
      important: "Important",
      disclaimer:
        "Information is educational and does not guarantee loan approval or scheme eligibility.",
      rights: "Built to support India's farming community.",
    },
  },
  hi: {
    nav: { home: "होम", tools: "औज़ार", about: "परिचय", questions: "पूछें", faq: "सवाल" },
    login: "लॉगिन",
    getStarted: "शुरू करें",
    hero: {
      a: "स्मार्ट खेती,",
      b: "आने वाली पीढ़ियों के लिए",
      sub: "कृषि ऋण, सरकारी योजनाएं, मौसम, मंडी भाव और फसल सलाह, हिंदी, मराठी और अंग्रेज़ी में। इस्तेमाल में आसान, शुरू करना मुफ्त।",
      cta1: "किसान साथी से शुरू करें",
      cta2: "औज़ार देखें",
      scroll: "नीचे देखें",
      pill1: "हिंदी · मराठी · English",
      pill2: "शुरू करना मुफ्त",
    },
    tools: [
      { name: "एआई सहायक", tag: "तुरंत सलाह पाएं", path: "/assistant" },
      { name: "फसल कैलेंडर", tag: "बोआई की योजना", path: "/crop-calendar" },
      { name: "फसल रोग जांच", tag: "पहचानें और इलाज करें", path: "/crop-health" },
      { name: "सरकारी योजनाएं", tag: "लाभ उठाएं", path: "/schemes" },
      { name: "मौसम अलर्ट", tag: "बेहतर योजना बनाएं", path: "/weather" },
      { name: "मंडी भाव", tag: "ताज़ा बाज़ार भाव", path: "/mandi" },
      { name: "ईएमआई कैलकुलेटर", tag: "खर्च की योजना बनाएं", path: "/emi-calculator" },
    ],
    about: {
      tag: "किसान साथी के बारे में",
      a: "स्मार्ट खेती के समाधान",
      b: "जो फैसले आसान बनाएं",
      desc: "किसान साथी ऋण और योजनाओं को सरल शब्दों में समझाता है और मौसम, मंडी भाव और फसल की मदद एक जगह लाता है।",
      open: "औज़ार खोलें",
      items: [
        {
          title: "ऋण और योजना मार्गदर्शन",
          text: "जानें कि आपके खेत के लिए कौन से कृषि ऋण और सरकारी योजनाएं ठीक हो सकती हैं, और कौन से दस्तावेज़ तैयार रखें।",
          path: "/loan-eligibility",
          img: 0,
        },
        {
          title: "मौसम के हिसाब से योजना",
          text: "अपने इलाके का पूर्वानुमान देखें और बोआई, छिड़काव या कटाई से पहले काम की सलाह पाएं।",
          path: "/weather",
          img: 1,
        },
        {
          title: "फसल स्वास्थ्य जांच",
          text: "फसल की फोटो डालें और शुरुआती सावधान सलाह पाएं। हमेशा स्थानीय विशेषज्ञ से पुष्टि करें।",
          path: "/crop-health",
          img: 0,
        },
        {
          title: "मंडी भाव और ईएमआई",
          text: "बेचने से पहले बाज़ार भाव की तुलना करें और ऋण लेने से पहले ईएमआई का अंदाज़ा लगाएं।",
          path: "/mandi",
          img: 1,
        },
      ],
    },
    spot: {
      weather: "आज का मौसम",
      rain: "बारिश की संभावना",
      near: "आपके पास",
      openWeather: "पूरा पूर्वानुमान देखें",
      askTitle: "किसान साथी से पूछें",
      askChips: ["मेरे खेत के लिए कौन सी योजना?", "कृषि ऋण के दस्तावेज़"],
      askCta: "सवाल पूछें",
      loading: "लोड हो रहा है…",
    },
    stats: [
      { value: 3, label: "भाषाएं" },
      { value: 7, label: "खेती के औज़ार" },
      { value: 1, label: "ऐप: ऋण, योजना, मौसम और भाव" },
      { value: null, label: "बोलकर पूछें", word: "आवाज़" },
    ],
    carousel: {
      tag: "औज़ार",
      a: "आधुनिक खेती के लिए",
      b: "स्मार्ट समाधान",
      desc: "योजना बनाने, ऋण लेने और बेचने के लिए किसान को जो चाहिए, सब एक जगह।",
    },
    questions: {
      tag: "पूछें",
      a: "आप ये सवाल पूछ सकते हैं",
      b: "किसान साथी से",
      desc: "शुरू करने के लिए सवाल पर टैप करें। जवाब केवल मार्गदर्शन हैं, इसलिए बैंक या सरकारी कार्यालय से पुष्टि जरूर करें।",
      ask: "यह पूछें",
      items: [
        "मेरे 2 एकड़ खेत के लिए कौन सा ऋण या योजना ठीक है?",
        "किसान क्रेडिट कार्ड के लिए बैंक को कौन से दस्तावेज़ चाहिए?",
        "इस हफ्ते की बारिश देखकर बोआई कैसे तय करूं?",
        "आज मंडी में मेरी फसल का सही भाव क्या है?",
        "मेरी फसल में बीमारी है या नहीं, कैसे पता करूं?",
        "मेरे ऋण की मासिक ईएमआई कितनी होगी?",
      ],
    },
    faq: {
      tag: "सवाल",
      a: "किसानों के",
      b: "आम सवाल",
      desc: "किसान साथी इस्तेमाल करने के बारे में छोटे जवाब।",
      items: [
        {
          q: "क्या किसान साथी मुफ्त है?",
          a: "हां। आप Google से लॉगिन करके बिना पैसे दिए औज़ार इस्तेमाल कर सकते हैं।",
        },
        {
          q: "क्या ऋण या योजना की गारंटी मिलेगी?",
          a: "नहीं। किसान साथी केवल विकल्प समझाता है। मंज़ूरी बैंक या सरकारी कार्यालय देता है।",
        },
        {
          q: "कौन सी भाषाएं चुन सकते हैं?",
          a: "अंग्रेज़ी, हिंदी और मराठी। पेज के ऊपर से कभी भी भाषा बदल सकते हैं।",
        },
        {
          q: "मंडी भाव कहां से आते हैं?",
          a: "भाव भारत सरकार के ओपन डेटा पोर्टल (data.gov.in) से हमारे सर्वर के जरिए आते हैं।",
        },
        {
          q: "क्या लॉगिन सुरक्षित है?",
          a: "लॉगिन Firebase के जरिए Google से होता है। चैट में आधार नंबर, बैंक की जानकारी या OTP कभी न डालें।",
        },
      ],
    },
    cta: {
      a: "खेती को और स्मार्ट,",
      b: "मजबूत और आसान बनाएं",
      desc: "अपने खेत के बारे में एक सवाल से शुरू करें।",
      button: "शुरू करें",
    },
    footer: {
      desc: "ऋण, योजनाओं, मौसम और मंडी भाव के लिए एक आसान खेती साथी।",
      quick: "जल्दी लिंक",
      toolsTitle: "औज़ार",
      important: "महत्वपूर्ण",
      disclaimer:
        "यह जानकारी शैक्षिक है और ऋण स्वीकृति या योजना की पात्रता की गारंटी नहीं देती।",
      rights: "भारत के किसान समुदाय की मदद के लिए बनाया गया।",
    },
  },
  mr: {
    nav: { home: "मुख्यपृष्ठ", tools: "साधने", about: "परिचय", questions: "विचारा", faq: "प्रश्न" },
    login: "लॉगिन",
    getStarted: "सुरू करा",
    hero: {
      a: "स्मार्ट शेती,",
      b: "पुढच्या पिढ्यांसाठी",
      sub: "कृषी कर्ज, सरकारी योजना, हवामान, बाजारभाव आणि पीक सल्ला, हिंदी, मराठी आणि इंग्रजीत. वापरायला सोपे, सुरू करणे मोफत.",
      cta1: "किसान साथीने सुरू करा",
      cta2: "साधने पहा",
      scroll: "खाली पहा",
      pill1: "हिंदी · मराठी · English",
      pill2: "सुरू करणे मोफत",
    },
    tools: [
      { name: "एआय सहाय्यक", tag: "लगेच सल्ला मिळवा", path: "/assistant" },
      { name: "पीक कॅलेंडर", tag: "पेरणीचे नियोजन", path: "/crop-calendar" },
      { name: "पीक रोग तपासणी", tag: "ओळखा आणि उपचार करा", path: "/crop-health" },
      { name: "सरकारी योजना", tag: "लाभ मिळवा", path: "/schemes" },
      { name: "हवामान सूचना", tag: "चांगले नियोजन करा", path: "/weather" },
      { name: "बाजारभाव", tag: "ताजे बाजारभाव", path: "/mandi" },
      { name: "ईएमआय कॅल्क्युलेटर", tag: "खर्चाचे नियोजन", path: "/emi-calculator" },
    ],
    about: {
      tag: "किसान साथी बद्दल",
      a: "स्मार्ट शेतीचे उपाय",
      b: "जे निर्णय सोपे करतात",
      desc: "किसान साथी कर्ज आणि योजना सोप्या शब्दांत समजावतो आणि हवामान, बाजारभाव व पीक मदत एका ठिकाणी आणतो.",
      open: "साधन उघडा",
      items: [
        {
          title: "कर्ज आणि योजना मार्गदर्शन",
          text: "तुमच्या शेतासाठी कोणती कृषी कर्जे आणि सरकारी योजना योग्य असू शकतात आणि कोणती कागदपत्रे तयार ठेवावीत ते जाणून घ्या.",
          path: "/loan-eligibility",
          img: 0,
        },
        {
          title: "हवामानानुसार नियोजन",
          text: "तुमच्या भागाचा अंदाज पहा आणि पेरणी, फवारणी किंवा कापणीआधी उपयुक्त सूचना मिळवा.",
          path: "/weather",
          img: 1,
        },
        {
          title: "पीक आरोग्य तपासणी",
          text: "पिकाचा फोटो अपलोड करा आणि सुरुवातीचा काळजीपूर्वक सल्ला मिळवा. नेहमी स्थानिक तज्ज्ञांकडून खात्री करा.",
          path: "/crop-health",
          img: 0,
        },
        {
          title: "बाजारभाव आणि ईएमआय",
          text: "विकण्याआधी बाजारभावांची तुलना करा आणि कर्ज घेण्याआधी ईएमआयचा अंदाज घ्या.",
          path: "/mandi",
          img: 1,
        },
      ],
    },
    spot: {
      weather: "आजचे हवामान",
      rain: "पावसाची शक्यता",
      near: "तुमच्या जवळ",
      openWeather: "पूर्ण अंदाज पहा",
      askTitle: "किसान साथीला विचारा",
      askChips: ["माझ्या शेतासाठी कोणती योजना?", "कृषी कर्जाची कागदपत्रे"],
      askCta: "प्रश्न विचारा",
      loading: "लोड होत आहे…",
    },
    stats: [
      { value: 3, label: "भाषा" },
      { value: 7, label: "शेतीची साधने" },
      { value: 1, label: "ॲप: कर्ज, योजना, हवामान आणि भाव" },
      { value: null, label: "बोलून विचारा", word: "आवाज" },
    ],
    carousel: {
      tag: "साधने",
      a: "आधुनिक शेतीसाठी",
      b: "स्मार्ट उपाय",
      desc: "नियोजन, कर्ज आणि विक्रीसाठी शेतकऱ्याला जे हवे ते सर्व एका ठिकाणी.",
    },
    questions: {
      tag: "विचारा",
      a: "तुम्ही हे प्रश्न विचारू शकता",
      b: "किसान साथीला",
      desc: "सुरू करण्यासाठी प्रश्नावर टॅप करा. उत्तरे फक्त मार्गदर्शन आहेत, म्हणून बँक किंवा सरकारी कार्यालयाकडून खात्री करा.",
      ask: "हे विचारा",
      items: [
        "माझ्या 2 एकर शेतासाठी कोणते कर्ज किंवा योजना योग्य आहे?",
        "किसान क्रेडिट कार्डसाठी बँकेला कोणती कागदपत्रे लागतात?",
        "या आठवड्याच्या पावसानुसार पेरणीचे नियोजन कसे करू?",
        "आज बाजारात माझ्या पिकाला योग्य भाव काय आहे?",
        "माझ्या पिकाला रोग आहे का हे कसे ओळखू?",
        "माझ्या कर्जाचा मासिक ईएमआय किती येईल?",
      ],
    },
    faq: {
      tag: "प्रश्न",
      a: "शेतकऱ्यांचे",
      b: "नेहमीचे प्रश्न",
      desc: "किसान साथी वापरण्याबद्दल छोटी उत्तरे.",
      items: [
        {
          q: "किसान साथी मोफत आहे का?",
          a: "हो. Google ने लॉगिन करून तुम्ही पैसे न देता साधने वापरू शकता.",
        },
        {
          q: "कर्ज किंवा योजनेची हमी मिळेल का?",
          a: "नाही. किसान साथी फक्त पर्याय समजावतो. मंजुरी बँक किंवा सरकारी कार्यालय देते.",
        },
        {
          q: "कोणत्या भाषा वापरता येतात?",
          a: "इंग्रजी, हिंदी आणि मराठी. पानाच्या वरून कधीही भाषा बदलता येते.",
        },
        {
          q: "बाजारभाव कुठून येतात?",
          a: "भाव भारत सरकारच्या ओपन डेटा पोर्टलवरून (data.gov.in) आमच्या सर्व्हरमार्फत येतात.",
        },
        {
          q: "लॉगिन सुरक्षित आहे का?",
          a: "लॉगिन Firebase द्वारे Google ने होते. चॅटमध्ये आधार क्रमांक, बँक तपशील किंवा OTP कधीही देऊ नका.",
        },
      ],
    },
    cta: {
      a: "शेती अधिक स्मार्ट,",
      b: "मजबूत आणि सोपी करा",
      desc: "तुमच्या शेताबद्दलच्या एका प्रश्नाने सुरुवात करा.",
      button: "सुरू करा",
    },
    footer: {
      desc: "कर्ज, योजना, हवामान आणि बाजारभावासाठी एक सोपा शेती साथी.",
      quick: "जलद दुवे",
      toolsTitle: "साधने",
      important: "महत्त्वाचे",
      disclaimer:
        "ही माहिती शैक्षणिक आहे आणि कर्ज मंजुरी किंवा योजना पात्रतेची हमी देत नाही.",
      rights: "भारतातील शेतकरी समुदायाला मदत करण्यासाठी तयार केले.",
    },
  },
};
