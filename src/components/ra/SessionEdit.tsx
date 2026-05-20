// src/components/ra/SessionEdit.tsx
import { Edit, SimpleForm, TextInput, DateTimeInput, ReferenceInput, SelectInput, NumberInput, ReferenceArrayInput, SelectArrayInput } from "react-admin";

export const SessionEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" fullWidth required />
            <TextInput source="description" multiline fullWidth />
            <DateTimeInput source="startTime" required />
            <DateTimeInput source="endTime" required />
            <ReferenceInput source="roomId" reference="rooms">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <NumberInput source="capacity" />
            <ReferenceArrayInput source="speakerIds" reference="speakers">
                <SelectArrayInput optionText="fullName" />
            </ReferenceArrayInput>
        </SimpleForm>
    </Edit>
);