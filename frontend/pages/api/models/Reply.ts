import mongoose from "mongoose"

const replySchema = new mongoose.Schema({
    proposalId: String,
    replies: [{
        address: String,
        reply: String
    }]
})

module.exports =  mongoose.models.Reply || mongoose.model("Reply", replySchema);