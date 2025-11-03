'use client';
        
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, Building } from 'lucide-react';

type ResearcherInfo = {
  name: string;
  research_center: string;
  focus_topics: string[];
};

type DepartmentData = {
  [departmentName: string]: ResearcherInfo[];
};

type FacultyData = {
  faculty: string;
  departments: DepartmentData;
};

export default function FacultyPage() {
  const [faculties, setFaculties] = useState<string[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListLoading, setIsListLoading] = useState<boolean>(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch(`${apiUrl}/faculties`);
        const data = await response.json();
        setFaculties(data.faculties);
      } catch (error) {
        console.error("Failed to fetch faculties:", error);
      } finally {
        setIsListLoading(false);
      }
    };
    fetchFaculties();
  }, [apiUrl]);

  const handleFacultyChange = async (facultyName: string) => {
    if (!facultyName) return;

    setSelectedFaculty(facultyName);
    setIsLoading(true);
    setFacultyData(null);
    try {
      const response = await fetch(`${apiUrl}/faculty-data/${facultyName}`);
      const data = await response.json();
      setFacultyData(data);
    } catch (error) {
      console.error("Failed to fetch faculty data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Browse by Faculty</h1>
      <p className="text-slate-400 mb-8">Select a faculty to see all departments and researchers.</p>

      {isListLoading ? (
        <Skeleton className="h-12 w-full md:w-1/2" />
      ) : (
        <Select onValueChange={handleFacultyChange}>
          <SelectTrigger className="bg-slate-800 border-slate-700 h-12 text-md w-full md:w-1/2">
            <SelectValue placeholder="Select a Faculty..." />
          </SelectTrigger>
          <SelectContent>
            {faculties.map(fac => (
              <SelectItem key={fac} value={fac}>{fac}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="mt-10">
        {isLoading && <p className="text-slate-400">Loading researchers...</p>}
        
        {facultyData && (
          <div className="space-y-8">
            {Object.entries(facultyData.departments).sort((a,b) => a[0].localeCompare(b[0])).map(([departmentName, researchers]) => (
              <div key={departmentName}>
                <h2 className="text-2xl font-semibold text-blue-400 mb-4">{departmentName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {researchers.map(researcher => (
                    <Card key={researcher.name} className="bg-slate-950 border-slate-800 flex flex-col justify-between">
                      <CardHeader>
                        <CardTitle className="text-lg">{researcher.name}</CardTitle>
                        <CardDescription className="flex items-center text-xs pt-1">
                          <Building className="w-4 h-4 mr-2 flex-shrink-0" /> {researcher.research_center}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm mb-2">
                          <Lightbulb className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" />
                          <span className="text-slate-400">Focus Topics:</span>
                        </div>
                        {researcher.focus_topics.length > 0 ? (
                          <ul className="list-disc list-inside text-sm text-white pl-2">
                            {researcher.focus_topics.map((topic, i) => <li key={i}>{topic}</li>)}
                          </ul>
                        ) : <p className="text-sm text-slate-500 pl-2">N/A</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}