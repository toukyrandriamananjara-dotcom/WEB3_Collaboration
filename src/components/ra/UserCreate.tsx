import { Create, SimpleForm, TextInput, SelectInput } from "react-admin";

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" fullWidth required />
            <TextInput source="email" fullWidth required />
            <TextInput source="password" fullWidth required />
            <SelectInput source="role" choices={[
                { id: "user", name: "Utilisateur" },
                { id: "admin", name: "Administrateur" },
            ]} defaultValue="user" />
        </SimpleForm>
    </Create>
);