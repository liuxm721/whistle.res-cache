const { execSync } = require('child_process')
const pkg = require('../package.json')

// 解析当前版本（例如 0.0.1-dev-20250208 -> [0,0,1]）
const currentVersion = pkg.version.match(/(\d+)\.(\d+)\.(\d+)/)
const [major, minor, patch] = currentVersion.slice(1, 4).map(Number)

// 生成新版本号（保持主版本号不变，仅更新日期）
const today = new Date()
  .toISOString()
  .slice(0, 10)
  .replace(/-/g, '') // 输出 20231020 格式
const newVersion = `${major}.${minor}.${patch}-dev-${today}`

// 执行 standard-version 并传递新版本号
execSync(`npx standard-version --release-as ${newVersion}`, {
  stdio: 'inherit',
})