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
  refreshToken: "/users/refresh-token",
  chatRequest: "/chat/request",
  myReqStatus: "/chat/requests/my",
  updateFcmToken: "/users/fcm-token",
  verifyOtp: "/users/verify-otp",
  resendOtp: "/users/resend-otp",
  forgotPassword: "/users/forgot-password",
  resetPassword: "/users/reset-password",

  // For user
  viewMyChatrequestStat: (queryId: string) => `/chat/request/status?queryId=${queryId}`,

  // For admin
  viewChatrequestOfUser: (userId: string, queryId: string) => `/chat/request/status?userId=${userId}&queryId=${queryId}`,
  viewPendingChatRequests: (queryId: string) => `/chat/requests/pending?queryId=${queryId}`,
  chatReqRespond: (chatId: string) => `/chat/request/${chatId}/respond`,

  // Conversation
  getConversationByQuery: (queryId: string) => `/chat/conversations?queryId=${queryId}`,
  getConversationMessages: (conversationId: string, page: number) =>
    `/chat/conversations/${conversationId}/messages?page=${page}`,
  getChatHistory: (queryId: string) => `/project/queries/${queryId}/history`,
};
