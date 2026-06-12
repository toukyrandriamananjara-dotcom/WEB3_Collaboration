"use client";

import { Admin, Resource } from "react-admin";
import { dataProvider } from "@/lib/ra-data-provider";
import { authProvider } from "@/lib/ra-auth-provider";

import { EventList } from "./ra/EventList";
import { EventEdit } from "./ra/EventEdit";
import { EventCreate } from "./ra/EventCreate";

import { SpeakerList } from "./ra/SpeakerList";
import { SpeakerEdit } from "./ra/SpeakerEdit";
import { SpeakerCreate } from "./ra/SpeakerCreate";

import { RoomList } from "./ra/RoomList";
import { RoomCreate } from "./ra/RoomCreate";

import { SessionList } from "./ra/SessionList";
import { SessionEdit } from "./ra/SessionEdit";
import { SessionCreate } from "./ra/SessionCreate";

import { EditGuesser } from "react-admin";
import {RoomEdit} from "@/components/ra/RoomEdit";

import { UserList } from "./ra/UserList";
import {  UserEdit } from "./ra/UserEdit";
import { UserCreate } from "./ra/UserCreate";

import { QuestionList} from "./ra/QuestionList";
import { Dashboard } from "./ra/Dashboard";
import { MyLayout } from "./ra/MyLayout";
import { QuestionEdit } from "./ra/QuestionEdit";

import { appTheme } from "./theme";

export default function AdminApp() {
    return (
        <Admin dashboard={Dashboard}
               dataProvider={dataProvider}
               authProvider={authProvider}
               layout={MyLayout}
                title="MyVent Admin"
                theme={appTheme as any}
        >
            <Resource
                name="events"
                list={EventList}
                edit={EventEdit}
                create={EventCreate}
            />
            <Resource
                name="speakers"
                list={SpeakerList}
                edit={SpeakerEdit}
                create={SpeakerCreate}
            />
            <Resource
                name="rooms"
                list={RoomList}
                create={RoomCreate}
                edit={RoomEdit}
            />
            <Resource
                name="sessions"
                list={SessionList}
                edit={SessionEdit}
                create={SessionCreate}
            />
            <Resource name="users"
                      list={UserList}
                      edit={UserEdit}
                      create={UserCreate}
            />
            <Resource name="questions"
                    list={QuestionList}
                    edit={QuestionEdit} />
        </Admin>
    );
}