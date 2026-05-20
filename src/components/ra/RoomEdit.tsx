import { Edit, SimpleForm, TextInput } from "react-admin";

export const RoomEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" fullWidth required />
        </SimpleForm>
    </Edit>
);