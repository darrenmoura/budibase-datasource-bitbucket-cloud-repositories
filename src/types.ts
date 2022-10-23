export interface CreateQuery {
    workspaceId: string;
    repoSlug: string;
    body?: string;
}

export interface ReadQuery {
    workspaceId: string;
    repoSlug: string;
}

export type ListQuery = {
    workspaceId: string;
    role?: string;
} & Queriable & Sortable & Paginated;

export interface UpdateQuery {
    workspaceId: string;
    repoSlug: string;
    body: string;
}

export interface DeleteQuery {
    workspaceId: string;
    repoSlug: string;
    redirectTo?: string;
}

type Queriable = { query?: string };
type Sortable = { sort?: string };
type Paginated = { page?: number, pageLength?: number };