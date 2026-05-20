// src/components/ra/RoomCreate.tsx
import { Create, SimpleForm, TextInput } from "react-admin";

export const RoomCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" fullWidth required />
        </SimpleForm>
    </Create>
);