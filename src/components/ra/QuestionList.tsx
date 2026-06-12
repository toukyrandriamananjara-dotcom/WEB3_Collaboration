// src/components/ra/QuestionList.tsx
import { List, Datagrid, TextField, DateField, EditButton, DeleteButton } from "react-admin";

export const QuestionList = () => (
    <List sx={{ mt: 2 }}>
        <Datagrid
            rowClick="edit"
            sx={{
                backgroundColor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
                "& .RaDatagrid-headerCell": {
                    fontWeight: 700,
                    backgroundColor: "action.hover",
                },
                "& .RaDatagrid-row": {
                    transition: "background-color 0.2s",
                    "&:hover": {
                        backgroundColor: "action.hover",
                    },
                },
            }}
        >
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