import { List, Datagrid, TextField, EmailField, EditButton, DeleteButton } from "react-admin";

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="role" />
            <TextField source="createdAt" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);