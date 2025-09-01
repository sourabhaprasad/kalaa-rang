import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

export const categortApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    async onQueryStarted(categoryId, { dispatch, queryFulfilled }) {
      const patchResult = dispatch(
        categortApiSlice.util.updateQueryData(
          "fetchCategories",
          undefined,
          (draft) => {
            return draft.filter((cat) => cat._id !== categoryId);
          }
        )
      );
      try {
        await queryFulfilled;
      } catch {
        patchResult.undo();
      }
    },
    fetchCategories: builder.query({
      query: () => `${CATEGORY_URL}/categories`,
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} = categortApiSlice;
