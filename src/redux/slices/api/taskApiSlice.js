import { apiSlice } from "../apiSlice";

const AUTH_URL = "/user";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: "POST",
                body: data,
                headers: {
                    'Authorization': `Bearer ${data.token}`, // Token should be passed in the body or via a function argument
                },
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/register`,
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: (token) => ({
                url: `${AUTH_URL}/logout`,
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`, // Token passed via the headers
                },
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApiSlice;
