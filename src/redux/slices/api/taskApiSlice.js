import { apiSlice } from "../apiSlice";

const TASKS_URL = "/task";

export const taskApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: (token) => ({
                url: `${TASKS_URL}/dashboard`,
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        }),
        getAllTasks: builder.query({
            query: ({ strQuery = "", isTrashed = "", search = "", token }) => ({
                url: `${TASKS_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        }),
        createTask: builder.mutation({
            query: ({ data, token }) => ({
                url: `${TASKS_URL}/create`,
                method: "POST",
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        }),
        duplicateTask: builder.mutation({
            query: ({ id, token }) => ({
                url: `${TASKS_URL}/duplicate/${id}`,
                method: "POST",
                body: {},
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        }),
        updateTask: builder.mutation({
            query: ({ data, token }) => ({
                url: `${TASKS_URL}/update/${data._id}`,
                method: "PUT",
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        }),
        trashTask: builder.mutation({
            query: ({ id, token }) => ({
                url: `${TASKS_URL}/${id}`,
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        }),
        createSubTask: builder.mutation({
            query: ({ data, id, token }) => ({
                url: `${TASKS_URL}/create-subtask/${id}`,
                method: "PUT",
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        }),
        getSingleTask: builder.query({
            query: ({ id, token }) => ({
                url: `${TASKS_URL}/${id}`,
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        }),
        postTaskActivity: builder.mutation({
            query: ({ data, id, token }) => ({
                url: `${TASKS_URL}/activity/${id}`,
                method: "POST",
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        }),
        deleteRestoreTask: builder.mutation({
            query: ({ id, actionType, token }) => ({
                url: `${TASKS_URL}/delete-restore/${id}?actionType=${actionType}`,
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
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
