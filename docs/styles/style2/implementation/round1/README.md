# style2 实现与验收 R1 · 2026-11-19

已实现独立DX项目的style2可爱牌桌。入口在src/assets/style2；参考style1组件交互，沿用业务、数据和协议。该阶段是可运行实现与离线验收，不是对全部概念稿逐像素或实服/真机的验收结论。

## 直接查看

- [全部实际截图](index.html)
- [语音桌：五快捷+行动+四按钮](edge/main-voice.png)
- [视频桌：五快捷+行动+六按钮](edge/main-video.png)
- [极短屏34px安全区：滚动前](edge/short-safe34.png)、[滚动后](edge/short-safe34-scrolled.png)
- [标准屏保险选中状态](screens/insurance-selection-style2.png)
- [源设计和约束](../../DESIGN.md)、[style3可复用流程](../../../../ui-style-workflow.md)

启动`npm run dev -- --port 5183 --strictPort`后访问：

```
http://127.0.0.1:5183/tests/fixtures/layout-audit.html?skin=style2&scene=media-voice&seats=8&action=1&bb=1&width=440&height=782
```

scene=media-video显示六按钮；skin=style1显示原风格。工作台为离线模拟，不连接真实游戏服务器，不访问真实摄像头/麦克风。短于434px的竖屏仅桌面滚动，行动区与导航固定；极短屏不能同屏看完整桌，需滚动查看全部座位和本人手牌。

## 验收证据

| 检查 | 结果及边界 |
| --- | --- |
| 类型检查、应用/宿主/声明构建 | 最终日志及生产预览结果见logs/build.log、production.json；保留既有大chunk提示 |
| 回归单测 | 286项，285通过；1项为冻结基线既有9人座位Y坐标断言失败（期望-360，实际-377.5）。新增3项布局测试、1项默认布局持久化测试及多style边界检查通过，没有改失败断言 |
| 109场景×2风格 | 席位、公共牌槽、导航、行动、快捷、可见弹窗一致，页面脚本异常0；仅结构对照，见parity.json |
| 6组真实UI操作×2风格 | 弃牌、跟注、加注、快捷加注、语音、离桌/重进/切桌，金额、操作日志及最终状态一致，见behavior.json |
| 17项style2检查 | 四布局×三尺寸的6按钮边界/44px热区共12项，加语音、加注提交/取消、战绩和设置，共17项通过，见interactions/results.json |
| 10组复合边界 | 语音/视频同时行动、0/34px安全区、320×400、6手牌、横屏加注、英文长文案、短屏双牌、长屏；所测操作入口在边界内，无页面错误。短屏滚动后导航位置不变，见edge/results.json |
| style1通用视口修正 | 四布局×三尺寸共12组，修改前后行动底边计算相同，见style1-geometry.json |
| 保险选中状态 | 两风格点击另一个可选档位后，唯一aria-pressed与投入/赔付文案一致，见insurance-selection.json |
| deps/h5-game | 冻结基线734文件SHA256全部一致；见boundary.json |

## 复现浏览器验收

Node可访问playwright-core及本机Chrome时，仓库根执行。不自动安装新依赖：

```sh
export MX_PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core
export MX_CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
export MX_AUDIT_URL=http://127.0.0.1:5183
node tests/fixtures/verify-style-parity.cjs
node tests/fixtures/verify-style-behavior.cjs
node tests/fixtures/verify-style2-interactions.cjs
node tests/fixtures/verify-style2-edges.cjs
node tests/fixtures/verify-style1-viewport.cjs
node tests/fixtures/verify-style-insurance.cjs
node tests/fixtures/capture-style2.cjs
```

脚本写入本轮对应JSON和截图；正式进行style3应复制脚本并改输出目录及目标skin，不能覆盖style2历史。页面脚本或功能断言失败的脚本返回非零。类型/完整测试/构建仍执行npm run check、npm test、npm run build。

## 改动边界与未完成验收

运行时非UI变更只涉及按实例选择皮肤的公共装配接口和品牌入口，逐项必要性、替代方案、多style复用和耦合诊断见DESIGN.md。另有style1 UI基座的视口高度修正与保险按钮aria-pressed。UiBrand.defaultLayout与设置层可选默认参数解除初代布局硬编码；新用户默认balanced，已保存选择不覆盖。业务/网络/核心代码与H5未改；设置层仅将原固定默认布局改为可选参数注入，旧调用及已保存选择不变。

保留原照片头像、牌面/牌背、已有桌布设置和玩法特效。背景/图集为独立生成素材，动作按钮为可伸缩CSS；完整提示词及哈希在src/assets/style2/art。本轮没有把概念整图铺成假UI，也没有宣称每个弹窗均有独立审定插画。

未完成真实H5联调、实服金额/权限/音视频和实体设备操作。部分历史玩法插画、设置缩略图及动画保持原资源；概念图中的细部糖霜装饰尚有视觉差异。下一轮应按DESIGN.md逐项审美复核，不能把离线覆盖等同最终产品验收。未经授权未提交、推送或发布。


复核过程说明：完整回归曾出现原有lifecycle.test.mjs的80ms实时时钟断言波动。未修改该用例或业务逻辑，单独复跑通过；失败运行、单独复跑和最终完整结果分别保留在logs/unit-timing-attempt.log、logs/lifecycle-recheck.log及logs/unit-tests.log，不能删掉历史失败证据。生产冒烟另验证默认balanced、行动行在底部、背景/图集加载和宿主包style1/style2导出，未使用真实服务端。


2026-11-19后续容量修订记录：本目录interactions曾被首次后续复跑更新（单排底栏版本），不再视作冻结的R1交互截图；最初style1参考基点未覆盖。最终后续交互、布局和截图单独保存在../content-capacity，后续运行通过MX_OUTPUT_DIR指定输出目录。
