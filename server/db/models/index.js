const Conversation = require('./conversation');
const User = require('./user');
const Message = require('./message');
const Participant = require('./participant');
const Group = require('./group');

// associations

User.hasMany(Conversation);
Group.hasOne(Group);
Conversation.belongsTo(User, { as: 'creatorId' });
Conversation.belongsTo(Group, { as: 'groupId' });

Message.belongsTo(Conversation);
Conversation.hasMany(Message);

Group.hasMany(Participant);
User.hasMany(Participant);
Participant.belongsTo(Group, { as: 'groupId' });
Participant.belongsTo(User, { as: 'userId' });

module.exports = {
  User,
  Conversation,
  Message,
  Group,
  Participant,
};
