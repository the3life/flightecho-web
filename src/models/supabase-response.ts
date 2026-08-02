export interface SupabaseResponse<T> {
    success: boolean;
    message?: string;
    code?: string;
    data?: T;
}