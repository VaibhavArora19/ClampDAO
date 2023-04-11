import mongoose from "mongoose";
import Reply from "./models/Reply";
import { NextApiRequest, NextApiResponse } from "next";

const MONGODB_URI = process.env.MONGODB_URI;



async function dbConnect () {
    
    if(MONGODB_URI === undefined) return;
    
    mongoose.connect(MONGODB_URI).then(mongoose => {
        return mongoose
    })
    
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();
    const { method } = req;

    if(method === 'GET') {
        const replies = await Reply.findOne({proposalId: req.query.proposals});

        res.status(200).json(replies);

    } 
    else if(method === 'POST') {
        const replies = await Reply.findOne({proposalId: req.body.proposalId});

        if(!replies) {
            console.log('didnot found');
            const newReply = new Reply({
                proposalId: req.body.proposalId,
                replies: [{address: req.body.address, reply: req.body.reply}]
            });

            const data = await newReply.save();
            
            res.status(201).json(data);
        }else {
            replies.replies.push({address: req.body.address, reply: req.body.reply});

            const data = await replies.save();

            res.status(201).json(data);
        }
    }

}