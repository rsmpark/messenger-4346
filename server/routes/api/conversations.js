const router = require('express').Router();
const { User, Conversation, Message } = require('../../db/models');
const { Op, literal } = require('sequelize');
const onlineUsers = require('../../onlineUsers');

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: {
        include: [
          [
            // Sub-query to find the last message date for each conversation
            literal(`
            (SELECT MAX("message"."createdAt")
              FROM "messages" AS "message"
              WHERE "message"."conversationId" = "conversation"."id")`),
            'lastMessageDate',
          ],
        ],
      },

      order: [
        // Order conversation by last message date (DESC) -> order messages by date (ASC)
        [literal(`"lastMessageDate"`), 'DESC'],
        [Message, 'createdAt', 'ASC'],
      ],
      include: [
        { model: Message },
        {
          model: User,
          as: 'user1',
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ['id', 'username', 'photoUrl'],
          required: false,
        },
        {
          model: User,
          as: 'user2',
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ['id', 'username', 'photoUrl'],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      conversations[i] = convoJSON;

      const countUnreadMessages = (unreadTotal, message) => {
        if (userId !== message.senderId && !message.isRead) {
          return unreadTotal + 1;
        } else {
          return unreadTotal;
        }
      };

      conversations[i].unreadMessagesQty = conversations[i].messages.reduce(countUnreadMessages, 0);
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
