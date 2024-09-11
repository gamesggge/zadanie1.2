import { Request, Response } from 'express';

interface PostData {
    req: Request;
    res: Response;
    path: string;
    sequelize: any;
}

export default {
    get: async (data: PostData) => {
        const { res } = data
        res.sendFile(__dirname + '/html/main.html')
    }
}