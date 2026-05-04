const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 字体配置
const FONT_DIR = path.join(__dirname, '..', 'fonts');
const FONT_FILE = 'NotoSansCJKsc-Regular.otf';
const FONT_PATH = path.join(FONT_DIR, FONT_FILE);
const FONT_NAME = 'Noto Sans CJK SC';

// force_style: ASS样式键值对（逗号分隔），&HAABBGGRR 格式
// &H0000FFFF = 黄色, &H00000000 = 黑色
const FORCE_STYLE =
  `Fontname=${FONT_NAME},Fontsize=24,` +
  `PrimaryColour=&H0000FFFF,OutlineColour=&H00000000,` +
  `BorderStyle=1,Outline=1,Bold=1,Alignment=2,MarginV=30`;

function checkFFmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 把字体复制到目标目录的子目录（隔绝其他文件），返回相对于 cwd 的正斜杠路径
 */
function ensureFont(targetDir) {
  const fontDir = path.join(targetDir, '.subburn-fonts');
  if (!fs.existsSync(fontDir)) {
    fs.mkdirSync(fontDir, { recursive: true });
  }
  const dest = path.join(fontDir, FONT_FILE);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(FONT_PATH, dest);
  }
  return path.relative(process.cwd(), fontDir).replace(/\\/g, '/');
}

/**
 * 烧录字幕到视频
 * 使用 ffmpeg 的 subtitles 滤镜直接处理 SRT/ASS
 * 配合 fontsdir + force_style 控制字体/颜色/位置/时间
 */
async function burnSubtitle(videoPath, subtitlePath, outputPath) {
  if (!checkFFmpeg()) {
    throw new Error('未检测到ffmpeg，请先安装ffmpeg并添加到系统PATH');
  }
  if (!fs.existsSync(videoPath)) {
    throw new Error(`视频文件不存在: ${videoPath}`);
  }
  if (!fs.existsSync(subtitlePath)) {
    throw new Error(`字幕文件不存在: ${subtitlePath}`);
  }
  if (!fs.existsSync(FONT_PATH)) {
    throw new Error(`字体文件不存在: ${FONT_PATH}`);
  }

  const ext = path.extname(subtitlePath).toLowerCase();
  if (!['.srt', '.ass', '.ssa'].includes(ext)) {
    throw new Error('不支持的字幕格式，仅支持 .srt 和 .ass/.ssa');
  }

  // 自动推断输出文件名
  if (!outputPath) {
    const videoExt = path.extname(videoPath);
    const base = path.basename(videoPath, videoExt);
    outputPath = path.join(path.dirname(videoPath), `${base}_subtitled${videoExt}`);
  }

  // 字体复制到字幕文件所在目录，供 libass 加载
  const fontsDir = ensureFont(path.dirname(path.resolve(subtitlePath)));

  // 路径全部转正斜杠，避免 Windows 冒号解析问题
  const subPath = subtitlePath.replace(/\\/g, '/');

  // subtitles 滤镜：原生处理 SRT/ASS，无需中间转换
  const ffmpegCmd =
    `ffmpeg -i "${videoPath}"` +
    ` -vf "subtitles='${subPath}':fontsdir='${fontsDir}':force_style='${FORCE_STYLE}'"` +
    ` -c:a copy "${outputPath}" -y`;

  console.log(`正在处理: ${path.basename(videoPath)}`);
  console.log(`字幕文件: ${path.basename(subtitlePath)}`);
  console.log(`输出文件: ${outputPath}`);

  execSync(ffmpegCmd, { stdio: 'inherit' });
}

module.exports = { burnSubtitle };
