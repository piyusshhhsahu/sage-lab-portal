import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUsers, FaFileAlt, FaCheckCircle, FaClock, FaChartBar, FaCalendarAlt } from 'react-icons/fa';

const AdminStats = ({ submissions }) => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalSubmissions: 0,
        approvedSubmissions: 0,
        pendingSubmissions: 0,
        rejectedSubmissions: 0,
        totalStudents: 0,
        recentSubmissions: 0
    });

    useEffect(() => {
        if (submissions.length > 0) {
            const totalSubmissions = submissions.length;
            const approvedSubmissions = submissions.filter(sub => sub.status === 'Approved').length;
            const pendingSubmissions = submissions.filter(sub => sub.status === 'Pending').length;
            const rejectedSubmissions = submissions.filter(sub => sub.status === 'Rejected').length;

            // Get unique students
            const uniqueStudents = new Set(submissions.map(sub => sub.student?._id).filter(Boolean));
            const totalStudents = uniqueStudents.size;

            // Recent submissions (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentSubmissions = submissions.filter(sub =>
                new Date(sub.createdAt) > sevenDaysAgo
            ).length;

            setStats({
                totalSubmissions,
                approvedSubmissions,
                pendingSubmissions,
                rejectedSubmissions,
                totalStudents,
                recentSubmissions
            });
        }
    }, [submissions]);

    const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
        <div className={`glass-card p-6 ${bgColor} border-l-4 ${color} hover:scale-[1.02] transition-transform duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${color.replace('border-l-', 'bg-').replace('-500', '-500/20')} text-white`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );

    if (user?.role !== 'admin') return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
                icon={FaFileAlt}
                title="Total Submissions"
                value={stats.totalSubmissions}
                color="border-l-blue-500"
                bgColor="bg-blue-50 dark:bg-blue-500/5"
            />
            <StatCard
                icon={FaCheckCircle}
                title="Approved"
                value={stats.approvedSubmissions}
                color="border-l-green-500"
                bgColor="bg-green-50 dark:bg-green-500/5"
            />
            <StatCard
                icon={FaClock}
                title="Pending Review"
                value={stats.pendingSubmissions}
                color="border-l-yellow-500"
                bgColor="bg-yellow-50 dark:bg-yellow-500/5"
            />
            <StatCard
                icon={FaUsers}
                title="Active Students"
                value={stats.totalStudents}
                color="border-l-purple-500"
                bgColor="bg-purple-50 dark:bg-purple-500/5"
            />
            <StatCard
                icon={FaCalendarAlt}
                title="This Week"
                value={stats.recentSubmissions}
                color="border-l-indigo-500"
                bgColor="bg-indigo-50 dark:bg-indigo-500/5"
            />
            <StatCard
                icon={FaChartBar}
                title="Approval Rate"
                value={stats.totalSubmissions > 0 ? Math.round((stats.approvedSubmissions / stats.totalSubmissions) * 100) + '%' : '0%'}
                color="border-l-teal-500"
                bgColor="bg-teal-50 dark:bg-teal-500/5"
            />
        </div>
    );
};

export default AdminStats;