# original设置入口修复

2026-11-19：style2 original左上野餐篮与设置标签合并到同一44px热区，修正横屏聊天抢占点击。仅style2 CSS/布局修改，无共享逻辑或H5改动。

运行tests/fixtures/verify-original-settings.cjs（MX_PLAYWRIGHT_MODULE、MX_CHROME、MX_AUDIT_URL按R1说明配置）。results.json保存标准屏/短屏/横屏的标签对齐、文字点击展开菜单、进入设置和style1对照结果；截图保留本轮实际显示。
