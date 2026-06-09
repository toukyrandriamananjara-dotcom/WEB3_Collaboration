import { Edit, SimpleForm, TextInput, NumberInput } from "react-admin";

export const QuestionEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="content" multiline fullWidth required />
            <TextInput source="authorName" label="Auteur (optionnel)" fullWidth />
            <NumberInput source="upvotes" label="Upvotes" />
        </SimpleForm>
    </Edit>
);