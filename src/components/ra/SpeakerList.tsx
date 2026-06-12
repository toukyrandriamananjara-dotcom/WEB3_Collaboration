// src/components/ra/SpeakerList.tsx
import { List, Datagrid, TextField, EditButton } from "react-admin";

export const SpeakerList = () => (
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
            <TextField source="fullName" />
            <TextField source="bio" />
            <TextField source="email" />
            <EditButton />
        </Datagrid>
    </List>
);