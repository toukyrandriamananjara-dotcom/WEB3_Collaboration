import { Edit, SimpleForm, TextInput, DateTimeInput, DeleteButton, SaveButton, Toolbar } from "react-admin";

const CustomToolbar = () => (
    <Toolbar>
        <SaveButton />
        <DeleteButton />
    </Toolbar>
);


export const EventEdit = () => (
    <Edit>
        <SimpleForm toolbar={<CustomToolbar />}>
            <TextInput source="title" fullWidth required />
            <TextInput source="description" multiline fullWidth />
            <DateTimeInput source="startDate" required />
            <DateTimeInput source="endDate" required />
            <TextInput source="location" fullWidth required />
        </SimpleForm>
    </Edit>
);