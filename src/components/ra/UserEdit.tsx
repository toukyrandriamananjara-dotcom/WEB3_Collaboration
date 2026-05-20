import { Edit, SimpleForm, TextInput, SelectInput } from "react-admin";

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" fullWidth required />
            <TextInput source="email" fullWidth required />
            <SelectInput source="role" choices={[
                { id: "user", name: "Utilisateur" },
                { id: "admin", name: "Administrateur" },
            ]} />
            <TextInput source="password" label="Nouveau mot de passe (laisser vide pour inchangé)" fullWidth />
        </SimpleForm>
    </Edit>
);