# 文件上传与管理

这一页主要讲：**Pro 项目里怎么做上传。**

如果你的后台项目涉及：

- 图片上传
- 视频上传
- 附件上传
- 文件管理

那这一页通常都会用到。

## 最常用的上传组件

```ts
import { DuxFileUpload, DuxImageUpload, DuxVideoUpload, DuxFileManage } from '@duxweb/dvha-pro'
```

最简单理解：

- `DuxFileUpload`：文件上传
- `DuxImageUpload`：图片上传
- `DuxVideoUpload`：视频上传
- `DuxFileManage`：文件管理

## 上传配置一般放哪

上传相关配置一般放在管理端扩展配置里，也就是 `IManage.upload`。

你可以先理解成：

- 上传走什么方法
- 上传到哪里
- 是否需要签名

这些都放这里。

## 最常见使用场景

这组能力最常见用于：

- 表单里的图片字段
- 商品封面图上传
- 视频素材上传
- 附件管理
- 媒体库场景

## 最常见问题

### 组件能显示，但上传失败

先检查：

- 上传接口路径
- 上传方法
- 服务端返回格式

### S3 上传不生效

先检查：

- `driver` 是否正确
- 签名接口是否配置正确

## 下一步建议

如果你的项目还需要做动态表单或远程页面，可以继续看：

- [`JSON Schema 动态表单`](/pro/course/json-schema)
- [`远程组件与微前端`](/pro/course/remote)
