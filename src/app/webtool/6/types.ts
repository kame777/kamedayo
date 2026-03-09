export type ShortenedEntry = {
  id: string;
  originalURL: string;
  shortURL: string;
  createdAt: string;
};

export type ApiErrorCode = "RATE_LIMIT" | "INVALID_URL" | "API_ERROR" | "SERVER_ERROR";

export type ApiSuccessResponse = {
  shortURL: string;
  originalURL: string;
};

export type ApiErrorResponse = {
  error: string;
  code?: ApiErrorCode;
};
