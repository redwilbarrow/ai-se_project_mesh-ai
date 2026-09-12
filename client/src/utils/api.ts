import type {
  CurrentUser,
  Message,
  KnowledgeDoc,
  Chat,
  ApiResponse,
} from "../types";

const BASE_URL = "/api";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("auth-token") ?? "";

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message || "Invalid credentials";
    if (localStorage.getItem("auth-token")) {
      localStorage.removeItem("auth-token");
      window.location.href = "/login";
    }
    throw new Error(message);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Request failed");
  }

  if (res.status === 204) {
    return { success: true, data: null, error: null };
  }

  return res.json();
}

export function loginUser(email: string, password: string) {
  return request<{ token: string; user: CurrentUser }>(
    `${BASE_URL}/auth/login`,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );
}

export function getCurrentUser() {
  return request<CurrentUser>(`${BASE_URL}/users/me`);
}

export function registerUser(name: string, email: string, password: string) {
  return request<{ userId: string; name: string; email: string }>(
    `${BASE_URL}/auth/register`,
    {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    },
  );
}

export const getDocuments = (): Promise<ApiResponse<KnowledgeDoc[]>> => {
  return request<KnowledgeDoc[]>(`${BASE_URL}/documents`);
};

export const deleteDocument = (
  documentId: string,
): Promise<ApiResponse<null>> => {
  return request<null>(`${BASE_URL}/documents/${documentId}`, {
    method: "DELETE",
  });
};

export const uploadDocument = async (
  file: File,
): Promise<ApiResponse<KnowledgeDoc>> => {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("auth-token") ?? "";

  const res = await fetch(`${BASE_URL}/documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message || "Invalid credentials";

    localStorage.removeItem("auth-token");
    window.location.href = "/login";

    throw new Error(message);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Request failed");
  }

  return res.json();
};

export const getChats = (): Promise<ApiResponse<Chat[]>> => {
  return request<Chat[]>(`${BASE_URL}/chats`);
};

export const getChat = (
  id: string,
): Promise<ApiResponse<{ chat: Chat; messages: Message[] }>> => {
  return request<{ chat: Chat; messages: Message[] }>(
    `${BASE_URL}/chats/${id}`,
  );
};

export const createChat = (title: string): Promise<ApiResponse<Chat>> => {
  return request<Chat>(`${BASE_URL}/chats`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
};

export const sendMessage = (
  chatId: string,
  question: string,
): Promise<ApiResponse<Message[]>> => {
  return request<Message[]>(`${BASE_URL}/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
};
