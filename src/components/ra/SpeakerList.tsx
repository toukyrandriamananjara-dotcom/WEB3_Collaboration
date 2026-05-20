// src/components/ra/SpeakerList.tsx
import { List, Datagrid, TextField, EditButton } from "react-admin";

export const SpeakerList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="fullName" />
            <TextField source="bio" />
            <TextField source="email" />
            <EditButton />
        </Datagrid>
    </List>
);