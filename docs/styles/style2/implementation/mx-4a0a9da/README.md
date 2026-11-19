# style2 · MX 同步后的验收

2026-11-19，DX 的 `codex/style2` 工作树已集成 `upstream/reorg-qa` 从 `a4303a13737e1c0a0e7c6afdc322d3226d7697e4` 到 `4a0a9da931e567013ec1f1de97631002f949c747` 的适用更新。6 个提交涉及 53 个路径。逐文件比对见 [integration.json](integration.json)。下轮同步使用目标 SHA 作为起点。

[查看标准屏牌桌](balanced-squid-join-440x782.png) · [语音桌](footer-original-media-voice-440x782-safe0.png) · [六按钮视频桌](footer-original-media-video-320x400-safe0.png) · [玩家资料](style2/profile-interaction-375.png) · [弃牌倒计时](style2/fold-countdown-original.png)

| 检查范围 | 证据 |
| --- | --- |
| 两风格 114 个场景的状态、入口和控件对照，6 组操作的结果对照 | [场景](parity.json)、[操作](behavior.json) |
| style2 内容容量 20 组、遮挡与热区 15 组、导航与交互 17 项 | [内容](results.json)、[遮挡](footer-results.json)、[交互](interactions/results.json) |
| 每个风格的 52 项上游布局与资料窗检查、12 项资料交互、40 项快捷提交/设置检查、12 项倒计时检查 | [style1](style1/)、[style2](style2/) |
| 类型、应用与宿主构建、声明文件、实际生产入口 | [构建](build.log)、[最终应用包](app-final.log)、[最终宿主包](host-final.log)、[两个产物的计时器样式](packed-timer-css.log)、[生产预览](production.json) |
| 全量单测与复跑 | [最终串行结果](unit.log)、[并行构建时的超时记录](unit-concurrent-timeout.log)、[独立复查](emoji-recheck.log) |
| 真实 H5 外壳加载 DX 客户端 | [H5 大厅截图](h5-entry.png)、[加载记录](h5-entry.log) |

并行构建期间有一次表情回执用例触发 1019 超时，独立复查通过，保留原日志。上游倒计时用例在 style1 校验原按钮绘制比，在 style2 校验计时环尺寸、按钮内边界和剩余秒数。两者使用同一套清除、重启和超时断言。

**运行状态。** 真实 H5 使用 DX 冻结源码的临时副本启动，已有依赖锁文件已核对。桌面 Chrome 打开大厅并加载 DX 宿主入口，控制台页面错误为零。实服入桌等待有权限的测试账号登录。ADB 和 Apple CoreDevice 探测均无实体设备。真机触控、真实音视频与最终美术签收分别待验。

实际运行画面可从[标准牌桌](http://127.0.0.1:5183/tests/fixtures/layout-audit.html?skin=style2&layout=balanced&scene=squid-join&seats=8&action=1&bb=1&width=440&height=782)进入。H5 联调服务为 [本地大厅](http://127.0.0.1:5175/#/home)。

**设计与共享层。** 上游三行房间信息保留完整玩法详情，最后一行超宽时滚动。style2 同步麦克风半区位置与旁观底座投注位置，修正快捷提交时旧按钮仍在、设置与鱿鱼控件挤占、宽弃牌按钮计时器错位。计时器沿用原倒计时组件，环内显示剩余秒数。共享布局接口的必要性、复用方式和验证记录见 [DESIGN.md](../../DESIGN.md)。734 个外壳文件已逐一核对冻结 SHA-256。

**复现新增专项。** 启动 DX 的 Vite 后，设置 `MX_AUDIT_URL`、`MX_AUDIT_SKIN` 和 `MX_OUTPUT_DIR`，分别以 style1、style2 运行下列脚本。若使用仓库外安装的 Playwright，请给 ES 模块脚本指定其 index.mjs 入口。

```sh
node tests/fixtures/verify-feedback-121.mjs
node tests/fixtures/verify-profile-interactions.mjs
node tests/fixtures/verify-quick-submit-settings.mjs
node tests/fixtures/verify-fold-countdown.mjs
```
