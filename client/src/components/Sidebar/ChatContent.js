import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: 'bold',
    letterSpacing: -0.2,
  },
  previewText: (props) => ({
    fontSize: 12,
    color: props.unread ? 'black' : '#9CADC8',
    letterSpacing: -0.17,
    fontWeight: props.unread ? 'bold' : null,
  }),
  countNotification: {
    height: 20,
    width: 20,
    backgroundColor: '#3F92FF',
    marginRight: 10,
    color: 'white',
    fontSize: 10,
    letterSpacing: -0.5,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  center: {
    alignSelf: 'center',
  },
}));

const ChatContent = (props) => {
  const { conversation, user } = props;
  const { unreadMessagesQty, messages, latestMessageText, otherUser } = conversation;

  const styleProps = { unread: unreadMessagesQty > 0 && messages[messages.length - 1].senderId !== user.id };
  const classes = useStyles(styleProps);

  const MessageCount = () => {
    return unreadMessagesQty > 0 && messages[messages.length - 1].senderId !== user.id && (
      <Box className={classes.center}>
        <Typography className={classes.countNotification}>{unreadMessagesQty}</Typography>
      </Box>
    );
  };

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>{otherUser.username}</Typography>
        <Typography className={classes.previewText}> {latestMessageText}</Typography>
      </Box>
      <MessageCount></MessageCount>
    </Box>
  );
};

export default ChatContent;
