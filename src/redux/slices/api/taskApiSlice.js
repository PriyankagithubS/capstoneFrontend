const TASKS_URL = "/task";

import { apiSlice } from "../apiSlice";

export const taskApiSlice = apiSlice.injectEndpoints({
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
                },
            }),
        }),
    }),
});

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
