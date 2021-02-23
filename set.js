/**
 * Created by miyaye on 2020/1/11.
 */
/**
 * Created by 51375 on 2017/7/8.
 */

let fs = require('fs');
let basepath = 'src/';
let moment = require('moment');
let cptName = process.argv.splice(2)[0];
let path = cptName.split('/');
let name = path[path.length - 1];
let writes = [`${name}.js`, `${name}.html`, `${name}.less`, `index.js`];
let reads = [`${basepath}components/cptTemp/index.js`, `${basepath}components/cptTemp/cptTemp.html`,
`${basepath}components/cptTemp/cptTemp.less`,
`${basepath}components/cptTemp/cptTemp.js`];
let file = [];
let author = require('os').homedir().split('\\').pop();

//检测是否存在文件夹
let exists = function () {
    return new Promise((res, rej) => {
        (async function () {
            for (let a of path) {
                fs.existsSync(basepath + a) ? basepath = `${basepath}${a}/` : await mkdir(a);
            }
            res(basepath);
        })()
    })
}
//建立文件夹
let mkdir = function (a) {
    return new Promise((res, rej) => {
        fs.mkdir(basepath + a, (err) => {
            if (err) rej(err);
            basepath = `${basepath}${a}/`
            res(basepath);
        });
    })
}
//读取模板文件内容，并替换为目标组件
let readFile = function () {
    return new Promise((res) => {
        for (let a of reads) {
            let text = fs.readFileSync(a).toString();
            text = text.replace(/time/g, moment().format('YYYY/MM/DD'))
                .replace(/temp/g, name)
                .replace(/author/g, author)
            file.push(text)
        }
        res(file);
    })
}
//生成文件，并填入之前读取的文件内容
let writeFile = function (file) {
    return new Promise((res, rej) => {
        (async function () {
            for (let [index,a] of writes.entries()) {
                console.log(a)
                await fs.writeFile(`${basepath}/${a}`,
                    file[index], (err) => {
                        if (err) rej(err)
                    })
            }
            res('succ');
        })()
    })
}
async function creatCpt() {
    try {
        await exists();
        await readFile()
        await writeFile(await readFile());
        return console.log(`Successfully created ${name} component`)
    }
    catch (err) {
        console.error(err);
    }
}
creatCpt();