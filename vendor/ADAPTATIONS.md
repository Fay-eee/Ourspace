# Opening-only adaptation

The rendering engine is the original public Brainstream browser bundle, not a newly written substitute. It embeds Three.js, jQuery, and the original spline, pointer, shader, transition, and audio processing code.

Changes in `brainstream-engine.js`:
- Force production asset loading locally, avoiding the original development file-list endpoint.
- Disable saved narrative progress; refresh always starts at the title.
- Disable the original co-presence WebSocket connection.
- Disable injection of the NFB remote navigation/analytics application; `local.css` and `index.html` provide local navigation chrome.
- Prevent timeline audio preloading for the unreachable post-opening placeholder.
- Before attempting an introduction transition, clear all advance flags if `currentIntro === 4` and no transition is in flight. The render/update loop continues.
- Emit `brainstream:state` when each opening transition completes.

`data/timeline.json` includes only the five observed opening states. State 4 also disables onClick/onRelease and has no automatic duration. A dormant placeholder satisfies engine initialization; the hard stop makes it unreachable. `data/presets.json` contains only the eight opening presets (including mobile variants and intro audio). The auxiliary eye initialization entry is inert in these opening scenes.

`local.js` replaces AnalyticsController and StorageController with local no-op adapters before loading the bundle. No analytics, story audio, co-presence server, or remote menu is started. All resources required by the tested opening are local. Optional `?qa=1` enables diagnostic reporting to the local QA server only; it is off for normal use.

The original engine is minified. Put new story content in separate, readable modules, connecting at `brainstream:ready-for-continuation`; do not build new narrative behavior by editing minified vendor code.

## 2026-10-27：专注故事与鼠标交互

- 移除本地顶栏、品牌链接、原站 favicon、介绍/分享/作者页面及问号入口；保留引擎初始化所需的空 DOM 钩子，并设为 hidden/inert。
- 禁用制作方 Logo 开场。
- 标题动画的作者署名属于 SVGC 二进制绘图第 2 层，已从全部 12 帧移除；同步更新序列包、偏移和样条元数据。其余标题线条保持原样。处理脚本：`work/remove_title_credit.py`（项目根目录）。已更新修改素材的校验标识，避免继续使用浏览器中的旧缓存。
- 原始素材来源和制作方信息仍记录于 SOURCES.md，用于项目溯源。

## 2026-10-31：Ourspace 转场接管

原引擎通过 pressedThisFrame 触发开场推进，早于 DOM click。耳机提示（currentIntro === 1）的转场现在发出 ourspace:open-weather 并清空推进标记，在引擎层阻止进入旧的 2033 年背景介绍。Ourspace 模块接收事件进入天气页；首页到耳机提示的转场保持。

## 原生光标延续

WebGL 上下文启用 alpha，前两幕仍按原逻辑清屏和绘制。后续页面设置 OurspaceNativeCursorActive 时，SequenceRenderer.render 直接用透明清屏绘制原 cursorScene，其余更新、SVGC 笔画帧、按压／释放与运动控制仍由原引擎执行。brush-cursor.js 将同一原 canvas 置于页面上层，并将鼠标事件传给原 #main／window 处理函数；没有另建 Canvas 2D 拖尾或更新算法。

移动光标修复：原来的流动鼠标线是主 scene 中的 lineCursor，不在 cursorScene（按压／静止笔画）中。后续透明渲染现在临时隐藏叙事 container，再绘制主 scene，以保留原 lineCursor；之后按需绘制 cursorScene，并恢复 container 可见状态。验证包括无按压帧也会绘制移动层，以及隐藏状态正确恢复。
