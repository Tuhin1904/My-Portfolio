export const apiEndpoints = {
  postRequest: "/project/queries",
  getAllQueries: "/project/queries",
  updateQuery: (id: string) => `/project/queries/${id}/status`,
  getMyQueries: "/project/queries/my",
  pingRequest: "/ping",
  signUp: "/users/signup",
  signIn: "/users/signin",
  registerForFCM: "/users/fcm-token", //POST
  uploadFile: "/file/upload",
  updateProfile: "/users/update-profile",
  refreshToken: "/users/refresh-token",
  chatRequest: "/chat/request",
  myReqStatus: "/chat/requests/my",
  fcmToken: "/users/fcm-token",

  // For user
  viewMyChatrequestStat: "/chat/request/status",

  // For admin
  viewChatrequestOfUser: (id: string) => `/chat/request/status?userId=${id}`,
  chatReqRespond: (chatId: string) => `/chat/request/${chatId}/respond`,

  // Conversation
  getConversationByQuery: (queryId: string) => `/chat/conversations?queryId=${queryId}`,
  getConversationMessages: (conversationId: string, page: number) =>
    `/chat/conversations/${conversationId}/messages?page=${page}`,
};
