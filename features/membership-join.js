/**
 * membership-join.js
 * 
 * 
 */

module.exports = function(controller) {
    
    controller.on('memberships.created', async(bot, message) => {
        
        // continue in a group room only
        if (message.data.roomType != 'group') {
            return;
        }
        
        let room = await bot.api.rooms.get(message.data.roomId);
        
        // if this membership is the bot itsself joining a space
        if (message.reference.bot.id == message.data.personId) {
            console.log('Bot asked to join space ' + room.title);
            
            return;
        }
        
        let roomCreator = await bot.api.people.get(room.creatorId);
        
        // delete membership if the added person is from a different org
        if (roomCreator.orgId != message.data.personOrgId) {
            console.log(message.data.personDisplayName + " added to " + room.title + " from a different org!");
            let personActor = await bot.api.people.get(message.actorId);
            
            // If the space is moderated, find out if the bot is a moderator
            if (room.isLocked) {
                let botMembership = await bot.api.memberships.list({
                    'personId': message.reference.bot.id,
                    'roomId': message.channel
                });
                
                // If the bot is not a moderator, respond but do not attept to remove the membership
                if (!botMembership.items[0].isModerator) {
                    await bot.reply(message, {markdown: "**" + personActor.displayName + "** tried to add **" +
                    message.data.personDisplayName + "** from an external organization. This room is internal only! " +
                    "<br><br>*Please add me as a moderator if you would like me to automatically remove new external users.*"});
                    
                    return;
                }
            }
            
            await bot.reply(message, {markdown: "**" + personActor.displayName + "** tried to add **" +
            message.data.personDisplayName + "** from an external organization. This room is internal only!"});
                
            await bot.api.memberships.remove(message.data.id);
        }
        
    });
}