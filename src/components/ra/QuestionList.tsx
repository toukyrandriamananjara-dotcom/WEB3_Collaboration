import { List, Datagrid, TextField, DateField, BooleanField, EditButton, DeleteButton, BooleanInput, Edit, SimpleForm, useRecordContext } from "react-admin";

const ToggleVisibilityButton = () => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <EditButton label={record.isVisible ? "Masquer" : "Afficher"} />
    );
};

export const QuestionList = () => (
    <List>
        <Datagrid>
            <TextField source="content" />
            <TextField source="authorName" label="Auteur" />
            <TextField source="upvotes" />
            <DateField source="createdAt" />
            <TextField source="session.title" label="Session" />
            <BooleanField source="isVisible" label="Visible" />
            <ToggleVisibilityButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const QuestionEdit = () => (
    <Edit>
        <SimpleForm>
            <BooleanInput source="isVisible" label="Visible" />
        </SimpleForm>
    </Edit>
);