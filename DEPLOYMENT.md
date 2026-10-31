# GitHub Pages 发布

当前版本是纯静态网站：不需要 npm 构建、Python 后端、数据库或密钥。当前文件夹尚未初始化 Git 仓库，本次没有创建远程仓库、推送或部署。

## 发布步骤

1. 将本文件夹作为仓库根目录上传至 GitHub，包含隐藏目录 `.github/` 和 `work/` 中的部署脚本。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 确保默认发布分支为 `main`；若使用其他分支，修改 `.github/workflows/pages.yml` 的 `branches`。
4. 推送至 `main`，或到 Actions 手动运行 **Deploy Ourspace to GitHub Pages**。
5. 使用工作流输出的 HTTPS Pages 地址分享。项目仓库的常见地址形式为 `https://用户名.github.io/仓库名/`；本地 `127.0.0.1:8765` 不能发给别人使用。

官方流程：[Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

工作流先运行 `python work/check_site.py`，再运行 `python work/prepare_pages.py`。后一脚本仅打包运行所需的页面、脚本、样式、素材和来源记录至 `_site/`，不包含本地服务、过程截图、备份或审核文档；入口脚本、样式与引擎配置会按内容生成缓存版本。

## 公开版本的功能边界

- 访客可以选择天气、使用日记和画笔、添加贴纸、选择情绪、阅读三段社区演示故事。
- 日记按日期保存在各自浏览器的 localStorage；不上传，不跨设备同步，不发送给其他访客。浏览器禁止存储或空间不足时，页面提示草稿仅留在当前标签页。
- 固定的社区演示不提供真实投稿，家具也不会因访客写日记自动增加。
- 无需把 Python 服务上传为后端。`work/serve.py` 只用于本地预览。

## 发布前还需要的验收

- 实际走一遍桌面浏览器和手机：完整页面流程、鼠标笔刷、Mood Meter、输入与绘画、返回、故事点击及字体换行。
- 测试首次进入后的声音是否能启动，以及离开和回到标签页时的声音行为。
- 确认第三方内容的公开再发布授权。目前 `SOURCES.md` 是来源记录，不是授权文件；新增字体的 OFL 授权只覆盖字体。
- 在真实 Pages 地址再走一次完整流程，查看是否出现 404、浏览器控制台错误或资源加载失败。
