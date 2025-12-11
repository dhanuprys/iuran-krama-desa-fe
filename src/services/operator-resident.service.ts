import type { Resident } from '@/types/entity';
import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export class OperatorResidentService {
    async getResidents(params?: any) {
        const response = await apiClient.get<PaginatedResponse<Resident>>('/operator/residents', {
            params,
        });
        return response.data;
    }

    async getResident(id: number) {
        const response = await apiClient.get<HttpResponse<Resident>>(`/operator/residents/${id}`);
        return response.data;
    }

    async createResident(data: FormData) {
        const response = await apiClient.post<HttpResponse<Resident>>('/operator/residents', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async updateResident(id: number, data: FormData) {
        data.append('_method', 'PUT'); // Spoofing for Laravel
        const response = await apiClient.post<HttpResponse<Resident>>(`/operator/residents/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}

export default new OperatorResidentService();
