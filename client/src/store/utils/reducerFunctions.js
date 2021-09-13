export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.unreadMessageQty += 1;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      newConvo.unreadMessageQty += 1;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const setMessagesReadInStore = (state, recipientId, convoId) => {
  return state.map((convo) => {
    // Find current conversation
    if (convo.id === convoId) {
      const convoCopy = { ...convo };

      let lastSentMessage = {
        id: 0,
        idx: 0,
      };

      // Set all messages isRead = true and isLastRead = false
      convoCopy.messages = convoCopy.messages.map((message, idx) => {
        if (recipientId !== message.senderId) {
          const messageCopy = { ...message };

          messageCopy.isRead = true;
          messageCopy.isReadLast = false;

          if (messageCopy.id > lastSentMessage.id) {
            lastSentMessage.id = messageCopy.id;
            lastSentMessage.idx = idx;
          }

          return messageCopy;
        } else {
          return message;
        }
      });

      // Set isLastRead for last message to true
      convoCopy.messages[lastSentMessage.idx].isReadLast = true;
      convoCopy.unreadMessagesQty = 0;

      return convoCopy;
    } else {
      return convo;
    }
  });
};
