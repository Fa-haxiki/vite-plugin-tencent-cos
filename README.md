## vite-plugin-tencent-cos

---

vite腾讯云COS上传

### Install

```
yarn add vite-plugin-tencent-cos -D
```

### Usage

``` ts
// vite.config.ts

export default defineConfig({
    plugins: [
        tcCosPlugin({
            secretKey: 'xxxxxxxxxxxxx',
            secretId: 'xxxxxxxxxxxxxxxxx',
            bucket: 'xxxxxxxxxxxxxx',
            remotePath: '/react/', // 目录名称
            path: './public/', // 需要上传的本地文件地址
        }),
    ]
})

```
