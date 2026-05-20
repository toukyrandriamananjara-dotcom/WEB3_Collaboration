// src/components/ra/SpeakerCreate.tsx
import { Create, SimpleForm, TextInput } from "react-admin";

export const SpeakerCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="fullName" fullWidth required />
            <TextInput source="bio" multiline fullWidth />
            <TextInput source="photo" fullWidth />
            <TextInput source="email" fullWidth />
            <TextInput source="twitter" fullWidth label="Twitter (URL)" />
            <TextInput source="linkedin" fullWidth label="LinkedIn (URL)" />
            <TextInput source="github" fullWidth label="GitHub (URL)" />
            <TextInput source="website" fullWidth label="Site web" />
        </SimpleForm>
    </Create>
);