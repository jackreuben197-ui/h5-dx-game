# style2：兔兔饼干野餐桌

index.ts组合已有客户端与组件；layout.ts只管几何；style.css全部规则限定data-skin=style2。art是内置imagegen生成的独立背景和透明4×4插画图集，完整提示词在art/prompts.json。

导航3/4/6分支、权限和media状态沿用原组件；不能硬编码语音已开启。原认证图片保留独立位置。现阶段复用style1视图与原牌面/效果资源以保证功能，不宣称所有DOM契约已独立；详见DESIGN.md耦合记录。禁止将设计整图当动态功能UI。


新用户默认布局由getBrand().defaultLayout指定为balanced；设置层仅在缺少已保存布局时使用该默认值。style1调用默认仍original，不强制迁移任何已有选择。极短竖屏(<434px)只滚动桌面区域，保留固定操作和导航；尺寸与交互证据见docs/styles/style2/implementation/round1。


最新容量修订：竖屏底栏64px加安全区，按钮和认证同排；昵称/余额显式分隔，边池从左到右，小屏长说明可滚动。证据见docs/styles/style2/implementation/content-capacity/README.md；此记录覆盖早期底部认证单独一行方案。
