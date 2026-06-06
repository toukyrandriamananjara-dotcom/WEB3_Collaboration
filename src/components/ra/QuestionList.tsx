import { List, Datagrid, TextField, DateField, EditButton, DeleteButton } from "react-admin";

export const QuestionList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="content" />
            <TextField source="authorName" label="Auteur" />
            <TextField source="upvotes" />
            <DateField source="createdAt" />
            <TextField source="session.title" label="Session" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);