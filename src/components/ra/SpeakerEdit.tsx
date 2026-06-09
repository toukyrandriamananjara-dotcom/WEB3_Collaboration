import { Edit, SimpleForm, TextInput } from "react-admin";

export const SpeakerEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="fullName" fullWidth required />
            <TextInput source="email" fullWidth required type="email" />
            <TextInput source="password" label="Nouveau mot de passe (laisser vide pour inchangé)" fullWidth />
            <TextInput source="bio" multiline fullWidth />
            <TextInput source="photo" fullWidth />
            <TextInput source="twitter" fullWidth label="Twitter (URL)" />
            <TextInput source="linkedin" fullWidth label="LinkedIn (URL)" />
            <TextInput source="github" fullWidth label="GitHub (URL)" />
            <TextInput source="website" fullWidth label="Site web" />
        </SimpleForm>
    </Edit>
);