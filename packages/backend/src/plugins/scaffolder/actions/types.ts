export type Headers = {
  [key: string]: string;
};

export type Params = {
  [key: string]: string;
};

export type Methods =
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'POST'
  | 'UPDATE'
  | 'DELETE'
  | 'PUT'
  | 'PATCH';

export type Body = string | undefined;

export interface HttpOptions {
  url: string;
  method: Methods;
  headers: Headers;
  body?: Body;
}