/**
 * help.js
 * 
 * 
 */

module.exports = function(controller) {
    
    controller.on('message,direct_message', async(bot, message) => {
        
        var text = "I am the CompanyOnly bot! Add me to a group room, and I will keep external users out.";
        text += "<br />`leave` - ask me to leave the room";
        
        await bot.reply(message, {markdown: text});
        
    });
    
}