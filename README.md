# 奶娃街舞 · 本地纯前端版

项目位置：`C:\Users\kxmu3\Desktop\WorkSpace\nailong-dance-local`

## 启动

需要 Node.js 20 或更新版本，此电脑已安装。

```powershell
cd C:\Users\kxmu3\Desktop\WorkSpace\nailong-dance-local
npm start
```

也可以双击 `start.cmd`。打开 http://127.0.0.1:5173 ，点击“开跳”。
停止服务：在启动窗口按 Ctrl+C。修改文件后刷新浏览器即可。
端口被占用时设置环境变量 PORT 后启动。

不需要 npm install，没有运行时 npm 依赖。请通过本地 HTTP 服务启动，直接双击 index.html 的 file:// 模式不支持 ES 模块和模型加载。
server.mjs 只提供静态文件，不包含游戏后端或 API，仅监听本机 127.0.0.1。

## 保留的现有功能

- 开场动画、Three.js 3D 舞者与默认街头舞台。舞台选择入口和其他舞台数据、建模分支已删除。
- 默认音乐、难度选择、长条模式、无尽模式、键盘与触屏操作。
- 涂装工坊按身体涂装、全身变身、头部配饰、身体配饰、披风斗篷分为五个标签页；保留本地购买、装备和清空装扮。
- 单人成就、设置。
- 本机纪录与 localStorage 存档。
- 原站已有的本地音乐导入、节拍分析与自动谱面；音频通过 FileReader / Web Audio 在本机处理，保存在浏览器 IndexedDB 中。

## 已移除

- 舞步图鉴入口、页面、卡片内容和数据。

- 联机房间、匹配、玩家查询、分屏联机和关系绑定及关系专属赠品。
- 账号注册/登录、心跳、云存档同步。
- 全服排行榜、成绩上报、赛季舞王与每日在线挑战。
- 服务器弹幕获取（保留原有内置弹幕）。
- 远程歌曲目录，仅保留已下载的默认 music.mp3 与用户自己导入的本地音乐。
- 管理入口、玩家编号和兑换码入口。

页面和运行代码没有游戏后端请求。Three.js 0.160.0、GLTFLoader、模型、模型贴图、音乐和语音全部存放在本项目中，无需 CDN。没有新增游戏功能。

## 开发文件

- index.html / style.css：界面与样式。
- js/main.js：场景初始化、单人流程和输入。
- js/game.js：谱面、判定、计分与结算。
- js/dancer.js / js/fx.js / js/opening.js：舞者、特效和开场。
- js/ui.js：页面、涂装、成就、设置和本机存档。
- js/audio.js：背景音乐、音效和语音。
- js/chartgen.js / js/customstore.js：本地音乐分析和 IndexedDB 存储。
- vendor/three/：本地 Three.js 与其 MIT 许可证。
- gifts/、sounds/、根目录模型与音频：原站素材。

这是从公开部署文件整理得到的项目，不是作者原始开发仓库。发布脚本经过混淆；已还原字符串、属性名并格式化，但部分局部变量名称仍是 `_0x...`。保留现有实现以便继续开发。

原站：https://nailong-dance.pages.dev/
保存日期：2026-10-12。原作者署名和页面内二创说明保留。原站代码与素材的许可未在本次检查中确认；本项目未添加覆盖它们的新许可证。

## 存档

本机进度使用 naiwa_dance_local_save_v1，和原站存档键分开；音乐存入本机浏览器的 IndexedDB。更换浏览器或端口会使用不同站点存储。
Git 仓库已初始化，可自行提交初始版本后继续开发。
