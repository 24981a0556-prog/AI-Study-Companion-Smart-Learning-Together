import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StreakCard } from "@/components/StreakCard";
import { ClassroomCard } from "@/components/ClassroomCard";
import { StatCard } from "@/components/StatCard";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  MessageCircle,
  ClipboardCheck,
  Users,
  Flame,
  Target,
  Award,
  Plus,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";

const Dashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: Target },
    { href: "/notes", label: "AI Notes", icon: FileText },
    { href: "/doubts", label: "Doubt Solver", icon: MessageCircle },
    { href: "/tests", label: "Mock Tests", icon: ClipboardCheck },
    { href: "/classrooms", label: "Classrooms", icon: Users },
  ];

  const quickActions = [
    { 
      label: "Generate Notes", 
      icon: FileText, 
      href: "/notes",
      color: "primary",
      description: "Create AI-powered study notes"
    },
    { 
      label: "Ask a Doubt", 
      icon: MessageCircle, 
      href: "/doubts",
      color: "accent",
      description: "Get instant AI explanations"
    },
    { 
      label: "Take Mock Test", 
      icon: ClipboardCheck, 
      href: "/tests",
      color: "success",
      description: "Practice with AI-generated tests"
    },
  ];

  const classrooms = [
    { name: "JEE Physics Masters", subject: "Physics", memberCount: 12, activeNow: 3, isOwner: true, progress: 72 },
    { name: "Chemistry Study Group", subject: "Chemistry", memberCount: 8, activeNow: 0, progress: 45 },
  ];

  const recentActivity = [
    { type: "notes", title: "Thermodynamics Notes", time: "2 hours ago" },
    { type: "test", title: "Physics Mock Test", time: "Yesterday", score: "85%" },
    { type: "doubt", title: "Integration by Parts", time: "2 days ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-16">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-secondary"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">StudyAI</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-secondary relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <Sparkles className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="font-display font-bold text-xl">StudyAI</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-medium">
                S
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Student Name</p>
                <p className="text-xs text-muted-foreground truncate">student@email.com</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1" asChild>
                <Link to="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <LogOut className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-6 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-display font-bold">Welcome back! 👋</h1>
            <p className="text-muted-foreground">Let's continue your learning journey</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 rounded-xl bg-secondary border-none text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              title="Study Streak" 
              value="12" 
              subtitle="days" 
              icon={Flame} 
              color="accent"
              trend={{ value: 20, positive: true }}
            />
            <StatCard 
              title="Notes Created" 
              value="47" 
              icon={FileText} 
              color="primary"
            />
            <StatCard 
              title="Tests Taken" 
              value="23" 
              icon={ClipboardCheck} 
              color="success"
            />
            <StatCard 
              title="Avg. Score" 
              value="82%" 
              icon={Award} 
              color="primary"
              trend={{ value: 5, positive: true }}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <div>
                <h2 className="text-lg font-display font-semibold mb-4">Quick Actions</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.div
                        key={action.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={action.href}
                          className="glass-card rounded-2xl p-6 block group hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                          <div className={`w-12 h-12 bg-gradient-to-br ${
                            action.color === 'primary' ? 'from-primary to-primary-glow shadow-primary/25' :
                            action.color === 'accent' ? 'from-accent to-amber-400 shadow-accent/25' :
                            'from-success to-emerald-400 shadow-success/25'
                          } rounded-xl flex items-center justify-center shadow-lg mb-4`}>
                            <Icon className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <h3 className="font-semibold mb-1">{action.label}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                          <ChevronRight className="w-5 h-5 text-muted-foreground mt-2 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Classrooms */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-display font-semibold">Your Classrooms</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/classrooms">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {classrooms.map((classroom, index) => (
                    <ClassroomCard key={index} {...classroom} />
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link
                      to="/classrooms/create"
                      className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[200px] border-2 border-dashed border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium">Create New Classroom</p>
                      <p className="text-sm text-muted-foreground">Start a study group</p>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Streak */}
              <StreakCard currentStreak={12} longestStreak={21} todayComplete={false} />

              {/* Recent Activity */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === 'notes' ? 'bg-primary/10' :
                        activity.type === 'test' ? 'bg-success/10' :
                        'bg-accent/10'
                      }`}>
                        {activity.type === 'notes' && <FileText className="w-5 h-5 text-primary" />}
                        {activity.type === 'test' && <ClipboardCheck className="w-5 h-5 text-success" />}
                        {activity.type === 'doubt' && <MessageCircle className="w-5 h-5 text-accent" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.score && (
                        <span className="text-sm font-medium text-success">{activity.score}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
