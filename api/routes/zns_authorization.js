import express from "express";
import {log} from "../../settings/logger.js";
const router = express.Router();

/**
 * GET product list.
 *
 * @return product list | empty.
 */
router.get("/", async (req, res) => {
    try {
        console.log(log(`RECEIVED AUTH CODE: `) +`${JSON.stringify(req.body)}` +'\n')
        res.json({
            status: 200,
            message: `${JSON.stringify(req.body)}`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

export default router;
