#!/usr/bin/env node
const { burnSubtitle } = require('../src/index');

// 简单的命令行参数解析
const args = process.argv.slice(2);

function showHelp() {
  console.log(`
用法: subburn <视频文件> <字幕文件> [输出文件]

选项:
  -h, --help     显示帮助信息
  -v, --version  显示版本号

示例:
  subburn input.mp4 subtitle.srt output.mp4
  subburn input.mp4 subtitle.ass
`);
}

function showVersion() {
  const pkg = require('../package.json');
  console.log(pkg.version);
}

if (args.length === 0) {
  showHelp();
  process.exit(1);
}

if (args.includes('-h') || args.includes('--help')) {
  showHelp();
  process.exit(0);
}

if (args.includes('-v') || args.includes('--version')) {
  showVersion();
  process.exit(0);
}

const [videoFile, subtitleFile, outputFile] = args;

if (!videoFile || !subtitleFile) {
  console.error('错误: 请提供视频文件和字幕文件');
  showHelp();
  process.exit(1);
}

burnSubtitle(videoFile, subtitleFile, outputFile)
  .then(() => {
    console.log('字幕烧录完成！');
  })
  .catch(err => {
    console.error('错误:', err.message);
    process.exit(1);
  });
