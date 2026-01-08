export interface BackendCategory {
    id: string;
    name: string;
    description: string;
}

export interface BackendStudent {
    id: string;
    full_name: string;
    angkatan: string;
    bio: string;
    photo: string | null;
}

export interface BackendProject {
    id: string;
    student?: BackendStudent;
    student_name?: string;
    category: string;
    category_name: string;
    title: string;
    description: string;
    thumbnail: string;
    likes_count: number;
    demo_url?: string;
    video_url?: string;
    created_at: string;
}

export interface BackendAchievement {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    category: 'Competition' | 'Recognition' | 'Partnership';
    link?: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const PUBLIC_ENDPOINTS = [
    '/showcase/projects/',
    '/showcase/categories/',
    '/achievements/',
];

function isPublicEndpoint(endpoint: string): boolean {
    return PUBLIC_ENDPOINTS.some(p => endpoint.startsWith(p));
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
    refreshSubscribers.map(cb => cb(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}

export async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const getHeaders = (withAuth = true) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('aici_token') : null;
        const headers: HeadersInit = {
            ...options?.headers,
        };

        if (!(options?.body instanceof FormData)) {
            (headers as any)['Content-Type'] = 'application/json';
        }

        if (token && withAuth) {
            (headers as any)['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    };

    const attemptFetch = async (withAuth = true): Promise<Response> => {
        return fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: getHeaders(withAuth),
        });
    };

    let res = await attemptFetch();

    if (res.status === 401) {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('aici_refresh') : null;

        if (refreshToken && !isRefreshing) {
            isRefreshing = true;
            try {
                const refreshRes = await fetch(`${BASE_URL}/users/token/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: refreshToken }),
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    localStorage.setItem('aici_token', data.access);
                    isRefreshing = false;
                    onTokenRefreshed(data.access);
                    res = await attemptFetch();
                } else {
                    throw new Error("Refresh failed");
                }
            } catch (err) {
                isRefreshing = false;
                localStorage.removeItem('aici_token');
                localStorage.removeItem('aici_refresh');
                
                // If public, try one last time without auth
                if (isPublicEndpoint(endpoint) && options?.method === 'GET' || !options?.method) {
                    res = await attemptFetch(false);
                } else if (typeof window !== 'undefined' && !endpoint.includes('/users/login/')) {
                    window.location.href = '/admin/login';
                }
            }
        } else if (isRefreshing) {
            // Wait for existing refresh
            return new Promise((resolve) => {
                addRefreshSubscriber(async (token) => {
                    resolve(await (await attemptFetch()).json());
                });
            }) as any;
        } else {
            // No refresh token or already failed
            if (isPublicEndpoint(endpoint) && (options?.method === 'GET' || !options?.method)) {
                res = await attemptFetch(false);
            } else if (typeof window !== 'undefined' && !endpoint.includes('/users/login/')) {
                window.location.href = '/admin/login';
            }
        }
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || 'API request failed');
    }

    if (res.status === 204) {
        return {} as T;
    }

    return res.json();
}

// Specific API calls
export const api = {
    projects: {
        list: (params?: string) => fetcher<PaginatedResponse<BackendProject>>(`/showcase/projects/${params ? `?${params}` : ''}`),
        get: (id: string) => fetcher<BackendProject>(`/showcase/projects/${id}/`),
        categories: () => fetcher<PaginatedResponse<BackendCategory>>('/showcase/categories/'),
        createCategory: (data: any) => fetcher<BackendCategory>('/showcase/categories/', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        updateCategory: (id: string, data: any) => fetcher<BackendCategory>(`/showcase/categories/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
        deleteCategory: (id: string) => fetcher<any>(`/showcase/categories/${id}/`, { method: 'DELETE' }),
        // Admin actions
        listAll: (params?: string) => fetcher<PaginatedResponse<BackendProject>>(`/showcase/projects/${params ? `?${params}` : ''}`),
        approve: (id: string) => fetcher<any>(`/showcase/projects/${id}/approve/`, { method: 'POST' }),
        reject: (id: string) => fetcher<any>(`/showcase/projects/${id}/reject/`, { method: 'POST' }),
        delete: (id: string) => fetcher<any>(`/showcase/projects/${id}/`, { method: 'DELETE' }),
        create: (data: FormData) => fetcher<BackendProject>('/showcase/projects/', {
            method: 'POST',
            body: data,
        }),
        update: (id: string, data: FormData) => fetcher<BackendProject>(`/showcase/projects/${id}/`, {
            method: 'PATCH',
            body: data,
        }),
    },
    users: {
        listStudents: (params?: string) => fetcher<PaginatedResponse<BackendStudent>>(`/users/students/${params ? `?${params}` : ''}`),
    },
    achievements: {
        list: () => fetcher<PaginatedResponse<BackendAchievement>>('/achievements/'),
        create: (data: FormData) => fetcher<BackendAchievement>('/achievements/', {
            method: 'POST',
            body: data,
        }),
        update: (id: string, data: FormData) => fetcher<BackendAchievement>(`/achievements/${id}/`, {
            method: 'PATCH',
            body: data,
        }),
        delete: (id: string) => fetcher<any>(`/achievements/${id}/`, { method: 'DELETE' }),
    },
    interactions: {
        like: (projectId: string) => fetcher<any>('/interactions/likes/', {
            method: 'POST',
            body: JSON.stringify({ project: projectId }),
        }),
    },
    auth: {
        login: (credentials: any) => fetcher<any>('/users/login/', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
        me: () => fetcher<any>('/users/me/'),
    },
};
