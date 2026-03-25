// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import {
  BookOpen,
  LogOut,
  User,
  Mail,
  Calendar,
  Settings,
  Bell,
  Search,
  Plus,
  FileText,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
  Activity,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified?: boolean;
  image?: string;
  createdAt?: string;
}

interface Stats {
  totalNotes: number;
  totalStudyHours: number;
  activeProjects: number;
  completionRate: number;
}

interface RecentActivity {
  id: string;
  type: "note" | "study" | "project" | "achievement";
  title: string;
  timestamp: string;
  description?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalNotes: 0,
    totalStudyHours: 0,
    activeProjects: 0,
    completionRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await authClient.getSession();
      if (!session.data?.user) {
        router.push("/auth/sign-in");
        return;
      }
      setUser(session.data.user);
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/auth/sign-in");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    // Simulate fetching data from your API
    // Replace with actual API calls
    setTimeout(() => {
      setStats({
        totalNotes: 42,
        totalStudyHours: 128,
        activeProjects: 3,
        completionRate: 78,
      });

      setRecentActivity([
        {
          id: "1",
          type: "note",
          title: "Created new study notes",
          description: "Advanced React Patterns",
          timestamp: "2 hours ago",
        },
        {
          id: "2",
          type: "study",
          title: "Completed study session",
          description: "Database Design - 2 hours",
          timestamp: "Yesterday",
        },
        {
          id: "3",
          type: "project",
          title: "Started new project",
          description: "AI Study Assistant",
          timestamp: "2 days ago",
        },
        {
          id: "4",
          type: "achievement",
          title: "Earned achievement",
          description: "7-day study streak!",
          timestamp: "3 days ago",
        },
      ]);
    }, 1000);
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "note":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "study":
        return <Clock className="w-4 h-4 text-green-500" />;
      case "project":
        return <Users className="w-4 h-4 text-purple-500" />;
      case "achievement":
        return <Sparkles className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">StudySync</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search notes, projects..."
                  className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="relative group">
                <button className="flex items-center space-x-3 p-2 hover:bg-secondary rounded-lg transition-colors">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || user.email}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium">
                    {user?.name || user?.email?.split("@")[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <hr className="my-2 border-border" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {getGreeting()}, {user?.name || user?.email?.split("@")[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your studies today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-primary" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{stats.totalNotes}</h3>
            <p className="text-sm text-muted-foreground mt-1">Total Notes</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-blue-500" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{stats.totalStudyHours}</h3>
            <p className="text-sm text-muted-foreground mt-1">Study Hours</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{stats.activeProjects}</h3>
            <p className="text-sm text-muted-foreground mt-1">Active Projects</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{stats.completionRate}%</h3>
            <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
                <Link
                  href="/dashboard/activity"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 hover:bg-secondary/50 rounded-xl transition-colors"
                  >
                    <div className="p-2 bg-secondary rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors group">
                  <div className="flex items-center space-x-3">
                    <Plus className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">New Note</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-colors group">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-foreground">Start Study Session</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-colors group">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="font-medium text-foreground">Create Study Group</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-colors group">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-foreground">Schedule Session</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notes Section */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Notes</h2>
            <Link
              href="/dashboard/notes"
              className="text-sm text-primary hover:underline flex items-center"
            >
              View all notes
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
                <h3 className="font-medium text-foreground mb-1">
                  Advanced React Patterns
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Understanding hooks, context, and performance optimization techniques...
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}