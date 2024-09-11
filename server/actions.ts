import { Request, Response } from 'express';

interface PostData {
    req: Request;
    res: Response;
    path: string;
    sequelize: any;
}

export default {
    post: async (data: PostData) => {
        const { req, res, path, sequelize } = data;
        try {
            console.log(req.body)
            var Action = await import(`${path}/models/actionModel`);
            console.log(Action)
            Action = Action.default(sequelize)
            console.log(Action)
            var newAction = await Action.create(req.body);
        } catch {
            return res.status(500).send("ошибка 500");
        }
        return res.status(201).json({ message: 'Создано успешно', data: newAction });
    },
    get: async (data: PostData) => {
        const { req, res, path, sequelize } = data;
        var Action = await import(`${path}/models/actionModel`);
        Action = Action.default(sequelize)
        var Actions = await Action.findAll();
        return res.status(200).json({ data: Actions });
    }
}