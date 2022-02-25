import ora from 'ora';
import chalk from 'chalk';
import globby from 'globby';
import { resolve } from 'path';

const COS = require('cos-nodejs-sdk-v5');

export default function({
    region = 'ap-shanghai',
    secretKey = '',
    secretId = '',
    bucket = '',
    path = '',
    remotePath = '/'
} = {}) {
    return {
        name: 'tc-cos-plugin',
        async closeBundle() {
            if (!remotePath.startsWith('/') || !remotePath.endsWith('/')) {
                console.error('remotePath必须以/开头,以/结尾');
                return;
            }

            path = resolve(process.cwd(), path);

            const spinner = ora();
            const cos = new COS({
                SecretKey: secretKey,
                SecretId: secretId,
            });

            const filePaths = await globby(path);

            for (const filePath of filePaths) {
                const remoteFilePath = resolve(remotePath, filePath.replace(`${path}/`, ''));
                spinner.info(chalk.yellow(`正在发布文件: ${remoteFilePath}`));
                await cos.sliceUploadFile({
                    Bucket: bucket,
                    Region: region,
                    Key: remoteFilePath,
                    FilePath: filePath,
                });
                spinner.succeed(chalk.green(`成功发布文件: ${remoteFilePath}`));
            }

            spinner.succeed(chalk.green('全部发布成功'));
        }
    }
}