export interface AuthenticationRequest {
    grant_type: string;
    scope: string;
    username: string;
    password: string;
    refresh_token: string;
}
