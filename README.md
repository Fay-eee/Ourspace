# Ourspace

手绘风格的静态交互网站，包含天气选择、个人手账和社区故事演示。

## 本地预览

双击 `start.command`，或运行：

```sh
python3 work/serve.py
```

打开 http://127.0.0.1:8765/ 。本地服务禁用缓存，直接读取工作目录。

## 当前流程

Ourspace → Enter → 耳机提示 → 天气选择 → 回应短句 → My Space / Our Space。

- **My Space**：书桌 → 笔记本封面 → 手账。左侧有情绪坐标和感受输入，右侧写日记；两处＋分别打开 Mood Meter 和手账工具。日记、情绪及标记按日期保存在当前浏览器。
- **Our Space**：三个座位对应三段虚构的第一人称故事；悬停查看、点击固定、关闭后继续选择。当前没有共享存储或真实投稿。

## 编辑位置

| 文件 | 内容 |
| --- | --- |
| `index.html` | 页面入口、标题与资源配置 |
| `ourspace.js` / `local.css` | 天气选择与开场接管 |
| `myspace.js` / `myspace.css` | 双空间、书桌、笔记本、手账、Mood Meter 和社区 |
| `transitions.js` | 页面过渡与重复点击保护 |
| `interactive-text.js` | 白框文字的局部鼠标形变 |
| `brush-cursor.js` | 原 WebGL 光标在后续页面的显示与事件接入 |
| `vendor/` / `data/` / `assets/` | 原引擎、配置、声音和画面素材 |

## 发布与检查

参见 `DEPLOYMENT.md` 的 GitHub Pages 操作步骤，以及 `REVIEW.md` 的本轮修复和验证范围。

```sh
python3 work/check_site.py
python3 work/prepare_pages.py
```

发布内容生成于 `_site/`；已提供 `.github/workflows/pages.yml`，没有执行远程发布。

素材来源见 `SOURCES.md`，引擎适配见 `vendor/ADAPTATIONS.md`。公开再发布原作内容的授权状态仍需确认。
