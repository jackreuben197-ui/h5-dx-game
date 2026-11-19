# style2 内容容量与身份间距修订 · 2026-11-19

本报告记录用户截图反馈后的实现修正，覆盖早期“认证单独一行”方案；基准style1截图没有重拍或覆盖。

## 最终规则

- 竖屏底栏为单排64px加实际安全区，3/4/6个按钮与认证标识同排。标准认证宽72px，320px六按钮时宽44px，按钮热区至少44×44px。
- 昵称与余额保留明显间距：440px标准屏约4.34px，375/320紧凑屏约3.08px；这是浏览器最终缩放后的结果。横屏顶部投注移至身份牌右侧，避免投注金额与余额重叠。
- 本人头像、姓名和余额作为完整区域给快捷投注留位。加入游戏靠房间说明放置，窄屏放到说明下方；不盖本人手牌。侧座保持上一座投注与下一座动作提示间距。
- 边池从左往右排列，包括单个边池；完整金额可横向滚动查看。公共牌下方放说明，标准鱿鱼六行完整可见；短屏限制到完整行并能滚到末尾。低于434px仅桌面滚动，固定操作与底栏。

## 验证证据

| 检查 | 结果 | 文件 |
| --- | --- | --- |
| 内容容量 | 20组通过；四布局、长边池、双公共牌、鱿鱼六行及窄/长/横屏 | results.json |
| 间距与遮挡 | 15组通过；昵称/余额、余额/投注、本人/快捷、加入/本人、认证/导航、相邻座位投注/动作、安全区、热区 | footer-results.json |
| 导航及交互 | 17项通过；六按钮边界、语音切换、加注提交/取消、战绩和设置点击 | interactions/results.json |
| 类型、完整构建及生产预览 | 通过；双入口打包、声明类型、生产资源和导出可用 | logs/build.log、production.json |
| 布局契约 | 3项通过；座位ID/快照不变、双排规则、长屏空间 | logs/layout-tests.log |

本轮强化检查曾发现横屏顶部投注与余额重叠，修正style2布局后15组重跑通过。边池滚到最后一项、信息滚到末尾的测量值在results.json；所有本轮记录均可达。人工查看标准原布局、横屏和320px六按钮截图。

浏览器为桌面Chrome无头离线真实组件，模拟0/34px安全区，不是实体手机或真实音视频/服务器验收。专项检查只覆盖列明区域，不能称所有节点和动画均无重叠。本轮未重跑R1全量单元测试；既有基线失败见R1报告。完整构建/生产结果以logs/build.log、production.json为准。

## 改动范围

生产源码仅src/assets/style2/style.css和layout.ts；未新增修改style1、业务/数据/网络层或deps/h5-game。无需为了风格间距改业务接口。其他改动为验证脚本与文档，交互/生产验证增加MX_OUTPUT_DIR便于多轮、多风格分开保存。之前首个交互复跑曾覆盖R1/interactions，R1 README已注明；最终结果保存于本目录。

## 复现

先启动本地Vite（本机5183），设置MX_PLAYWRIGHT_MODULE为本机playwright-core安装位置，MX_CHROME可指定Chrome路径。

```sh
node tests/fixtures/verify-style2-capacity.cjs
node tests/fixtures/verify-style2-footer.cjs
MX_OUTPUT_DIR=docs/styles/style2/implementation/content-capacity/interactions node tests/fixtures/verify-style2-interactions.cjs
npm run build
# 预览产物（本机5184）后
MX_OUTPUT_DIR=docs/styles/style2/implementation/content-capacity node tests/fixtures/verify-style2-production.cjs
```

截图图册：[index.html](index.html)。user-*.png为用户局部问题截图，尺寸不作为布局依据；其余来自实际运行窗口，尺寸及场景见文件名和JSON。manifest.json保存文件哈希供style3复用。
