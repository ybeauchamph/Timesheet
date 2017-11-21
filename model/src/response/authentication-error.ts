export enum AuthenticationErrorCode {
    invalid_request = 0,
    invalid_client = 1,
    invalid_grant = 2,
    unauthorized_client = 3,
    unsupported_grant_type = 4,
    invalid_scope = 5
}

export interface AuthenticationError {
    errorCode: AuthenticationErrorCode;
}
