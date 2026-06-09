import { Create, SimpleForm, TextInput, DateTimeInput } from "react-admin";

const validateEventDates = (values: any) => {
    const errors: any = {};
    if (values.startDate && values.endDate && new Date(values.endDate) <= new Date(values.startDate)) {
        errors.endDate = "La date de fin doit être postérieure à la date de début";
    }
    return errors;
};

export const EventCreate = () => (
    <Create>
        <SimpleForm validate={validateEventDates}>
            <TextInput source="title" fullWidth required />
            <TextInput source="description" multiline fullWidth />
            <DateTimeInput source="startDate" required />
            <DateTimeInput source="endDate" required />
            <TextInput source="location" fullWidth required />
        </SimpleForm>
    </Create>
);