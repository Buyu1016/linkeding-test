const { resolve } = require("path");
const { extractLinkedinResultsFromTxt, fetchLinkedinResultsTxt } = require("./utils/linkedin");
const fs = require('fs');

/**
 * 导出linkedin数据为excel
 */
async function exportLinkedinPeoplesExcel() {
    /**
     * 1. 通过keyword拼接结果请求url
     * 2. 请求url获取数据
     * 3. 解析数据
     * 4. 数据保存为excel文件
     */
    // 获取resources目录下所有的txt文件路径
    const txtFilePath = resolve(__dirname, "../resources");
    let files = await fs.readFile(txtFilePath);
    console.log(files);
    // extractLinkedinResultsFromTxt();
};

exportLinkedinPeoplesExcel();

// 测试示例
async function test() {
}

// 执行测试
test();