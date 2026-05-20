import { List, Datagrid, TextField, EditButton, DeleteButton } from "react-admin";

export const RoomList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);