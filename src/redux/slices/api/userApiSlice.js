import { apiSlice } from "../apiSlice";

const USER_URL = "/user";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateUser: builder.mutation({
            query: ({ data, token }) => ({
                url: `${USER_URL}/profile`,
                method: "PUT",
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        getTeamList: builder.query({
            query: (token) => ({
                url: `${USER_URL}/get-team`,
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        deleteUser: builder.mutation({
            query: ({ id, token }) => ({
                url: `${USER_URL}/${id}`,
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        userAction: builder.mutation({
            query: ({ data, token }) => ({
                url: `${USER_URL}/${data.id}`,
                method: "PUT",
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        getNotification: builder.query({
            query: (token) => ({
                url: `${USER_URL}/notifications`,
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        markNotiAsRead: builder.mutation({
            query: ({ data, token }) => ({
                url: `${USER_URL}/read-noti`,
                method: "PUT",
                params: { isReadType: data.type, id: data.id },
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        changePassword: builder.mutation({
            query: ({ data, token }) => ({
                url: `${USER_URL}/change-password`,
                method: "PUT",
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
    }),
});

export const {
    useUpdateUserMutation,
    useGetTeamListQuery,
    useDeleteUserMutation,
    useUserActionMutation,
    useGetNotificationQuery,
    useMarkNotiAsReadMutation,
    useChangePasswordMutation,
} = userApiSlice;
