'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import ResearcherCard, { ResearcherCardSkeleton } from '@/components/researcher-card';
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Researcher = {
  name: string;
  score: number;
  faculty: string;
  department: string;
  research_center: string;
  focus_topics: string[];
};

export default function RecommenderPage() {
  const [query, setQuery] = useState<string>(''); 
  const [model, setModel] = useState<string>('BERT'); 
  const [metric, setMetric] = useState<string>('Cosine Similarity'); 
  const [results, setResults] = useState<Researcher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: query, model: model, metric: metric }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data.recommendations);

    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
       <h1 className="text-3xl font-bold mb-2">Researcher Recommendation</h1>
      <p className="text-slate-400 mb-8">Enter a research topic to find the most relevant experts from the institution.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Select Model</label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger
              className="
                h-12 text-md
                bg-white border-gray-300 text-gray-900
                dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100
              "
            >
            <SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BERT">BERT</SelectItem>
              <SelectItem value="DistilBERT">DistilBERT</SelectItem>
              <SelectItem value="Albert">Albert</SelectItem>
              <SelectItem value="XLNet">XLNet</SelectItem>
              <SelectItem value="MPNet">MPNet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Select Metric</label>
          <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger
            className="
              h-12 text-md
              bg-white border-gray-300 text-gray-900
              dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100
            "
          >
          <SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Cosine Similarity">Cosine</SelectItem>
              <SelectItem value="Hamming">Hamming</SelectItem>
              <SelectItem value="Jaccard">Jaccard</SelectItem>
              <SelectItem value="Minkowski">Minkowski</SelectItem>
              <SelectItem value="Kullback-Leibler">Kullback-Leibler</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex w-full items-start gap-2 mb-10">
        <Textarea
          placeholder="Input Topic in English"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            flex-1 min-w-0 w-full min-h-[120px] resize-none text-md
            bg-white border-gray-300 text-gray-900
            dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100
          "
        />

        <Button
          size="lg"
          onClick={handleSearch}
          disabled={isLoading}
          className="h-12 mt-1 shrink-0"
        >
          <Search className="mr-2 h-5 w-5" /> Search
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {isLoading && (
          Array.from({ length: 8 }).map((_, i) => <ResearcherCardSkeleton key={i} />)
        )}
        {!isLoading && results.map((researcher, index) => (
          <ResearcherCard
            key={index}
            rank={index + 1}
            name={researcher.name}
            score={researcher.score}
            //faculty={researcher.faculty}
            //department={researcher.department}
            //research_center={researcher.research_center}
            metric={metric} 
            //focus_topics={researcher.focus_topics}
          />
        ))}
      </div>
      
      {!isLoading && hasSearched && results.length === 0 && (
          <div className="col-span-3 text-center py-10">
            {hasSearched ? 
              <p className="text-slate-500">No results found. Please try a different query.</p> :
              <p className="text-slate-500">Please enter a topic to begin your search.</p>
            }
          </div>
      )}

            <Accordion type="multiple" className="mb-10">
        {/* NDCG@5 */}
        <AccordionItem value="ndcg">
          <AccordionTrigger className="text-lg font-semibold">
            NDCG@5 – Recommended Configuration
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto">
              <table className="
                w-full text-sm rounded-lg border
                border-gray-300 dark:border-slate-700
              ">
                <thead className="
                  bg-gray-100 text-gray-700
                  dark:bg-slate-800 dark:text-slate-300
                ">
                  <tr>
                    <th className="px-3 py-2 text-left">Rank</th>
                    <th className="px-3 py-2 text-left">Model</th>
                    <th className="px-3 py-2 text-left">Metric</th>
                    <th className="px-3 py-2 text-left">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [1, "MPNet", "Minkowski", 0.2827],
                    [2, "MPNet", "KL Divergence", 0.2729],
                    [3, "MPNet", "Cosine", 0.2504],
                    [4, "MPNet", "Jaccard", 0.2375],
                    [5, "MPNet", "Hamming", 0.2354],
                    [6, "DistilBERT", "Minkowski", 0.1116],
                    [7, "DistilBERT", "KL Divergence", 0.1081],
                    [8, "DistilBERT", "Jaccard", 0.1016],
                    [9, "DistilBERT", "Hamming", 0.093],
                    [10, "DistilBERT", "Cosine", 0.0752],
                  ].map(([rank, model, metric, score]) => (
                    <tr key={rank} className="border-t border-slate-700">
                      <td className="px-3 py-2">{rank}</td>
                      <td className="px-3 py-2">{model}</td>
                      <td className="px-3 py-2">{metric}</td>
                      <td className="px-3 py-2">{score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* MAP@5 */}
        <AccordionItem value="map">
          <AccordionTrigger className="text-lg font-semibold">
            MAP@5 - Recommended Configuration
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto">
              <table className="
                w-full text-sm rounded-lg border
                border-gray-300 dark:border-slate-700
              ">
                <thead className="
                  bg-gray-100 text-gray-700
                  dark:bg-slate-800 dark:text-slate-300
                ">
                  <tr>
                    <th className="px-3 py-2 text-left">Rank</th>
                    <th className="px-3 py-2 text-left">Model</th>
                    <th className="px-3 py-2 text-left">Metric</th>
                    <th className="px-3 py-2 text-left">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [1, "MPNet", "Minkowski", 0.2253],
                    [2, "MPNet", "KL Divergence", 0.2187],
                    [3, "MPNet", "Cosine", 0.2013],
                    [4, "MPNet", "Hamming", 0.1873],
                    [5, "MPNet", "Jaccard", 0.1837],
                    [6, "DistilBERT", "KL Divergence", 0.0913],
                    [7, "DistilBERT", "Minkowski", 0.089],
                    [8, "DistilBERT", "Jaccard", 0.0757],
                    [9, "DistilBERT", "Cosine", 0.0667],
                    [10, "DistilBERT", "Hamming", 0.064],
                  ].map(([rank, model, metric, score]) => (
                    <tr key={rank} className="border-t border-slate-700">
                      <td className="px-3 py-2">{rank}</td>
                      <td className="px-3 py-2">{model}</td>
                      <td className="px-3 py-2">{metric}</td>
                      <td className="px-3 py-2">{score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}