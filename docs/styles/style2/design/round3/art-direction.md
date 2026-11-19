# R3 卡通美术参考

使用内置 imagegen 生成（ui-mockup）；用于向Stitch明确兔兔饼干野餐桌的插画方向，不是生产UI，不是功能验收通过。

原图art-direction.png完整保留；标准布局基准440×782，栅格图实际尺寸应从文件读取。参考画面显示8名真人头像、独立昵称/余额/下注、五公共牌、两张手牌、五快捷、三动作、独立聊天/加时及三导航。所有人物照片仅示例，实际运行保留动态头像。

需要纠正：图中“认证中”不属于现有状态，不采用；顶栏筹码数、玩家昵称/下注为生成示例，需恢复原数据语义；聊天/菜单/客服需要明确文本或可访问标签；房间信息完整性还需校对。不以概念图替代双风格功能验收。

美术提示核心：portrait full-bleed premium adorable hand-painted rabbit biscuit picnic poker table, peach gingham background, scalloped biscuit-and-cream frosting surround, muted mint padded playing surface; cocoa outlines, buttery highlights, original illustrated cookie arrow/picnic basket/bunny headset/marshmallow chat/star trophy/bunny card book/mochi face; exactly8 photo avatar slots distributed top1+left3+right3+self1; separate nickname, chips and bet slots; five readable community cards; self and controls not occluded; no blank footer, no generic emoji or Material icons. Full layout and labels align with stitch-request.txt; no new game systems.

用户补充：此图只含三按钮，未满足语音四按钮/视频六按钮容量审核，不作为底栏定稿；见DESIGN.md UI-040–042。


## 2026-11-18 原美术图语音遗漏的实际修订

用户指出自己查看的是art-direction.png，而非另一份Stitch稿；原图确实没有语音。此前将Stitch底栏位置指给用户属于稿件对应错误，不能以文档已改或其他稿已改代表当前图已修复。

已通过内置image_gen直接编辑原美术图并保存两份新版本，原图保留：
- art-direction-voice-v2.png：底栏战绩/牌谱/表情/语音，最右侧为兔耳麦克风+“语音”标签，绿灯示意开启。
- art-direction-video-v2.png：底栏战绩/牌谱/表情/窗花/语音/视频，语音为第五项、视频第六项。

人工看图确认对应图中出现4/6图标、明确标签及独立排列，未看到底栏互相遮挡。两张仍为栅格美术设计，不能声明DOM热区、真实安全区或完整功能验证通过。移除了生成图虚构的“认证中”，底边仅预留认证区；原项目认证素材仍需在后续设计落地补回，不能记作功能完成。原图其他数据、完整房间信息及音视频状态规范仍按DESIGN.md审核。新图片尚未同步回Stitch，不得称为Stitch已修订的产物。

完整原始提示词在art-direction-voice-v2.prompt.txt、art-direction-video-v2.prompt.txt，来源与哈希见art-direction-media-v2.manifest.json。未更改生产UI、非UI层或deps/h5-game。先交用户看原美术方向的实改结果，真实style2开发继续暂停。
