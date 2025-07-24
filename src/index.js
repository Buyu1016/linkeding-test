const { resolve } = require("path");
const { extractLinkedinResultsFromTxt, fetchLinkedinResultsTxt } = require("./utils/linkedin");
const fs = require('fs');
const xlsx = require('node-xlsx');

/**
 * 导出linkedin数据为excel
 */
async function exportLinkedinPeoplesExcel(sheetName) {
    /**
     * 1. 通过keyword拼接结果请求url
     * 2. 请求url获取数据
     * 3. 解析数据
     * 4. 数据保存为excel文件
     */
    // 获取resources目录下所有的txt文件路径
    const txtFilePath = resolve(__dirname, "../resources");
    let files = await fs.readdirSync(txtFilePath);
    const urls = files.map(t => {
        return resolve(__dirname, "../resources", t);
    });
    const data = (await Promise.all(urls.map(t => extractLinkedinResultsFromTxt(t))))
        .filter(t => t)
        .flat();
    const result = [["姓名", "职位", "标题其余", "简介", "领英主页"]];
    data.forEach(item => {
        const [name, job, ...otherInfo] = item.richSnippet.metatags.ogTitle.split("-")
        result.push([
            name,
            job,
            otherInfo,
            item.richSnippet.metatags.ogDescription,
            item.richSnippet.metatags.alAndroidUrl
        ]);
    });
    const buffer = xlsx.build([{
        name: sheetName,
        data: result
    }]);
    const timestamp = new Date().toISOString();
    fs.writeFileSync(`${sheetName}_领英数据_${timestamp}.xlsx`, buffer);
};

exportLinkedinPeoplesExcel("百时美施贵宝",);