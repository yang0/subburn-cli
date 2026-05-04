# subburn-cli · 字幕烧录工具

将 SRT/ASS 字幕以 **黄色字体 + 1px 黑色描边** 烧录到视频上。字体使用 Google Fonts 的 Noto Sans CJK SC（思源黑体），打包在项目内，开箱即用。

## 效果示意

```
┌──────────────────────────────────────┐
│                                      │
│                                      │
│                                      │
│                                      │
│        如果你在用 ChatGPT            │  ← 黄色字体 + 黑色描边
│______________________________________│
```

## 安装

**前置条件：** Node.js >= 14、FFmpeg（需在系统 PATH 中）

```bash
npm install -g subburn-cli
```

或本地开发：

```bash
cd subburn-cli && npm link
```

## 使用

```bash
subburn <视频文件> <字幕文件> [输出文件]
```

**示例：**

```bash
# 自动命名输出文件（在原视频目录生成 *_subtitled.mp4）
subburn myvideo.mp4 subtitle.srt

# 指定输出文件
subburn input.mp4 subtitle.srt output.mp4

# 支持 ASS/SSA
subburn video.mp4 subtitle.ass
```

## 字幕样式

| 属性 | 值 |
|------|------|
| 字体 | Noto Sans CJK SC（思源黑体，打包在项目内） |
| 字号 | 24px，加粗（Bold） |
| 颜色 | 黄色 `#FFFF00` |
| 描边 | 黑色，1px |
| 位置 | 底部居中 |
| 字数限制 | 20 字（超长自动截断） |

## 命令行选项

```bash
subburn -h, --help     显示帮助
subburn -v, --version  显示版本号
```

## 工作原理

使用 FFmpeg 的 `subtitles` 滤镜直接处理字幕文件，通过 `force_style` 参数控制样式，`fontsdir` 加载自定义字体。无需中间格式转换，无需 drawtext 链式渲染。

## 技术栈

- **运行时：** Node.js
- **渲染：** FFmpeg + libass
- **字体：** Noto Sans CJK SC（Google Fonts）

## 许可证

MIT
