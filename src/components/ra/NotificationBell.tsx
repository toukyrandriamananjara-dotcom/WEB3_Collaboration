/**import { useState, useEffect } from "react";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Définissez un type pour vos notifications
type Notification = {
    type: string;
    payload?: any;
    timestamp?: string;
};

export const NotificationBell = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unread, setUnread] = useState<number>(0);

    useEffect(() => {
        const eventSource = new EventSource("/api/notifications/stream");
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data) as Notification;
            setNotifications((prev) => [data, ...prev]);
            setUnread((prev) => prev + 1);
        };
        return () => eventSource.close();
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setUnread(0);
    };

    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unread} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {notifications.length === 0 && <MenuItem>Pas de notifications</MenuItem>}
                {notifications.map((n, i) => (
                    <MenuItem key={i} onClick={handleClose}>
                        {n.type === "new-question"
                            ? `Nouvelle question dans session ${n.payload?.sessionId}`
                            : JSON.stringify(n)}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};
**/