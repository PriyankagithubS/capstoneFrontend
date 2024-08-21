import { apiSlice } from "../apiSlice";

const AUTH_URL = "/user";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getDashboardStats: builder.query({
            query: (token) => ({
                url: `${TASKS_URL}/dashboard`,
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        getAllTasks: builder.query({
            query: ({ strQuery = "", isTrashed = "", search = "", token }) => ({
                url: `${TASKS_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        createTask: builder.mutation({
            query: ({ data, token }) => ({
                url: `${TASKS_URL}/create`,
                method: "POST",
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        duplicateTask: builder.mutation({
            query: ({ id, token }) => ({
                url: `${TASKS_URL}/duplicate/${id}`,
                method: "POST",
                body: {}, // Empty body if not needed
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),

        updateTask: builder.mutation({
            query: ({ data, token }) => ({
                url: `${TASKS_URL}/update/${data._id}`,
                method: "PUT",
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),

        trashTask: builder.mutation({
            query: ({ id, token }) => ({
                url: `${TASKS_URL}/${id}`,
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        createSubTask: builder.mutation({
            query: ({ data, id, token }) => ({
                url: `${TASKS_URL}/create-subtask/${id}`,
                method: "PUT",
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        getSingleTask: builder.query({
            query: ({ id, token }) => ({
                url: `${TASKS_URL}/${id}`,
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        postTaskActivity: builder.mutation({
            query: ({ data, id, token }) => ({
                url: `${TASKS_URL}/activity/${id}`,
                method: "POST",
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers
                },
            }),
        }),
        deleteRestoreTask: builder.mutation({
            query: ({ id, actionType, token }) => ({
                url: `${TASKS_URL}/delete-restore/${id}?actionType=${actionType}`,
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in headers

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

<<<<<<< HEAD
export const {
    useGetDashboardStatsQuery,
    useGetAllTasksQuery,
    useCreateTaskMutation,
    useDuplicateTaskMutation,
    useUpdateTaskMutation,
    useTrashTaskMutation,
    useCreateSubTaskMutation,
    useGetSingleTaskQuery,
    usePostTaskActivityMutation,
    useDeleteRestoreTaskMutation,
} = taskApiSlice;
=======
export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApiSlice;
>>>>>>> 390589f03622fab11ccab21688550bf279310a9a
