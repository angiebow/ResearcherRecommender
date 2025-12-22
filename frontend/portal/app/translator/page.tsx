'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft } from "lucide-react";

export default function TranslatorPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [direction, setDirection] = useState("id-en");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy text");
    }
  };

  const handleTranslate = async () => {
    setLoading(true);
    setResult("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_TRANSLATOR_API || "http://127.0.0.1:8001";
      const res = await fetch(`${apiUrl}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          direction,
        }),
      });

      const data = await res.json();
      setResult(data.translation);
    } catch (err) {
      setResult("Translation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Translator</h1>
      <p className="text-slate-400 mb-6">
        Translate text between Indonesian and English using Google Translator.
      </p>

      <div className="flex items-center gap-4 mb-4">
        <Select value={direction} onValueChange={setDirection}>
          <SelectTrigger className="w-[260px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id-en">Indonesian → English</SelectItem>
            <SelectItem value="en-id">English → Indonesian</SelectItem>
          </SelectContent>
        </Select>

        <ArrowRightLeft className="text-slate-400" />
      </div>

      <Textarea
        placeholder="Enter text to translate..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[150px] mb-4 bg-slate-800 border-slate-700"
      />

      <Button onClick={handleTranslate} disabled={loading || !text}>
        {loading ? "Translating..." : "Translate"}
      </Button>

{result && (
  <div className="mt-6 p-4 rounded-lg bg-slate-900 border border-slate-700 relative">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold">Translation Result</h3>

      <Button
        variant="secondary"
        size="sm"
        onClick={handleCopy}
        className="text-xs"
      >
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>

    <p className="text-slate-200 whitespace-pre-wrap">
      {result}
    </p>
  </div>
)}

    </div>
  );
}
