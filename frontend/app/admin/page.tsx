"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock organization data
const organizations = [
  {
    id: "org-1",
    name: "Acme Corporation",
    logo: "/placeholder.svg?height=40&width=40",
    usageThisMonth: 1250,
    usageLimit: 3000,
    lastUsed: "2023-06-15T14:30:00Z",
  },
  {
    id: "org-2",
    name: "Globex Industries",
    logo: "/placeholder.svg?height=40&width=40",
    usageThisMonth: 2800,
    usageLimit: 3000,
    lastUsed: "2023-06-18T09:45:00Z",
  },
  {
    id: "org-3",
    name: "Initech LLC",
    logo: "/placeholder.svg?height=40&width=40",
    usageThisMonth: 750,
    usageLimit: 2000,
    lastUsed: "2023-06-17T16:20:00Z",
  },
  {
    id: "org-4",
    name: "Umbrella Corp",
    logo: "/placeholder.svg?height=40&width=40",
    usageThisMonth: 1500,
    usageLimit: 2500,
    lastUsed: "2023-06-16T11:10:00Z",
  },
  {
    id: "org-5",
    name: "Stark Industries",
    logo: "/placeholder.svg?height=40&width=40",
    usageThisMonth: 2100,
    usageLimit: 5000,
    lastUsed: "2023-06-18T13:25:00Z",
  },
];

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter organizations based on search query
  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Calculate usage percentage
  const calculateUsagePercentage = (used: number, limit: number) => {
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  // Determine usage color based on percentage
  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Translation Admin Dashboard</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search organizations..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrgs.map((org) => (
          <Link
            href={`/admin/${org.id}`}
            key={org.id}
            className="block transition-transform hover:scale-[1.02]"
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <img
                  src={org.logo || "/placeholder.svg"}
                  alt={`${org.name} logo`}
                  className="w-10 h-10 rounded-md"
                />
                <div>
                  <CardTitle>{org.name}</CardTitle>
                  <CardDescription>Organization ID: {org.id}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Usage this month</span>
                      <span>
                        {org.usageThisMonth} / {org.usageLimit} minutes
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getUsageColor(
                          calculateUsagePercentage(
                            org.usageThisMonth,
                            org.usageLimit
                          )
                        )}`}
                        style={{
                          width: `${calculateUsagePercentage(
                            org.usageThisMonth,
                            org.usageLimit
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Last used: {formatDate(org.lastUsed)}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
