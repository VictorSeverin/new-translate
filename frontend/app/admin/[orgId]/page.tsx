"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Clock, FileText, Users } from "lucide-react";

// Mock organization data
const getOrgData = (id: string) => ({
  id,
  name:
    id === "org-1"
      ? "Acme Corporation"
      : id === "org-2"
      ? "Globex Industries"
      : id === "org-3"
      ? "Initech LLC"
      : id === "org-4"
      ? "Umbrella Corp"
      : id === "org-5"
      ? "Stark Industries"
      : "Unknown Organization",
  logo: "/placeholder.svg?height=40&width=40",
  usageThisMonth: 1250,
  usageLimit: 3000,
  activeUsers: 42,
  totalSessions: 156,
  averageSessionLength: 18,
  lastUsed: "2023-06-15T14:30:00Z",
});

// Mock transcripts data
const transcripts = [
  {
    id: "tr-1",
    name: "Marketing Conference",
    date: "2023-06-18T13:25:00Z",
    duration: 45,
    languages: ["English", "Spanish"],
  },
  {
    id: "tr-2",
    name: "Product Demo",
    date: "2023-06-17T10:15:00Z",
    duration: 30,
    languages: ["English", "French"],
  },
  {
    id: "tr-3",
    name: "Investor Meeting",
    date: "2023-06-16T09:30:00Z",
    duration: 60,
    languages: ["English", "German"],
  },
  {
    id: "tr-4",
    name: "Team Standup",
    date: "2023-06-15T14:00:00Z",
    duration: 15,
    languages: ["English", "Chinese"],
  },
  {
    id: "tr-5",
    name: "Customer Interview",
    date: "2023-06-14T11:45:00Z",
    duration: 25,
    languages: ["English", "Spanish"],
  },
];

export default function OrgDashboard() {
  const params = useParams();
  const orgId = params.orgId as string;
  const org = getOrgData(orgId);

  const [activeTab, setActiveTab] = useState("overview");

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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organizations
        </Link>

        <div className="flex items-center gap-4">
          <img
            src={org.logo || "/placeholder.svg"}
            alt={`${org.name} logo`}
            className="w-12 h-12 rounded-md"
          />
          <div>
            <h1 className="text-3xl font-bold">{org.name}</h1>
            <p className="text-muted-foreground">Organization ID: {org.id}</p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  Usage This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {org.usageThisMonth} minutes
                </div>
                <p className="text-xs text-muted-foreground">
                  of {org.usageLimit} minute limit
                </p>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${Math.min(
                        Math.round((org.usageThisMonth / org.usageLimit) * 100),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{org.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  across {org.totalSessions} sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
                  Average Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {org.averageSessionLength} minutes
                </div>
                <p className="text-xs text-muted-foreground">
                  per translation session
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Recent translation sessions for this organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transcripts.slice(0, 3).map((transcript) => (
                  <div
                    key={transcript.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium">{transcript.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transcript.date)} • {transcript.duration}{" "}
                        minutes
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {transcript.languages.map((lang) => (
                        <span
                          key={lang}
                          className="text-xs bg-muted px-2 py-1 rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Manage your organization&apos;s translation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Default Languages</h3>
                <p className="text-sm text-muted-foreground">
                  Configure the default source and target languages for new
                  sessions
                </p>
                <div className="flex gap-4">
                  <Button variant="outline">Configure Languages</Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Usage Limits</h3>
                <p className="text-sm text-muted-foreground">
                  Set monthly usage limits and alerts
                </p>
                <div className="flex gap-4">
                  <Button variant="outline">Manage Limits</Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">User Access</h3>
                <p className="text-sm text-muted-foreground">
                  Manage who can create and view translation sessions
                </p>
                <div className="flex gap-4">
                  <Button variant="outline">Manage Users</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                View the current status of translation services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Translation API</h3>
                    <p className="text-sm text-muted-foreground">
                      Core translation service
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Operational
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Speech Recognition</h3>
                    <p className="text-sm text-muted-foreground">
                      Voice transcription service
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Operational
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">WebSocket Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time communication
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Degraded
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Storage Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Transcript storage and retrieval
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Operational
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Currently active translation sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Webinar</h3>
                    <p className="text-sm text-muted-foreground">
                      Started 15 minutes ago
                    </p>
                  </div>
                  <Link href="/live/session-123">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Executive Meeting</h3>
                    <p className="text-sm text-muted-foreground">
                      Started 32 minutes ago
                    </p>
                  </div>
                  <Link href="/live/session-456">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcripts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Transcripts</CardTitle>
              <CardDescription>
                View and manage past translation sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transcripts.map((transcript) => (
                  <div
                    key={transcript.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium">{transcript.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transcript.date)} • {transcript.duration}{" "}
                        minutes
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                        {transcript.languages.map((lang) => (
                          <span
                            key={lang}
                            className="text-xs bg-muted px-2 py-1 rounded-full"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/admin/${orgId}/transcripts/${transcript.id}`}
                      >
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
