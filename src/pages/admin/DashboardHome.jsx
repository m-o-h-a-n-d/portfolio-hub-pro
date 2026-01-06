import { useState, useEffect } from 'react';
import { apiGet } from '../../api/request';
import { Users, FileText, Briefcase, MessageSquare, TrendingUp, Eye } from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate fetching stats
        await new Promise(resolve => setTimeout(resolve, 500));
        setStats({
          totalProjects: 9,
          totalMessages: 5,
          unreadMessages: 2,
          totalViews: 1247,
          recentActivity: [
            { type: 'message', text: 'New message from John Smith', time: '2 hours ago' },
            { type: 'project', text: 'Portfolio project "Finance" updated', time: '5 hours ago' },
            { type: 'view', text: '15 new portfolio views', time: '1 day ago' },
          ]
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Portfolio Projects', value: stats?.totalProjects || 0, icon: Briefcase, color: 'text-primary' },
    { label: 'Total Messages', value: stats?.totalMessages || 0, icon: MessageSquare, color: 'text-vegas-gold' },
    { label: 'Unread Messages', value: stats?.unreadMessages || 0, icon: MessageSquare, color: 'text-destructive' },
    { label: 'Portfolio Views', value: stats?.totalViews || 0, icon: Eye, color: 'text-green-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-card border border-border rounded-[20px] p-6" style={{ background: 'var(--bg-gradient-jet)' }}>
        <h1 className="h2 text-white-2 mb-2">Welcome Back!</h1>
        <p className="text-muted-foreground">Here's an overview of your portfolio performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-card border border-border rounded-[20px] p-5 transition-all hover:shadow-portfolio-2"
              style={{ background: 'var(--bg-gradient-jet)' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-semibold text-white-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-onyx ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div 
        className="bg-card border border-border rounded-[20px] p-6"
        style={{ background: 'var(--bg-gradient-jet)' }}
      >
        <h2 className="h3 text-white-2 mb-4">Recent Activity</h2>
        <ul className="space-y-4">
          {stats?.recentActivity?.map((activity, index) => (
            <li 
              key={index}
              className="flex items-center gap-4 p-4 bg-onyx/30 rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {activity.type === 'message' && <MessageSquare className="w-5 h-5" />}
                {activity.type === 'project' && <Briefcase className="w-5 h-5" />}
                {activity.type === 'view' && <TrendingUp className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-foreground text-sm">{activity.text}</p>
                <p className="text-muted-foreground text-xs">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div 
        className="bg-card border border-border rounded-[20px] p-6"
        style={{ background: 'var(--bg-gradient-jet)' }}
      >
        <h2 className="h3 text-white-2 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a 
            href="/admin/profile" 
            className="flex flex-col items-center gap-2 p-4 bg-onyx/30 rounded-xl hover:bg-onyx/50 transition-colors"
          >
            <Users className="w-6 h-6 text-primary" />
            <span className="text-sm text-foreground">Edit Profile</span>
          </a>
          <a 
            href="/admin/portfolio" 
            className="flex flex-col items-center gap-2 p-4 bg-onyx/30 rounded-xl hover:bg-onyx/50 transition-colors"
          >
            <Briefcase className="w-6 h-6 text-primary" />
            <span className="text-sm text-foreground">Add Project</span>
          </a>
          <a 
            href="/admin/resume" 
            className="flex flex-col items-center gap-2 p-4 bg-onyx/30 rounded-xl hover:bg-onyx/50 transition-colors"
          >
            <FileText className="w-6 h-6 text-primary" />
            <span className="text-sm text-foreground">Update Resume</span>
          </a>
          <a 
            href="/admin/messages" 
            className="flex flex-col items-center gap-2 p-4 bg-onyx/30 rounded-xl hover:bg-onyx/50 transition-colors"
          >
            <MessageSquare className="w-6 h-6 text-primary" />
            <span className="text-sm text-foreground">View Messages</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
