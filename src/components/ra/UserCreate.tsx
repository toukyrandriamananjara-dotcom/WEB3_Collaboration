import { Create, SimpleForm, TextInput } from "react-admin";

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" fullWidth required />
            <TextInput source="email" fullWidth required type="email" />
            <TextInput source="password" fullWidth required />
        </SimpleForm>
    </Create>
);