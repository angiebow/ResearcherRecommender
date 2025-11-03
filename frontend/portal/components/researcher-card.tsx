import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb } from "lucide-react";

interface ResearcherCardProps {
  rank: number;
  name: string;
  score: number;
  faculty: string;
  metric: string;
  focus_topic: string;
}

export default function ResearcherCard({ rank, name, score, faculty, metric, focus_topic }: ResearcherCardProps) {
  const isDistanceMetric = ['Minkowski', 'Kullback-Leibler'].includes(metric);
  const scoreLabel = isDistanceMetric ? "Distance" : "Similarity Score";
  const scoreSuffix = isDistanceMetric ? "(Lower is better)" : "(Higher is better)";

  return (
    <Card className="bg-slate-950 border-slate-800 hover:border-blue-500 transition-colors flex flex-col justify-between">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant="secondary">#{rank}</Badge>
        </div>
        <CardDescription>{faculty}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start text-sm mb-4">
          <Lightbulb className="w-4 h-4 mr-2 mt-0.5 text-yellow-400 flex-shrink-0" />
          <span className="text-slate-400">
            Focus: <span className="text-white">{focus_topic}</span>
          </span>
        </div>

        <div className="text-sm">
          {scoreLabel}: 
          <span className="font-bold text-blue-400 ml-2">{score.toFixed(4)}</span>
          <p className="text-xs text-slate-500 mt-1">{scoreSuffix}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResearcherCardSkeleton() {
  return (
    <div className="p-6 bg-slate-950 border border-slate-800 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-8" />
      </div>
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}