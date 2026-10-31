# 素材与代码来源

参考作品：[Brainstream](https://brainstream.nfb.ca/)。导演及动画 Caroline Robert；创作 AATOAA；制作 National Film Board of Canada；原站程序 Édouard Lanctôt-Benoit；音乐及声音 Mathieu Charbonneau。

本交付是原站公开客户端的本地开场裁剪与适配，复用了其渲染程序、矢量动画、手写文字图片、背景着色器、光标、纹理和开场音频。不是独立重写的原创作品，也没有将第三方素材声明为自有资产。素材来源及文件校验值见 `SOURCES.json`；本地修改见 `vendor/ADAPTATIONS.md`。

原始浏览器程序：
https://dh14yw95vdh5m.cloudfront.net/js/build/main.11cfb1e810c4c78a6ce3.js

原始样式：
https://dh14yw95vdh5m.cloudfront.net/css/build/main.d7bab56db5afb3faecff25cb6b79fd32.css

主要画面中的文字是原作矢量轮廓或 PNG，不依赖替代手写字体。顶部 FR 标签及辅助信息页使用系统字体。部署状态以实际 GitHub Pages 发布结果为准。


新增界面字体：Patrick Hand，来自 Google Fonts 的 `ofl/patrickhand`，随项目自托管；许可证见 `assets/fonts/OFL-PatrickHand.txt`。该许可证仅适用于字体，不涵盖上述原作引擎或音频。


白框提示及故事正文另采用 Coming Soon（Google Fonts 官方仓库 `apache/comingsoon`），用于接近原作较细、较疏朗的手写质感。字体文件为 `assets/fonts/ComingSoon-Regular.ttf`，授权文本为 `assets/fonts/LICENSE-ComingSoon.txt`。原作提示本身是逐笔矢量动画，新提示使用字体与逐字互动，二者并非同一套字形。


2026-11-01：七处固定提示改用生成的透明底手绘文字 PNG，位于 `assets/handwritten/`。参照用户提供的耳机提示笔画风格生成新英文句子，并以独立素材保存。原 PNG 未改写像素，`handwritten-assets.js` 记录显示视口；`handwritten-pictures.js` 提供加载备用文字、可读文本及图片形变。Coming Soon 仅用于正文与图片加载前的文字。
