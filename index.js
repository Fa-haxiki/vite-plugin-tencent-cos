const colors  = require('colors')
const glob = require('glob');
const { resolve } = require('path');
const COS = require('cos-nodejs-sdk-v5');

module.exports =  function vitePluginTencentCos({
    region = 'ap-shanghai',
    secretKey = '',
    secretId = '',
    bucket = '',
    path = '',
    remotePath = '/'
} = {}) {
    return {
        name: 'vite-plugin-tencent-cos',
        async closeBundle() {
            if (!remotePath.startsWith('/') || !remotePath.endsWith('/')) {
                console.error('remotePath必须以/开头,以/结尾');
                return;
            }

            path = resolve(process.cwd(), path);

            const cos = new COS({
                SecretKey: secretKey,
                SecretId: secretId,
            });

            const filePaths = await glob.sync(path + '/**/*');

            for (const filePath of filePaths) {
                const remoteFilePath = resolve(remotePath, filePath.replace(`${path}/`, ''));
                console.log(colors.yellow(`正在发布文件: ${remoteFilePath}`));
                await cos.sliceUploadFile({
                    Bucket: bucket,
                    Region: region,
                    Key: remoteFilePath,
                    FilePath: filePath,
                });
                console.log(colors.green(`成功发布文件: ${remoteFilePath}`));
            }

            console.log(colors.green('全部发布成功'));
        }
    }
}