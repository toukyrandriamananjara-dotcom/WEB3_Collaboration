import {
  Admin,
  Resource,
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  BooleanField,
  EmailField,
  UrlField,
  EditButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  DateTimeInput,
  NumberInput,
  BooleanInput,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  Show,
  SimpleShowLayout,
  ShowButton,
  required,
} from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import {
  Calendar,
  Radio,
  MessageSquare,
  Mic,
  DoorOpen,
  CalendarClock,
  Eye,
} from "lucide-react";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

// ============ Événements (posts) ============
const EventList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="title" label="Nom de l'événement" />
      <TextField source="location" label="Lieu" />
      <DateField source="date" label="Date" showTime />
      <NumberField source="capacity" label="Capacité" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

const EventEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" label="Nom de l'événement" validate={required()} fullWidth />
      <TextInput source="description" multiline rows={4} fullWidth />
      <TextInput source="location" label="Lieu" validate={required()} fullWidth />
      <DateTimeInput source="date" label="Date" validate={required()} />
      <NumberInput source="capacity" label="Capacité" min={0} />
    </SimpleForm>
  </Edit>
);

const EventCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" label="Nom de l'événement" validate={required()} fullWidth />
      <TextInput source="description" multiline rows={4} fullWidth />
      <TextInput source="location" label="Lieu" validate={required()} fullWidth />
      <DateTimeInput source="date" label="Date" validate={required()} />
      <NumberInput source="capacity" label="Capacité" min={0} defaultValue={100} />
    </SimpleForm>
  </Create>
);

const EventShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="location" />
      <DateField source="date" showTime />
      <NumberField source="capacity" />
    </SimpleShowLayout>
  </Show>
);

// ============ Sessions / Planning (todos) ============
const SessionList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" label="Titre de la session" />
      <ReferenceField source="userId" reference="users" label="Speaker">
        <TextField source="name" />
      </ReferenceField>
      <BooleanField source="completed" label="Live" />
      <EditButton />
    </Datagrid>
  </List>
);

const SessionEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" label="Titre de la session" validate={required()} fullWidth />
      <ReferenceInput source="userId" reference="users" label="Speaker">
        <SelectInput optionText="name" validate={required()} />
      </ReferenceInput>
      <BooleanInput source="completed" label="Session en cours (Live)" />
    </SimpleForm>
  </Edit>
);

const SessionCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" label="Titre de la session" validate={required()} fullWidth />
      <ReferenceInput source="userId" reference="users" label="Speaker">
        <SelectInput optionText="name" validate={required()} />
      </ReferenceInput>
      <BooleanInput source="completed" label="Session en cours (Live)" defaultValue={false} />
    </SimpleForm>
  </Create>
);

// ============ Speakers (users) ============
const SpeakerList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" label="Nom" />
      <EmailField source="email" />
      <TextField source="company.name" label="Société" />
      <UrlField source="website" label="Réseau / Site" />
      <EditButton />
    </Datagrid>
  </List>
);

const SpeakerEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Nom" validate={required()} />
      <TextInput source="email" validate={required()} />
      <TextInput source="phone" label="Téléphone" />
      <TextInput source="website" label="Site / Réseau social" />
      <TextInput source="company.name" label="Société" />
    </SimpleForm>
  </Edit>
);

const SpeakerCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Nom" validate={required()} />
      <TextInput source="email" validate={required()} />
      <TextInput source="phone" label="Téléphone" />
      <TextInput source="website" label="Site / Réseau social" />
      <TextInput source="company.name" label="Société" />
    </SimpleForm>
  </Create>
);

// ============ Salles / Rooms (albums) ============
const RoomList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" label="Nom de la salle" />
      <EditButton />
    </Datagrid>
  </List>
);

const RoomEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" label="Nom de la salle" validate={required()} />
    </SimpleForm>
  </Edit>
);

const RoomCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" label="Nom de la salle" validate={required()} />
    </SimpleForm>
  </Create>
);

// ============ Questions (comments) ============
const QuestionList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" label="Sujet" />
      <EmailField source="email" label="Auteur" />
      <ReferenceField source="postId" reference="posts" label="Événement">
        <TextField source="title" />
      </ReferenceField>
      <TextField source="body" label="Question" />
    </Datagrid>
  </List>
);

const QuestionShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="name" />
      <EmailField source="email" />
      <ReferenceField source="postId" reference="posts">
        <TextField source="title" />
      </ReferenceField>
      <TextField source="body" />
    </SimpleShowLayout>
  </Show>
);

// ============ Dashboard ============
const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  pulse,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  color: string;
  pulse?: boolean;
}) => (
  <div
    style={{
      flex: 1,
      minWidth: 220,
      padding: 24,
      borderRadius: 12,
      background: "white",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      display: "flex",
      gap: 16,
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: `${color}20`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Icon size={24} color={color} />
      {pulse && (
        <span
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ef4444",
            boxShadow: "0 0 0 0 rgba(239,68,68,0.7)",
            animation: "pulse 2s infinite",
          }}
        />
      )}
    </div>
    <div>
      <div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{value}</div>
    </div>
  </div>
);

const liveSessions = [
  { id: 1, title: "Keynote d'ouverture — Le futur du Web", room: "Salle A", speaker: "Alice Martin" },
  { id: 2, title: "Atelier React 19 & Server Components", room: "Salle B", speaker: "Bob Dupont" },
  { id: 3, title: "Table ronde IA & Éthique", room: "Salle C", speaker: "Clara Nguyen" },
];

const Dashboard = () => (
  <div style={{ padding: 24 }}>
    <style>{`@keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); }
      70% { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
      100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
    }`}</style>
    <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>EventSync — Dashboard</h1>
    <p style={{ color: "#6b7280", marginBottom: 24 }}>
      Vue d'ensemble des événements, sessions live, speakers et engagement.
    </p>

    {/* KPIs */}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
      <StatCard icon={Calendar} label="Total Événements" value="12" color="#6366f1" />
      <StatCard icon={Radio} label="Sessions en cours (Live)" value="3" color="#ef4444" pulse />
      <StatCard icon={MessageSquare} label="Total Questions" value="248" color="#f59e0b" />
      <StatCard icon={Mic} label="Intervenants Actifs" value="34" color="#10b981" />
    </div>

    {/* Live Now */}
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#ef4444",
            display: "inline-block",
            animation: "pulse 2s infinite",
          }}
        />
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Live Now</h2>
        <span style={{ color: "#6b7280", fontSize: 13 }}>
          — Sessions actuellement en cours
        </span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#6b7280", fontSize: 13 }}>
            <th style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>Session</th>
            <th style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>Salle</th>
            <th style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>Speaker</th>
            <th style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}></th>
          </tr>
        </thead>
        <tbody>
          {liveSessions.map((s) => (
            <tr key={s.id}>
              <td style={{ padding: "12px", borderBottom: "1px solid #f3f4f6", fontWeight: 600 }}>
                {s.title}
              </td>
              <td style={{ padding: "12px", borderBottom: "1px solid #f3f4f6" }}>{s.room}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #f3f4f6" }}>{s.speaker}</td>
              <td style={{ padding: "12px", borderBottom: "1px solid #f3f4f6", textAlign: "right" }}>
                <a
                  href="#/comments"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: "#6366f1",
                    color: "white",
                    borderRadius: 6,
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  <Eye size={14} /> Voir les questions
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function EventAdmin() {
  return (
    <Admin dataProvider={dataProvider} dashboard={Dashboard} title="EventSync Admin">
      <Resource
        name="posts"
        options={{ label: "Événements" }}
        list={EventList}
        edit={EventEdit}
        create={EventCreate}
        show={EventShow}
        icon={Calendar}
        recordRepresentation="title"
      />
      <Resource
        name="todos"
        options={{ label: "Planning / Sessions" }}
        list={SessionList}
        edit={SessionEdit}
        create={SessionCreate}
        icon={CalendarClock}
      />
      <Resource
        name="users"
        options={{ label: "Speakers" }}
        list={SpeakerList}
        edit={SpeakerEdit}
        create={SpeakerCreate}
        icon={Mic}
        recordRepresentation="name"
      />
      <Resource
        name="albums"
        options={{ label: "Salles (Rooms)" }}
        list={RoomList}
        edit={RoomEdit}
        create={RoomCreate}
        icon={DoorOpen}
      />
      <Resource
        name="comments"
        options={{ label: "Questions" }}
        list={QuestionList}
        show={QuestionShow}
        icon={MessageSquare}
      />
    </Admin>
  );
}
