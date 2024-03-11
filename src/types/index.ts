export type UsersItemResponse = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  job?: string;
}

export type UsersResponse = {
  data: Array<UsersItemResponse>;
  meta: {
    from: number;
    to: number;
    total: number;
  }
}