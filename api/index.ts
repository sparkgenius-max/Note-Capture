import { app, setupServer } from "../server/index";

export default async function handler(req: any, res: any) {
    await setupServer();
    app(req, res);
}
