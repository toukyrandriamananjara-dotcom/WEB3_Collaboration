// src/components/ra/EventCreate.tsx
import { Create, SimpleForm, TextInput, DateTimeInput } from "react-admin";

export const EventCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" fullWidth required />
            <TextInput source="description" multiline fullWidth />
            <DateTimeInput source="startDate" required />
            <DateTimeInput source="endDate" required />
            <TextInput source="location" fullWidth required />
        </SimpleForm>
    </Create>
);