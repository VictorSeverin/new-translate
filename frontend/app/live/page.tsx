"use client";

import { useEffect, useState, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const languages = [
  { id: "en", name: "English" },
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
  { id: "de", name: "German" },
  { id: "zh", name: "Chinese" },
];

const fontOptions = [
  {
    id: "sans",
    name: "Sans-serif",
    value: "ui-sans-serif, system-ui, sans-serif",
  },
  { id: "serif", name: "Serif", value: "ui-serif, Georgia, Cambria, serif" },
  {
    id: "mono",
    name: "Monospace",
    value: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
];

export default function LiveTranslation({
  params,
}: {
  params: { id: string };
}) {
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);

  // Settings state
  const [fontSize, setFontSize] = useState(18);
  const [fontFamily, setFontFamily] = useState(fontOptions[0].id);

  const socketRef = useRef<WebSocket | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  /*useEffect(() => {
    // Create WebSocket connection to echo server with session ID in query param
    const socket = new WebSocket(
      `wss://echo.websocket.org?session=${params.id}`
    );

    socket.onopen = () => {
      console.log(`WebSocket connection established for session ${params.id}`);
      // Send initial message with session info and language preferences
      socket.send(
        JSON.stringify({
          type: "init",
          sessionId: params.id,
          sourceLanguage,
          targetLanguage,
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        // Mock response simulating server data
        // In production, parse event.data instead
        const mockResponse = {
          sourceText: `This is sample text in ${
            languages.find((l) => l.id === sourceLanguage)?.name
          } for session ${
            params.id
          }. It contains multiple sentences to demonstrate the word-by-word animation effect. The animation should look smooth and professional, similar to how Copilot displays text.`,
          translatedText: `This is sample text translated to ${
            languages.find((l) => l.id === targetLanguage)?.name
          } for session ${
            params.id
          }. It contains multiple sentences to demonstrate the word-by-word animation effect. The animation should look smooth and professional, similar to how Copilot displays text.`,
        };

        // Update source text immediately without animation
        setSourceText(mockResponse.sourceText);

        // Store full translated text and start word-by-word animation
        setTranslatedText(mockResponse.translatedText);
        animateWordByWord(mockResponse.translatedText);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Store socket reference for cleanup
    socketRef.current = socket;

    // Cleanup function to close socket and clear animations
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }

      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [sourceLanguage, targetLanguage, params.id]);

  // Send language preference updates to server
  useEffect(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "languageChange",
          sessionId: params.id,
          sourceLanguage,
          targetLanguage,
        })
      );
    }
  }, [sourceLanguage, targetLanguage, params.id]);*/

  // Animate text appearing word by word with fade-in effect
  const animateWordByWord = (text: string) => {
    // Clear any ongoing animation
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }

    // Reset the displayed words
    setDisplayedWords([]);

    // If there's no text, don't animate
    if (!text) return;

    // Split the text into words
    const words = text.split(/\s+/);
    let currentIndex = 0;

    // Function to add the next word
    const addNextWord = () => {
      if (currentIndex < words.length) {
        setDisplayedWords((prev) => [...prev, words[currentIndex]]);
        currentIndex++;

        // Schedule the next word with varying speed based on word length and punctuation
        const delay = calculateDelay(words[currentIndex - 1]);
        animationTimerRef.current = setTimeout(addNextWord, delay);
      }
    };

    // Start the animation
    addNextWord();
  };

  // Calculate delay based on word characteristics
  const calculateDelay = (word: string) => {
    // Base delay
    let delay = 100;

    // Longer words get slightly more time
    if (word && word.length > 5) {
      delay += 20;
    }

    // Words ending with punctuation get more time
    if (word && /[.!?;:]$/.test(word)) {
      delay += 200;
    }

    // Words with commas get a bit more time
    if (word && /,$/.test(word)) {
      delay += 100;
    }

    return delay;
  };

  // Get the selected font family value
  const getSelectedFontFamily = () => {
    return (
      fontOptions.find((font) => font.id === fontFamily)?.value ||
      fontOptions[0].value
    );
  };

  // Text style based on settings
  const textStyle = {
    fontSize: `${fontSize}px`,
    fontFamily: getSelectedFontFamily(),
  };

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Universal Settings Button */}
      <div className="absolute top-4 right-4 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Open settings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Text Settings</h3>

              <div className="space-y-2">
                <Label className="text-xs">Font Family</Label>
                <RadioGroup
                  value={fontFamily}
                  onValueChange={setFontFamily}
                  className="flex flex-col gap-2"
                >
                  {fontOptions.map((font) => (
                    <div key={font.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={font.id} id={`font-${font.id}`} />
                      <Label
                        htmlFor={`font-${font.id}`}
                        style={{ fontFamily: font.value }}
                        className="text-sm"
                      >
                        {font.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Font Size: {fontSize}px</Label>
                </div>
                <Slider
                  min={12}
                  max={32}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Small</span>
                  <span>Large</span>
                </div>
              </div>

              <div className="p-3 border rounded-md">
                <p style={textStyle} className="text-sm">
                  Preview text
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Source Panel */}
      <div className="flex flex-col w-1/2 h-full border-r">
        <div className="p-4 border-b">
          <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select source language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <Card className="w-full h-full p-4">
            <div style={textStyle}>
              {sourceText || (
                <span className="text-muted-foreground">
                  Waiting for text from server...
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Translation Panel */}
      <div className="flex flex-col w-1/2 h-full">
        <div className="p-4 border-b">
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select target language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <Card className="w-full h-full p-4">
            <div style={textStyle} className="space-x-1">
              {displayedWords.map((word, index) => (
                <span key={index} className="inline-block animate-fadeIn">
                  {word}
                </span>
              ))}
              {displayedWords.length > 0 &&
                displayedWords.length < translatedText.split(/\s+/).length && (
                  <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
                )}
              {displayedWords.length === 0 && (
                <span className="text-muted-foreground">
                  Waiting for translation...
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
