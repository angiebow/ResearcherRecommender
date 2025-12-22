import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, Building, School, User } from "lucide-react"; 

interface ResearcherCardProps {
  rank: number;
  name: string;
  score: number;
  //faculty: string;
  //department: string;
  //research_center: string;
  metric: string;
  //focus_topics: string[];
}

export default function ResearcherCard({ 
  rank, name, score, 
  //faculty, department, 
  //research_center,
   metric, 
  //focus_topics 
}: ResearcherCardProps) {
  
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
        {/* <CardDescription className="flex items-center text-xs pt-1">
          <School className="w-4 h-4 mr-2 flex-shrink-0" /> {faculty}
        </CardDescription>
        <CardDescription className="flex items-center text-xs">
          <User className="w-4 h-4 mr-2 flex-shrink-0" /> {department}
        </CardDescription> */}
        {/* <CardDescription className="flex items-center text-xs">
          <Building className="w-4 h-4 mr-2 flex-shrink-0" /> {research_center}
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center text-sm mb-2">
            <Lightbulb className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" />
            <span className="text-slate-400">Focus Topics:</span>
          </div>
          {/* {focus_topics && focus_topics.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-white pl-2">
              {focus_topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 pl-2">N/A</p>
          )} */}
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
      <Skeleton className="h-4 w-1/2 mb-2" /> 
      <Skeleton className="h-4 w-1/3 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      
      <Skeleton className="h-4 w-1/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-4" />

      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}