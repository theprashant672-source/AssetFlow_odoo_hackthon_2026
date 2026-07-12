export type AssetStatus = 'available' | 'assigned' | 'maintenance' | 'retired';

export interface Asset {
  _id: string;
  name: string;
  category: string;
  serialNumber: string;
  status: AssetStatus;
  assignedTo: string | null;
  purchaseDate?: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export type AssetInput = Partial<
  Pick<Asset, 'name' | 'category' | 'serialNumber' | 'status' | 'assignedTo' | 'purchaseDate' | 'value'>
>;

const BASE_URL = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

export const getAssets = () => request<Asset[]>('/assets');
export const getAsset = (id: string) => request<Asset>(`/assets/${id}`);
export const createAsset = (data: AssetInput) =>
  request<Asset>('/assets', { method: 'POST', body: JSON.stringify(data) });
export const updateAsset = (id: string, data: AssetInput) =>
  request<Asset>(`/assets/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAsset = (id: string) =>
  request<{ message: string }>(`/assets/${id}`, { method: 'DELETE' });
