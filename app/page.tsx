"use client";

import { useState, useRef } from "react";

export default function DentalScribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState("");

  const handleRecording = async () => {
    if (!isRecording) {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'audio.webm');

          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            console.error('Transcription failed', await res.text());
            return;
          }

          const data = await res.json();
          setClinicalNotes(data.note ?? data.text ?? '');
        } catch (err) {
          console.error('Transcription error', err);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } else {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Dental Scribe App</h1>

      <button
        onClick={handleRecording}
        className={`px-6 py-3 text-white font-semibold rounded-md transition-colors ${
          isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Clinical Session"}
      </button>

      {audioURL && (
        <audio
          className="mt-6"
          controls
          src={audioURL}
        />
      )}

      <div className="w-full max-w-2xl mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Notes</label>
        <textarea
          className="w-full p-3 rounded-md border border-gray-300 bg-white text-sm"
          rows={6}
          value={clinicalNotes}
          onChange={(e) => setClinicalNotes(e.target.value)}
          placeholder="Transcription will appear here after you stop recording..."
        />
      </div>
    </div>
  );
}