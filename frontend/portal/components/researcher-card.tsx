import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ResearcherCardProps {
  rank: number;
  name: string;
  score: number;
  faculty: string;
}

export default function ResearcherCard({ rank, name, score, faculty }: ResearcherCardProps) {
  return (
    <Card className="bg-slate-950 border-slate-800 hover:border-blue-500 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant="secondary">#{rank}</Badge>
        </div>
        <CardDescription>{faculty}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          Similarity Score: 
          <span className="font-bold text-blue-400 ml-2">{score.toFixed(4)}</span>
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