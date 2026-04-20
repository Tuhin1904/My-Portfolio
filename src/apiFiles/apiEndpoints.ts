export const apiEndpoints = {
  postRequest: "/project/queries",
  getAllQueries: "/project/queries",
  updateQuery: (id: string) => `/project/queries/${id}/status`,
  getMyQueries: "/project/queries/my",
  pingRequest: "/ping",
  signUp: "/users/signup",
  signIn: "/users/signin",
  uploadFile: "/file/upload",
  updateProfile: "/users/update-profile",
};
