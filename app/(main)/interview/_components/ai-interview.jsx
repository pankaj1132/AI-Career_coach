"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { continueAIInterview, finishAIInterview } from "@/actions/ai-interview";

export default function AIInterview() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I'm your AI interviewer. Tell me briefly about yourself and the kind of roles you're targeting.",
    },
  ]);
  const [input, setInput] = useState("");
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [ended, setEnded] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState(null);

  const {
    loading,
    fn: sendMessageFn,
    data: aiReply,
  } = useFetch(continueAIInterview);

  const {
    loading: finishing,
    fn: finishInterviewFn,
    data: finishData,
  } = useFetch(finishAIInterview);

  const handleSend = async () => {
    if (ended) return;
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newHistory = [...messages, { role: "user", content: trimmed }];
    setMessages(newHistory);
    setInput("");

    await sendMessageFn(newHistory, trimmed);
  };

  useEffect(() => {
    if (aiReply?.reply) {
      setMessages((prev) => [...prev, { role: "assistant", content: aiReply.reply }]);

      if (ttsEnabled && typeof window !== "undefined" && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(aiReply.reply);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [aiReply]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setVoiceSupported(true);
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? prev + " " + transcript : transcript));
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Unable to start camera", err);
      }
    };

    if (typeof window !== "undefined" && navigator?.mediaDevices) {
      startVideo();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!voiceSupported || !recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      window.speechSynthesis?.cancel();
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleEndInterview = async () => {
    if (ended) return;
    const history = messages;
    await finishInterviewFn(history);
    setEnded(true);
  };

  useEffect(() => {
    if (finishData?.feedback) {
      setFinalFeedback(finishData.feedback);
    }
  }, [finishData]);

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>AI Live Interview</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="md:w-1/3">
            <div className="overflow-hidden rounded-md border bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-48 w-full object-cover md:h-64"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Camera preview. Use voice or text below to answer.
            </p>
          </div>

          <div className="md:w-2/3">
            <div className="max-h-[480px] space-y-3 overflow-y-auto rounded-md bg-muted p-3 text-sm">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-left">{m.content}</p>
                  </div>
                </div>
              ))}
              {loading && <BarLoader className="mt-2" width={120} color="gray" />}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Textarea
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Speak or type your answer, then press Send..."
          />
          <div className="flex flex-wrap justify-end gap-2">
            {voiceSupported && !ended && (
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                onClick={toggleRecording}
              >
                {isRecording ? "Stop Recording" : "Start Voice Answer"}
              </Button>
            )}
            {!ended && (
              <Button onClick={handleSend} disabled={loading || !input.trim()}>
                {loading ? "Interviewing..." : "Send"}
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={handleEndInterview}
              disabled={finishing || ended}
            >
              {endingLabel(finishing, ended)}
            </Button>
          </div>
        </div>

        {finalFeedback && (
          <div className="mt-4 rounded-md border bg-muted/40 p-4 text-sm">
            <h2 className="mb-2 text-base font-semibold">AI Interview Feedback</h2>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {finalFeedback}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function endingLabel(finishing, ended) {
  if (ended) return "Interview Ended";
  if (finishing) return "Saving feedback...";
  return "End Interview & Get Feedback";
}
