import { List, Datagrid, TextField, DateField, EditButton } from "react-admin";

export const EventList = () => (
    <List sort={{ field: "startDate", order: "DESC" }}>
        <Datagrid rowClick="edit">
            <TextField source="title" />
            <TextField source="location" />
            <DateField source="startDate" showTime />
            <DateField source="endDate" showTime />
            <EditButton />
        </Datagrid>
    </List>
);