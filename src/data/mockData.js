export const mockUsers = [
    {
        id: 'USR-001',
        name: 'Sarah Jenkins',
        email: 'sarah.j@example.com',
        joinDate: '2026-01-15',
        plan: 'Premium Annual',
        status: 'Active',
        lastActive: '2026-02-22',
    },
    {
        id: 'USR-002',
        name: 'Michael Chen',
        email: 'mchen92@example.com',
        joinDate: '2026-01-20',
        plan: 'Free',
        status: 'Active',
        lastActive: '2026-02-23',
    },
    {
        id: 'USR-003',
        name: 'Elena Rodriguez',
        email: 'elena.rod@example.com',
        joinDate: '2026-02-01',
        plan: 'Premium Monthly',
        status: 'Active',
        lastActive: '2026-02-21',
    },
    {
        id: 'USR-004',
        name: 'David Smith',
        email: 'dsmith.creative@example.com',
        joinDate: '2026-02-10',
        plan: 'Premium Monthly',
        status: 'Canceled',
        lastActive: '2026-02-15',
    },
    {
        id: 'USR-005',
        name: 'Aisha Patel',
        email: 'apatel.design@example.com',
        joinDate: '2026-02-18',
        plan: 'Free',
        status: 'Active',
        lastActive: '2026-02-23',
    },
    {
        id: 'USR-006',
        name: 'James Wilson',
        email: 'jwilson88@example.com',
        joinDate: '2026-02-19',
        plan: 'Premium Annual',
        status: 'Active',
        lastActive: '2026-02-20',
    }
];

export const getAdminStats = () => {
    const totalUsers = mockUsers.length;
    const premiumUsers = mockUsers.filter(u => u.plan.includes('Premium') && u.status === 'Active').length;

    // Rough estimate: Annual = ₹799/mo, Monthly = ₹999/mo
    const estimatedMRR = mockUsers.reduce((total, user) => {
        if (user.status !== 'Active') return total;
        if (user.plan === 'Premium Monthly') return total + 999;
        if (user.plan === 'Premium Annual') return total + 799;
        return total;
    }, 0);

    return { totalUsers, premiumUsers, estimatedMRR };
};
