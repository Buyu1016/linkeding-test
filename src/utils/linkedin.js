const fs = require('fs').promises;
const axios = require("axios");

const request = axios.create({
    baseURL: 'https://cse.google.com/',
    timeout: 10000,
});

/**
 * 从非标准JSON格式的TXT文件中提取results结构
 * @param {string} filePath - TXT文件路径
 * @returns {Array} 提取出的results数组（若不存在则返回空数组）
 */
async function extractLinkedinResultsFromTxt(filePath) {
    try {
        // 1. 读取文件原始内容
        const rawContent = await fs.readFile(filePath, 'utf8');
        
        // 2. 清理无关内容
        let cleanedContent = rawContent
            // 移除CDATA标记
            .replace(/<!\[CDATA\[|\]\]>/g, '')
            // 移除注释（如/*O_o*/）
            .replace(/\/\*.*?\*\//g, '')
            // 移除包裹JSON的函数调用（如google.search.cse.api19417(...)）
            .replace(/^[^\{]+/, '') // 移除开头到第一个{之前的内容
            .replace(/\)[^\}]*$/, ''); // 移除最后一个}之后的内容
        console.log(cleanedContent);
        // 3. 尝试解析JSON
        const parsedData = JSON.parse(cleanedContent);
        
        // 4. 提取results数组（容错处理）
        if (parsedData && Array.isArray(parsedData.results)) {
            console.log(`成功提取到results数组，共${parsedData.results.length}条数据`);
            return parsedData.results;
        } else {
            console.warn('文件中未找到有效的results数组');
            return [];
        }
    } catch (error) {
        console.error('提取results失败:', error.message);
        // 详细错误排查信息
        if (error.name === 'SyntaxError') {
            console.error('JSON解析错误，可能是格式清理不彻底');
        }
        return [];
    }
};

/**
 * 获取LinkedIn搜索结果TXT文件
 * @param {string} keyword - 搜索关键词
 * @param {number} num - 搜索结果数量
 * @returns {Promise<string>} 搜索结果TXT文件路径
 */
async function fetchLinkedinResultsTxt(keyword) {
    const res = await request.get("cse.js", {
        params: {
            sca_esv: "76514260854d2b95",
            hpg: "1",
            cx: "000470283453218169915:hcrzdwsiwrc"
        }
    }).catch(e => {
        console.log(e);
    });
    console.log(res);
    // 1, 3, 5, 7, 9
    const pages = [1, 3, 5, 7, 9];
    // https://cse.google.com/cse/element/v1?
    // =filtered_cse&num=10&hl=zh-CN&source=gcsc&cselibv=197b0e284b1b1f14&cx=000470283453218169915%3Ahcrzdwsiwrc&q=%E7%99%BE%E6%97%B6%E7%BE%8E%E6%96%BD%E8%B4%B5%E5%AE%9D&safe=off&cse_tok=AB-tC_6oK5a5mWlzfD8PUm1CRHzT%3A1753066354160&sort=&exp=cc&fexp=72986053%2C72986052&cseclient=hosted-page-client&callback=google.search.cse.api19417

    // https://cse.google.com/cse/element/v1?
    // rsz=filtered_cse&num=10&hl=zh-CN&source=gcsc&cselibv=197b0e284b1b1f14&cx=000470283453218169915%3Ahcrzdwsiwrc&q=%E6%B5%8B%E8%AF%95&safe=off&cse_tok=AB-tC_4JdDrJURc4eIHEqhD331hb%3A1753073479301&sort=&exp=cc&fexp=72986053%2C72986052&oq=%E6%B5%8B%E8%AF%95&gs_l=partner-generic.12...0.0.0.3867.0.0.0.0.0.0.0.0..0.0.csems%2Cnrl%3D10...0.....34.partner-generic..0.0.0.&cseclient=hosted-page-client&callback=google.search.cse.api6817&rurl=https%3A%2F%2Fcse.google.com%2Fcse%3Foe%3Dutf8%26ie%3Dutf8%26source%3Duds%26q%3D%25E6%25B5%258B%25E8%25AF%2595%26safe%3Doff%26sort%3D%26cx%3D000470283453218169915%3Ahcrzdwsiwrc%26label%3D2%26start%3D10%2522%23gsc.tab%3D0%26gsc.q%3D%25E6%25B5%258B%25E8%25AF%2595%26gsc.sort%3D
    // return Promise.all(pages.map(page => {
        const url = new URL(`https://cse.google.com/cse/element/v1`);
        const query = {
            rsz: "filtered_cse",
            num: 99999,
            hl: "zh-CN",
            source: "gcsc",
            cselibv: "197b0e284b1b1f14",
            cx: "000470283453218169915:hcrzdwsiwrc",
            safe: "off",
            cse_tok: "AB-tC_47DNkDa3pDGVD4IyTtu489:1753076970010", // 需要生成
            sort: "",
            exp: "cc",
            fexp: "72986053,72986052",
            cseclient: "hosted-page-client",
            callback: `google.search.cse.api${ Math.floor(Math.random() * 2E4) }`
        };
        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key)) {
                url.searchParams.set(key, query[key]);
            }
        }
        console.log(url.toString());
        // return fetch(url)
        //     .then(response => response.text())
        //     .then(text => {
        //         // 创建临时文件
        //         const tempFilePath = `temp_linkedin_${page}.txt`;
        //         return fs.writeFile(tempFilePath, text)
        //     })
    // }))
};

exports.extractLinkedinResultsFromTxt = extractLinkedinResultsFromTxt;
exports.fetchLinkedinResultsTxt = fetchLinkedinResultsTxt;