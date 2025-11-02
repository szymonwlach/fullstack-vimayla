"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Loader2, BookOpen, Clock, Users, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { LearningPathName } from "@/types";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import Link from "next/link";

export const LearningPaths = () => {
  const [learningPaths, setLearningPaths] = useState<LearningPathName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const { userId } = useAuth();

  const getPaths = async () => {
    setIsLoading(true);
    try {
      if (!userId) return;
      const response = await fetch(`/api/getPaths?userId=${userId}`, {
        method: "GET",
      });
      const data: LearningPathName[] = await response.json();
      setLearningPaths(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsFetched(true);
    }
  };

  useEffect(() => {
    if (userId) getPaths();
  }, [userId]);

  const numberOfPaths = () => {
    return learningPaths.length;
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">No learning paths yet</h3>
      <p className="text-muted-foreground max-w-md">
        You don't have any learning paths yet. Start your learning journey
        today!
      </p>

      <Link href="/dashboard/addRoad" className="mt-4">
        <Button className="cursor-pointer">
          {" "}
          <IconCirclePlusFilled />
          <span>Quick Create</span>
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Your learning paths</h2>
        <p className="text-muted-foreground">
          Manage your learning paths and track your progress
        </p>
      </div>

      {isLoading && !isFetched ? (
        <LoadingSkeleton />
      ) : isFetched && learningPaths.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths?.map((path, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105 border-2 hover:border-primary/20"
              // onClick={() => handlePathClick(path.learningPathsTitle)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {path.learningPathsTitle.charAt(0).toUpperCase() +
                        path.learningPathsTitle.slice(1)}
                    </CardTitle>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                <CardDescription className="line-clamp-2">
                  {path.ai_description}
                  {/* Odkryj wszystko co musisz wiedzieć o{" "} */}
                  {path.learningPathsTitle.toLowerCase()}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>~4-6 weeks {path.estimed_time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>1.2k users</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{path.startLevel}</Badge>
                  <Badge variant="outline">Popular</Badge>
                </div>

                <Button
                  variant="outline"
                  className="w-full hover:bg-primary group-hover:text-black hover:text-slate-200 duration-300 dark:group-hover:text-slate-200 dark:hover:bg-gray-300 dark:hover:text-black cursor-pointer  transition-all "
                  onClick={(e) => {
                    e.stopPropagation();
                    // handlePathClick(path.learningPathsTitle);
                  }}
                >
                  Start learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isFetched && learningPaths.length > 0 && (
        <div className="mt-8 text-center">
          {" "}
          <p className="text-muted-foreground">
            We found {numberOfPaths()} learning{" "}
            {numberOfPaths() === 1 ? "path" : "paths"}
          </p>
        </div>
      )}
    </div>
  );
};
