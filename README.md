# 抢红包
![魔筷Logo](https://sjmhgl.mockuai.com/favicon.ico)

## 前言
### 业务说明
运营活动抢红包小游戏

## 技术
### 使用H5引擎Laya2.0：使用版本号（2.6.1）开发
> http://ldc2.layabox.com/layadownload/?language=zh&type=layaairide-LayaAir%20IDE%202.10.0beta

### Laya类库：2.6.1

### 启动方式
  ```
  下载Laya2.0IDE
  http://ldc2.layabox.com/layadownload/?language=zh&type=layaairide-LayaAir%20IDE%202.10.0beta
  IDE页面F6调试
  chrome如有跨域问题使用命令：
  open -n /Applications/Google\ Chrome.app/ --args --disable-web-security  --user-data-dir=/Users/$USER/work/MyChromeDevUserData
  ```

## 项目结构
```
├── README.md 
├── bin                      //项目的输出目录
├── laya                     //UI项目目录
├── libs                     //项目库目录
├── redpacket.laya
├── release                  //发布目录
│   └── web
├── src                      //项目的源代码目录
│   ├── GameConfig.ts
│   ├── Main.ts
│   ├── script
│   └── ui
└── tsconfig.json
```


## 注意事项
### 类库切换后报错 ？
  ```
  要将LayaAirIDE安装到启动台
  ```
