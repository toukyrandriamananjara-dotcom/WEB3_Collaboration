// src/components/ra/RoomList.tsx
import { List, Datagrid, TextField, EditButton, DeleteButton } from "react-admin";

export const RoomList = () => (
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
            <TextField source="name" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);