import { Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDataProvider } from "react-admin";

type Stats = {
    totalEvents: number;
    totalSessions: number;
    totalSpeakers: number;
    totalRooms: number;
    totalQuestions: number;
    totalUsers: number;
    questionsPerDay: { date: string; count: number }[];
};

const StatCard = ({ title, value }: { title: string; value: number }) => (
    <Card style={{ height: "100%" }}>
        <CardContent>
            <Typography color="textSecondary" gutterBottom>{title}</Typography>
            <Typography variant="h4">{value}</Typography>
        </CardContent>
    </Card>
);

export const Dashboard = () => {
    const dataProvider = useDataProvider();
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        dataProvider.getOne("admin/stats", { id: "" }).then(({ data }) => {
            setStats(data as Stats);
        });
    }, [dataProvider]);

    if (!stats) return <div>Chargement...</div>;

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
    };

    return (
        <div style={{ padding: "2rem" }}>
            <Typography variant="h4" gutterBottom>Tableau de bord</Typography>
            <div style={gridStyle}>
                <StatCard title="Événements" value={stats.totalEvents} />
                <StatCard title="Sessions" value={stats.totalSessions} />
                <StatCard title="Intervenants" value={stats.totalSpeakers} />
                <StatCard title="Salles" value={stats.totalRooms} />
                <StatCard title="Questions" value={stats.totalQuestions} />
                <StatCard title="Utilisateurs" value={stats.totalUsers} />
            </div>
            <Card>
                <CardContent>
                    <Typography variant="h6">Questions par jour (7 derniers jours)</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.questionsPerDay || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};