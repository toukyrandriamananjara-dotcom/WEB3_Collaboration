// src/components/ra/SessionList.tsx
import { List, Datagrid, TextField, DateField, ReferenceField, EditButton } from "react-admin";

export const SessionList = () => (
    <List sort={{ field: "startTime", order: "ASC" }} sx={{ mt: 2 }}>
        <Datagrid
            rowClick="edit"
            sx={{
                backgroundColor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
                "& .RaDatagrid-headerCell": {
                    fontWeight: 700,
                    backgroundColor: "action.hover",
                },
                "& .RaDatagrid-row": {
                    transition: "background-color 0.2s",
                    "&:hover": {
                        backgroundColor: "action.hover",
                    },
                },
            }}
        >
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