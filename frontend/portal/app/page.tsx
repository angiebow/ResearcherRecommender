'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import ResearcherCard, { ResearcherCardSkeleton } from '@/components/researcher-card';

type Researcher = {
  name: string;
  score: number;
  faculty: string;
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
            <SelectTrigger className="bg-slate-800 border-slate-700 h-12 text-md"><SelectValue /></SelectTrigger>
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
            <SelectTrigger className="bg-slate-800 border-slate-700 h-12 text-md"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Cosine Similarity">Cosine Similarity</SelectItem>
              <SelectItem value="Hamming">Hamming</SelectItem>
              <SelectItem value="Jaccard">Jaccard</SelectItem>
              <SelectItem value="Minkowski">Minkowski</SelectItem>
              <SelectItem value="Kullback-Leibler">Kullback-Leibler</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex w-full items-center space-x-2 mb-10">
        <Input
          type="text"
          placeholder="Input Topic"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-slate-800 border-slate-700 h-12 text-md"
        />
        <Button size="lg" onClick={handleSearch} disabled={isLoading} className="h-12">
          <Search className="mr-2 h-5 w-5" /> Search
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          Array.from({ length: 6 }).map((_, i) => <ResearcherCardSkeleton key={i} />)
        )}
        {!isLoading && results.map((researcher, index) => (
          <ResearcherCard
            key={index}
            rank={index + 1}
            name={researcher.name}
            score={researcher.score}
            faculty={researcher.faculty}
            metric={metric} 
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
    </div>
  );
}