// src/components/ra/SessionCreate.tsx
import { Create, SimpleForm, TextInput, DateTimeInput, ReferenceInput, SelectInput, NumberInput, ReferenceArrayInput, SelectArrayInput } from "react-admin";

export const SessionCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="eventId" reference="events">
                <SelectInput optionText="title" />
            </ReferenceInput>
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
    </Create>
);