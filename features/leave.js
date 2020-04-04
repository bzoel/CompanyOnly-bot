/**
 * leave.js
 * 
 * 
 */

module.exports = function(controller) {
    
    controller.hears('leave', 'message', async(bot, message) => {
        
        let room = await bot.api.rooms.get(message.channel);
        
        // Only listen to moderators if the room is locked
        if (room.isLocked) {
            let actorMembership = await bot.api.memberships.list({
                'personId': message.actorId,
                'roomId': message.channel
            });
            
            // if actor is not a moderator, respond but do not leave
            if (!actorMembership.items[0].isModerator) {
                await bot.reply(message, {markdown: "This room is moderated. Please ask a moderator to ask me to leave!"});
                
                return;
            }
            
        }
        
        let botMembership = await bot.api.memberships.list({
            'personId': message.reference.bot.id,
            'roomId': message.channel
        });
        
        await bot.reply(message, {markdown: "I'm leaving! This space will be open to users from all organizations. " + 
        "You can add me back at any time."});
        await bot.api.memberships.remove(botMembership.items[0].id);
        
        console.log('Bot asked to leave space ' + room.title);
        
    });
    
}