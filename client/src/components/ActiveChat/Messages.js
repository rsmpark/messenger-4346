import React from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '../ActiveChat';
import moment from 'moment';

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  const readMessages = messages.filter((message) => message.senderId === userId && message.isRead);
  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            isReadLast={readMessages.length != 0 && message.id === readMessages[readMessages.length - 1].id}
          />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
