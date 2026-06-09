import { Create, SimpleForm, TextInput, DateTimeInput, ReferenceInput, SelectInput, NumberInput, ReferenceArrayInput, SelectArrayInput } from "react-admin";

const validateSessionDates = (values: any) => {
    const errors: any = {};
    if (values.startTime && values.endTime && new Date(values.endTime) <= new Date(values.startTime)) {
        errors.endTime = "L'heure de fin doit être après l'heure de début";
    }
    return errors;
};

export const SessionCreate = () => (
    <Create>
        <SimpleForm validate={validateSessionDates}>
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