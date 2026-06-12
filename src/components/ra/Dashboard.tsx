import { Card, CardContent, Typography } from "@mui/material";
import {
    Event,
    MeetingRoom,
    QuestionAnswer,
    People,
    Mic,
    CalendarMonth,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
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

type StatCardProps = {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
};

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
    <Card
        style={{
            height: "100%",
            borderRadius: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            transition: "all 0.3s ease",
        }}
    >
        <CardContent>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="h4"
                        style={{ fontWeight: "bold" }}
                    >
                        {value}
                    </Typography>
                </div>

                <div
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                    }}
                >
                    {icon}
                </div>
            </div>
        </CardContent>
    </Card>
);

export const Dashboard = () => {
    const dataProvider = useDataProvider();
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        dataProvider
            .getOne("admin/stats", { id: "" })
            .then(({ data }) => {
                setStats(data as Stats);
            })
            .catch((error) => {
                console.error("Erreur chargement stats :", error);
            });
    }, [dataProvider]);

    if (!stats) {
        return (
            <div style={{ padding: "2rem" }}>
                <Typography>Chargement...</Typography>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "2rem",
                minHeight: "100vh",
                background:
                    "linear-gradient(to bottom, #f8fafc, #eef2ff)",
            }}
        >
            <Typography
                variant="h3"
                gutterBottom
                style={{
                    fontWeight: "bold",
                    color: "#1e293b",
                    marginBottom: "2rem",
                }}
            >
                Tableau de bord
            </Typography>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "2rem",
                }}
            >
                <StatCard
                    title="Événements"
                    value={stats.totalEvents}
                    icon={<Event />}
                    color="#3b82f6"
                />

                <StatCard
                    title="Sessions"
                    value={stats.totalSessions}
                    icon={<CalendarMonth />}
                    color="#8b5cf6"
                />

                <StatCard
                    title="Intervenants"
                    value={stats.totalSpeakers}
                    icon={<Mic />}
                    color="#f59e0b"
                />

                <StatCard
                    title="Salles"
                    value={stats.totalRooms}
                    icon={<MeetingRoom />}
                    color="#10b981"
                />

                <StatCard
                    title="Questions"
                    value={stats.totalQuestions}
                    icon={<QuestionAnswer />}
                    color="#ef4444"
                />

                <StatCard
                    title="Utilisateurs"
                    value={stats.totalUsers}
                    icon={<People />}
                    color="#06b6d4"
                />
            </div>

            <Card
                style={{
                    borderRadius: "20px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                }}
            >
                <CardContent>
                    <Typography
                        variant="h6"
                        style={{
                            fontWeight: "bold",
                            marginBottom: "1rem",
                        }}
                    >
                        Questions par jour (7 derniers jours)
                    </Typography>

                    <ResponsiveContainer
                        width="100%"
                        height={350}
                    >
                        <LineChart
                            data={stats.questionsPerDay || []}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                            />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#6366f1"
                                strokeWidth={4}
                                dot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};