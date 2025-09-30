import 'package:flutter/material.dart';
import 'voice_chat_multilingual.dart'; // 👈 make sure path is correct

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Multilingual Voice Chatbot',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const VoiceChatMultilingual(), // 👈 your screen
    );
  }
}