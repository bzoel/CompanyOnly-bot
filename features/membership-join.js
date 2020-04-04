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
        
        
        let room = await bot.api.room.get(message.data.roomId);
        let roomCreator = await bot.api.people.get(room.creatorId);
        
        // delete membership if the added person is from a different org
        if (roomCreator.orgId != message.orgId) {
            let personActor = await bot.api.people.get(message.actorId)
            let personAddedOrg = await bot.api.organization.get(message.data.personOrgId);
            await bot.reply(message, {markdown: "**" + personActor.displayName + "** tried to add **" +
                message.data.personDisplayName + "** from **" + personAddedOrg.displayName + "**. This room is internal only!"});
                
            await bot.api.memberships.remove(message.data.id);
        }
        
    });
}