import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:audioplayers/audioplayers.dart';
import 'package:path_provider/path_provider.dart';

class VoiceChatMultilingual extends StatefulWidget {
  const VoiceChatMultilingual({super.key});

  @override
  State<VoiceChatMultilingual> createState() => _VoiceChatMultilingualState();
}

class _VoiceChatMultilingualState extends State<VoiceChatMultilingual> {
  // 🔑 Replace with your real keys
  static const String bhashiniApiToken = '';
  static const String openAIApiKey = '';
  // UI / State
  final TextEditingController _textController = TextEditingController();
  final List<Map<String, String>> _messages = []; // {role: user|assistant, text: ...}
  bool _isLoading = false;

  // Audio
  final AudioPlayer _audioPlayer = AudioPlayer();

  // STT
  late stt.SpeechToText _speech;
  bool _isListening = false;
  String _spokenText = '';

  // Languages (source = user language)
  final List<Map<String, String>> _languages = const [
    {'name': 'Hindi', 'code': 'hi'},
    {'name': 'Gujarati', 'code': 'gu'},
    {'name': 'Marathi', 'code': 'mr'},
    {'name': 'Bengali', 'code': 'bn'},
    {'name': 'Tamil', 'code': 'ta'},
    {'name': 'Telugu', 'code': 'te'},
    {'name': 'Kannada', 'code': 'kn'},
    {'name': 'Malayalam', 'code': 'ml'},
    {'name': 'Punjabi', 'code': 'pa'},
    {'name': 'Urdu', 'code': 'ur'},
    {'name': 'English', 'code': 'en'},
  ];
  String _sourceLangCode = 'hi'; // user picks this

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  // ---------- STT ----------
  String _sttLocaleFor(String lang) {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'gu': return 'gu-IN';
      case 'mr': return 'mr-IN';
      case 'bn': return 'bn-IN';
      case 'ta': return 'ta-IN';
      case 'te': return 'te-IN';
      case 'kn': return 'kn-IN';
      case 'ml': return 'ml-IN';
      case 'pa': return 'pa-IN';
      case 'ur': return 'ur-IN';
      case 'en':
      default:
        return 'en-US';
    }
  }

  Future<void> _startListening() async {
    final available = await _speech.initialize(
      onError: (e) => debugPrint('STT error: $e'),
      onStatus: (s) => debugPrint('STT status: $s'),
    );
    if (available) {
      setState(() { _isListening = true; _spokenText = ''; });
      _speech.listen(
        localeId: _sttLocaleFor(_sourceLangCode),
        onResult: (r) => setState(() => _spokenText = r.recognizedWords),
      );
    }
  }

  void _stopListening() {
    _speech.stop();
    setState(() => _isListening = false);
  }

  // ---------- BHASHINI: Translation ----------
  Future<String> _bhashiniTranslate({
    required String text,
    required String from,
    required String to,
  }) async {
    if (text.trim().isEmpty) return '';
    if (from == to) return text;

    final url = Uri.parse('https://dhruva-api.bhashini.gov.in/services/inference/pipeline');
    final headers = {
      'Content-Type': 'application/json',
      'Authorization': bhashiniApiToken,
    };
    final body = jsonEncode({
      "pipelineTasks": [
        {
          "taskType": "translation",
          "config": {
            "language": {"sourceLanguage": from, "targetLanguage": to}
          }
        }
      ],
      "inputData": {
        "input": [
          {"source": text}
        ]
      }
    });

    final resp = await http.post(url, headers: headers, body: body);
    if (resp.statusCode != 200) {
      throw Exception('Translation failed: ${resp.body}');
    }
    final jsonData = jsonDecode(resp.body);
    final out = jsonData['pipelineResponse']?[0]?['output'];
    if (out is List && out.isNotEmpty) {
      return out[0]['target'] ?? '';
    }
    return '';
  }

  // ---------- BHASHINI: TTS ----------
  Future<void> _bhashiniSpeak(String text, String langCode) async {
    if (text.trim().isEmpty) return;

    final url = Uri.parse('https://dhruva-api.bhashini.gov.in/services/inference/pipeline');
    final headers = {
      'Content-Type': 'application/json',
      'Authorization': bhashiniApiToken,
    };
    final body = jsonEncode({
      "pipelineTasks": [
        {
          "taskType": "tts",
          "config": {
            "language": {"sourceLanguage": langCode},
            "gender": "female",
            "samplingRate": 8000
          }
        }
      ],
      "inputData": {
        "input": [
          {"source": text}
        ]
      }
    });

    final resp = await http.post(url, headers: headers, body: body);
    if (resp.statusCode != 200) {
      debugPrint('TTS failed: ${resp.body}');
      return;
    }
    final data = jsonDecode(resp.body);
    final base64Audio = data["pipelineResponse"]?[0]?["audio"]?[0]?["audioContent"];
    if (base64Audio == null) return;

    final bytes = base64Decode(base64Audio);
    final dir = await getTemporaryDirectory();
    final path = '${dir.path}/bhashini_tts_${DateTime.now().millisecondsSinceEpoch}.wav';
    final f = File(path);
    await f.writeAsBytes(bytes);
    await _audioPlayer.stop();
    await _audioPlayer.play(DeviceFileSource(path));
  }

  // ---------- OpenAI Chat ----------
  Future<String> _chatWithOpenAI(String englishPrompt) async {
    final uri = Uri.parse('https://api.openai.com/v1/chat/completions');
    final headers = {
      'Authorization': 'Bearer $openAIApiKey',
      'Content-Type': 'application/json',
    };
    final body = jsonEncode({
      "model": "gpt-3.5-turbo", // or "gpt-4o-mini" if you have access
      "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": englishPrompt},
      ],
      "temperature": 0.7,
    });

    final resp = await http.post(uri, headers: headers, body: body);
    if (resp.statusCode != 200) {
      throw Exception('OpenAI error: ${resp.body}');
    }
    final data = jsonDecode(resp.body);
    final reply = data['choices'][0]['message']['content'];
    return reply ?? '';
  }

  // ---------- Orchestrator ----------
  Future<void> _sendMessage() async {
    try {
      final rawInput = _spokenText.isNotEmpty ? _spokenText : _textController.text;
      if (rawInput.trim().isEmpty) return;

      setState(() {
        _isLoading = true;
        _messages.add({"role": "user", "text": rawInput});
        _textController.clear();
        _spokenText = '';
      });

      // 1) Source -> English (brain language)
      final toEnglish = await _bhashiniTranslate(text: rawInput, from: _sourceLangCode, to: 'en');

      // 2) Ask OpenAI in English
      final replyEn = await _chatWithOpenAI(toEnglish.isEmpty ? rawInput : toEnglish);

      // 3) English -> Source language
      final replyUserLang = await _bhashiniTranslate(text: replyEn, from: 'en', to: _sourceLangCode);

      setState(() {
        _messages.add({"role": "assistant", "text": replyUserLang.isEmpty ? replyEn : replyUserLang});
      });

      // 4) Speak back in user's language
      await _bhashiniSpeak(replyUserLang.isEmpty ? replyEn : replyUserLang, _sourceLangCode);
    } catch (e) {
      setState(() {
        _messages.add({"role": "assistant", "text": "Error: $e"});
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  // ---------- UI ----------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Multilingual Voice Chatbot'),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _sourceLangCode,
                items: _languages.map((l) =>
                    DropdownMenuItem(value: l['code'], child: Text(l['name']!))
                ).toList(),
                onChanged: (v) => setState(() => _sourceLangCode = v ?? 'en'),
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              itemCount: _messages.length,
              itemBuilder: (_, i) {
                final m = _messages[i];
                final isUser = m['role'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isUser ? Colors.blue.shade100 : Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(m['text'] ?? ''),
                  ),
                );
              },
            ),
          ),
          if (_spokenText.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: Row(
                children: [
                  const Icon(Icons.record_voice_over),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _spokenText,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
            child: Row(
              children: [
                // Mic
                IconButton(
                  icon: Icon(_isListening ? Icons.mic_off : Icons.mic),
                  onPressed: _isListening ? _stopListening : _startListening,
                  tooltip: _isListening ? 'Stop' : 'Speak',
                ),
                // Text input
                Expanded(
                  child: TextField(
                    controller: _textController,
                    decoration: const InputDecoration(
                      hintText: 'Type your message or use mic…',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                // Send
                ElevatedButton.icon(
                  onPressed: _isLoading ? null : _sendMessage,
                  icon: _isLoading
                      ? const SizedBox(
                    height: 16, width: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                      : const Icon(Icons.send),
                  label: Text(_isLoading ? 'Working…' : 'Ask'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

}
