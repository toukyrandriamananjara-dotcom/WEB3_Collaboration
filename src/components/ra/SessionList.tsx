// src/components/ra/SessionList.tsx
import { List, Datagrid, TextField, DateField, ReferenceField, EditButton } from "react-admin";

export const SessionList = () => (
    <List sort={{ field: "startTime", order: "ASC" }}>
        <Datagrid rowClick="edit">
            <TextField source="title" />
            <ReferenceField source="eventId" reference="events" label="Événement">
                <TextField source="title" />
            </ReferenceField>
            <ReferenceField source="roomId" reference="rooms" label="Salle">
                <TextField source="name" />
            </ReferenceField>
            <DateField source="startTime" showTime />
            <DateField source="endTime" showTime />
            <EditButton />
        </Datagrid>
    </List>
);