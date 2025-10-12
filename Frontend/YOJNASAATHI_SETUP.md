# YojnaSaathi Chatbot Setup Guide

## 🚀 Features Implemented

✅ **Multilingual Support**: Auto-detects and responds in 11 Indian languages
- Hindi, English, Tamil, Telugu, Bengali, Gujarati, Punjabi, Kannada, Malayalam, Odia, Marathi

✅ **Voice Features**:
- Speech-to-Text (STT) for voice input
- Text-to-Speech (TTS) for voice output
- Natural voice without reading punctuation literally
- Mute/Unmute toggle

✅ **UI/UX**:
- Popup chat mode + full-page mode (/chat route)
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Large, readable text for accessibility
- Clear buttons and intuitive interface

✅ **Smart Responses**:
- Greets users in detected language
- Shows 5 popular government schemes initially
- Structured JSON responses for scheme details
- Follow-up questions in user's language
- Integration with Gemini API

✅ **Accessibility**:
- Designed for illiterate users
- Large text and clear visual indicators
- Voice-first interaction
- Simple, intuitive interface

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Gemini API Setup (Optional)
The chatbot works with mock responses if no API key is provided.

To enable full Gemini AI functionality:
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the Frontend directory:
```bash
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Note**: In Vite, environment variables must be prefixed with `VITE_` to be accessible in the browser.

### 3. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎯 How to Use

### Popup Mode
- Click the floating chat button on the home page
- Chat appears as a popup in the bottom-right corner
- Click the maximize button to open in full-page mode

### Full-Page Mode
- Navigate to `/chat` route
- Or click "Chat with Saathi" buttons on the home page
- Full-screen chat experience

### Voice Features
- Click the microphone button to start voice input
- The chatbot will speak responses automatically
- Use the volume button to mute/unmute audio

### Language Detection
- Type or speak in any supported Indian language
- The chatbot automatically detects and responds in the same language
- Language indicator shows current detected language

## 📱 Supported Languages

| Language | Native Script | Code |
|----------|---------------|------|
| English | English | en |
| Hindi | हिंदी | hi |
| Tamil | தமிழ் | ta |
| Telugu | తెలుగు | te |
| Bengali | বাংলা | bn |
| Gujarati | ગુજરાતી | gu |
| Punjabi | ਪੰਜਾਬੀ | pa |
| Kannada | ಕನ್ನಡ | kn |
| Malayalam | മലയാളം | ml |
| Odia | ଓଡ଼ିଆ | or |
| Marathi | मराठी | mr |

## 🏛️ Sample Government Schemes

The chatbot includes 5 sample government schemes:
1. **PM-KISAN** - Direct income support for farmers
2. **Ayushman Bharat** - Health insurance scheme
3. **PMAY** - Housing for All scheme
4. **Mudra Yojana** - Micro finance for businesses
5. **Ujjwala Yojana** - Free LPG connections

## 🔧 Technical Details

### Components Structure
```
src/
├── components/
│   └── YojnaSaathi.jsx          # Main chatbot component
├── pages/
│   └── Chat.jsx                 # Full-page chat route
├── data/
│   └── schemesData.js           # Sample schemes and language data
├── utils/
│   └── geminiApi.js             # Gemini API integration
└── App.jsx                      # Updated with chat route
```

### Key Features
- **Language Detection**: Uses Unicode ranges to detect Indian languages
- **Speech Recognition**: Web Speech API for voice input
- **Speech Synthesis**: Web Speech API for voice output
- **Responsive Design**: Works on desktop and mobile
- **Accessibility**: WCAG compliant design

## 🎨 Customization

### Adding New Schemes
Edit `src/data/schemesData.js` to add more government schemes:
```javascript
{
  id: 6,
  title: "Your Scheme Name",
  titleHindi: "आपकी योजना का नाम",
  category: "Category",
  // ... other fields
}
```

### Adding New Languages
1. Add language pattern to `languagePatterns` object
2. Add language name to `languageNames` object
3. Add greetings and follow-up questions
4. Update system prompts in `geminiApi.js`

### Styling
The chatbot uses Tailwind CSS classes. Main colors:
- Primary: `#1E90FF` (blue)
- Secondary: `#0271BC` (darker blue)
- Background: `#faf7f2` (warm white)

## 🚨 Browser Compatibility

### Required APIs
- **Web Speech API**: For voice features (Chrome, Edge, Safari)
- **Web Speech Synthesis**: For text-to-speech
- **Fetch API**: For Gemini API calls

### Supported Browsers
- Chrome 25+
- Edge 79+
- Safari 14.1+
- Firefox (limited speech support)

## 🔒 Privacy & Security

- No user data is stored locally
- Voice data is processed in real-time only
- API calls are made securely to Gemini
- No personal information is collected

## 🐛 Troubleshooting

### Voice Not Working
- Ensure browser supports Web Speech API
- Check microphone permissions
- Try refreshing the page

### API Errors
- Verify Gemini API key is correct
- Check network connection
- Fallback responses will be shown if API fails

### Language Detection Issues
- Try typing a few words in the target language
- Language detection improves with more text

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Ensure API key is correctly set
4. Test in different browsers

---

**YojnaSaathi** - Empowering citizens with accessible, multilingual government scheme assistance! 🇮🇳

