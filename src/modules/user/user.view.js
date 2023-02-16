const UserView = {
  user: ({ rows }) => {
    return {
      id: rows.id,
      fullname: rows.fullname,
      nickname: rows.nickname,
      email: rows.email,
      socketId: rows.socketId,
    };
  },
};
