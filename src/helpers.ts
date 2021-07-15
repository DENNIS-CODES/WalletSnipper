import { bot } from "./bot";
import { UserDoc } from "./models";

const sendMessage = async (user: UserDoc[], message: string) => {
    user.map(async (u: UserDoc) => {
        try {
            await bot.telegram.sendMessage(u.tg_id, message.replace('_', ' '), { parse_mode: 'Markdown', disable_web_page_preview: true })
        } catch (error) {
            console.log(error);

        }
    }
    )
}
const between = async (min: number, max: number) => {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

const sleep = async () => {
    let ms = await between(1, 45)

    console.log(`Restarting after ${ms} seconds`)

    return new Promise(resolve => setTimeout(resolve, ms * 1000))
}
const restart = async () => {
    await sleep()
    process.exit(1)
}

export { sendMessage, restart }