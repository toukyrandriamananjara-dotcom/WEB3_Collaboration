import { Edit, SimpleForm, TextInput } from "react-admin";

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" fullWidth required />
            <TextInput source="email" fullWidth required type="email" />
            <TextInput source="password" label="Nouveau mot de passe (laisser vide pour inchangé)" fullWidth />
        </SimpleForm>
    </Edit>
);