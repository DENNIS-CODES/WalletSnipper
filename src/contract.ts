import axios from 'axios'
import { Config, ProfileDoc } from './models';
import { Contract } from './types/contract';
import { Profile } from './types/profile';
require('dotenv').config();


const getSourceCode = async (address: string): Promise<Contract> => {
    const { data } = await axios({
        method: 'GET',
        url: `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY!}`
    })
    const contract: Contract = data.result[0]

    return contract


}

const createProfile = async (contract: Contract): Promise<Profile> => {

    // get telegram group if any
    let twitterMatch = contract.SourceCode.match(/(twitter.com\/\w+)|(t.co\/\w+)/g)
    let telegramMatch = contract.SourceCode.match(/(t.me\/\w+)/g)
    let websiteMatch = contract.SourceCode.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g)

    // get liquidity functions in code
    let config = await Config.findOne({ is_base: true })

    // get the interface functions
    let liquidity_functions = config?.liquidity_functions ? config?.liquidity_functions.split(',') : []
    let sell_functions = config?.sell_functions ? config?.sell_functions.split(',') : []
    let buy_functions = config?.buy_functions ? config?.buy_functions.split(',') : []
    let excluded_websites = config?.excluded_websites ? config?.excluded_websites.split(',') : []



    let websites = websiteMatch ? websiteMatch.filter((site: string) => !excluded_websites.some(excluded_site => site.includes(excluded_site.trim()))) : []


    return {
        telegram: telegramMatch ? removeDuplicates(telegramMatch).join(',') : '',
        website: removeDuplicates(websites).join(','),
        twitter: twitterMatch ? removeDuplicates(twitterMatch).join(',') : '',
        liquidity_functions: await functionsUsed(contract.SourceCode, liquidity_functions),
        sell_functions: await functionsUsed(contract.SourceCode, sell_functions),
        buy_functions: await functionsUsed(contract.SourceCode, buy_functions),
        cooldown: contract.SourceCode.includes('cooldown'),
        bots: contract.SourceCode.includes('bots'),
        openzeppelin: contract.SourceCode.includes('openzeppelin'),
    }
}
const functionsUsed = async (text: string, functions: string[]): Promise<string> => {
    functions = functions.filter((fxn: string) => text.match(new RegExp(`function ${fxn.trim()}\\(`)));
    return functions.join(',')
}

const removeDuplicates = (list: string[]) => {
    list = list.toLocaleString().toLowerCase().split(',')
    return list.filter((item: string, index: number) => {
        return list.indexOf(item) == index;
    })
}


export { getSourceCode, createProfile }