# style1 基线检查

日期：2026-11-18。来源 reorg-qa，完整提交 a4303a13737e1c0a0e7c6afdc322d3226d7697e4。DX 独立分支 codex/style2；未修改 src、tests、scripts 或 deps/h5-game。

| 检查 | 实际结果 |
| --- | --- |
| npm run check | 通过 |
| npm test | 282 项，281 通过，1 失败 |
| npm run build | 通过，包括两个 Vite 构建和声明类型；有大 chunk 提示 |
| 本地预览 | Vite 127.0.0.1:5182 启动，参考页面 HTTP 200；浏览器渲染未由工具验证 |
| 组件配置 | 63 个 config.json |
| 离线场景 | 109 项，从 AuditScenarios 导出 |
| H5 文件 | 734 文件记录 SHA256；git diff 为空 |
| 浏览器截图 | 用户原图1张；授权 Playwright 后补拍15张，页面错误0。不是实服/实体手机验收 |

## 基线失败 BASE-001

测试 tests/cc-seat-placement.test.mjs 的 “9-player rotation preserves CC own and side bet coordinates independently of seat ID”。original 布局 398×724、9 座、本人座位4，bet(4) 预期 [175,-360,-25]，实际 [175,-377.5,-25]。

测试和 UI 文件均未修改，属于本次冻结版本的基线失败。可能涉及旧坐标断言与最新布局调整的差异，尚未判定应改测试还是代码；不为全绿而直接改期望或布局。设计时按实际运行效果记录，后续在用户允许实现后单独分析。

原始测试与构建日志保存在本目录 logs/。本报告不表示实服、真机或视觉验收完成。
