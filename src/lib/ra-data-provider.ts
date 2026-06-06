import { fetchUtils, DataProvider } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const apiUrl = "/api";
const httpClient = (url: string, options: fetchUtils.Options = {}) => {
    if (!options.headers) options.headers = new Headers({ Accept: "application/json" });
    options.credentials = "include";
    return fetchUtils.fetchJson(url, options);
};

const baseProvider = simpleRestProvider(apiUrl, httpClient);

export const dataProvider: DataProvider = {
    ...baseProvider,

    getOne: async (resource, params) => {
        if (resource === "admin/stats") {
            const { json } = await httpClient(`${apiUrl}/admin/stats`);
            return { data: { id: 1, ...json } };
        }
        return baseProvider.getOne(resource, params);
    },

    getList: async (resource, params) => {
        try {
            const result = await baseProvider.getList(resource, params);
            return { ...result, data: result.data || [] };
        } catch (error) {
            console.error(`Error fetching ${resource}:`, error);
            return { data: [], total: 0 };
        }
    },

create: async (resource: string, params: any) => {
    // Gestion spécifique pour les sessions
    if (resource === "sessions") {
        const { eventId, ...sessionData } = params.data;
        if (!eventId) throw new Error("eventId is required");
        const { json } = await httpClient(`${apiUrl}/events/${eventId}/sessions`, {
            method: "POST",
            body: JSON.stringify(sessionData),
        });
        return { data: { ...json, id: json.id } };
    }

    // Gestion pour les speakers : transformer externalLinks
    if (resource === "speakers") {
        const { twitter, linkedin, github, website, ...rest } = params.data;
        const externalLinks: Record<string, string> = {};
        if (twitter) externalLinks.twitter = twitter;
        if (linkedin) externalLinks.linkedin = linkedin;
        if (github) externalLinks.github = github;
        if (website) externalLinks.website = website;
        const dataToSend = { ...rest, externalLinks: Object.keys(externalLinks).length ? externalLinks : undefined };
        const { json } = await httpClient(`${apiUrl}/speakers`, {
            method: "POST",
            body: JSON.stringify(dataToSend),
        });
        return { data: json };
    }

    return baseProvider.create(resource, params);
},

    update: async (resource, params) => {
        if (resource === "sessions") {
            const { json } = await httpClient(`${apiUrl}/sessions/${params.id}`, {
                method: "PUT",
                body: JSON.stringify(params.data),
            });
            return { data: json };
        }

        if (resource === "speakers") {
            const { twitter, linkedin, github, website, ...rest } = params.data;
            const externalLinks: Record<string, string> = {};
            if (twitter) externalLinks.twitter = twitter;
            if (linkedin) externalLinks.linkedin = linkedin;
            if (github) externalLinks.github = github;
            if (website) externalLinks.website = website;
            const dataToSend = { ...rest, externalLinks: Object.keys(externalLinks).length ? externalLinks : undefined };
            const { json } = await httpClient(`${apiUrl}/speakers/${params.id}`, {
                method: "PUT",
                body: JSON.stringify(dataToSend),
            });
            return { data: json };
        }

        return baseProvider.update(resource, params);
    },

    delete: async (resource, params) => {
        if (resource === "sessions") {
            const url = `${apiUrl}/sessions/${params.id}`;
            await httpClient(url, { method: "DELETE" });
            return { data: { id: params.id } as never };
        }
        return baseProvider.delete(resource, params);
    },
};


type RecordType = { id: string };
