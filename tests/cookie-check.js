#!/usr/bin/env node
/**
 * cookie-check.js — Cookie 到期检测
 *
 * 检查本地 Cookie 文件的有效期，提前提醒重新登录。
 * 独立运行：
 *   node tests/cookie-check.js          # 检查 Cookie 状态
 *   node tests/cookie-check.js --fix    # 清理过期的 Cookie 文件
 *
 * P1-1 (Hermes 评审): 填充桩文件
 */

import { preflightCookieCheck, checkCookieExpiry, decryptCookies, COOKIE_PATH } from '../scripts/zhihu-core.js';
import { existsSync, unlinkSync } from 'fs';

function formatDate(ts) {
  if (!ts) return '未知';
  const d = new Date(ts * 1000);
  return d.toLocaleDateString('zh-CN') + ' ' + d.toLocaleTimeString('zh-CN');
}

function main() {
  const args = process.argv.slice(2);
  const fixMode = args.includes('--fix');

  console.log('🍪 Cookie 检测');
  console.log('');

  // 1. 检查文件是否存在
  if (!existsSync(COOKIE_PATH)) {
    console.log('❌ Cookie 文件不存在');
    console.log(`   路径: ${COOKIE_PATH}`);
    console.log('');
    console.log('   请先运行以下命令登录知乎并导出 Cookie:');
    console.log('   node scripts/zhihu-export-cookie.js');
    process.exit(1);
  }

  // 2. 尝试解密
  const cookies = decryptCookies();
  if (!cookies || cookies.length === 0) {
    console.log('❌ Cookie 解密失败');
    console.log('   请确认 ZHIHU_COOKIE_KEY 与导出时一致');
    console.log('   或清除 Cookie 文件后重新登录');
    console.log(`   文件路径: ${COOKIE_PATH}`);

    if (fixMode) {
      console.log('');
      console.log('🗑️  清理中...');
      unlinkSync(COOKIE_PATH);
      console.log('✅ Cookie 文件已删除，请重新导出');
    }
    process.exit(1);
  }

  // 3. 检查有效期
  const { valid, expiresInDays, reason } = checkCookieExpiry();
  const zc0 = cookies.find(c => c.name === 'z_c0');

  console.log(`📄 Cookie 文件: ${COOKIE_PATH}`);
  console.log(`📊 Cookie 数量: ${cookies.length} 条`);
  console.log(`🔑 加密算法: AES-256-GCM`);

  if (zc0) {
    console.log(`👤 登录状态: 有效`);
    console.log(`⏰ 过期时间: ${zc0.expires ? formatDate(zc0.expires) : '会话 Cookie'}`);
  }

  console.log('');

  if (!valid) {
    if (reason === 'expired') {
      console.log('❌ Cookie 已过期，请重新运行 node scripts/zhihu-export-cookie.js');
      process.exit(1);
    }
    if (reason === 'no_cookie_file' || reason === 'z_c0_missing') {
      console.log('❌ 无效的 Cookie 文件，请重新导出');
      process.exit(1);
    }
  }

  if (reason === 'expiring_soon') {
    console.log(`⚠️  Cookie 将在 ${expiresInDays} 天后过期`);
    console.log('   建议提前重新导出 Cookie');
    console.log('   node scripts/zhihu-export-cookie.js');
  } else {
    console.log(`✅ Cookie 有效，剩余 ${expiresInDays} 天`);
  }

  console.log('');
  console.log('🔍 预检结果:');
  const preflightOk = preflightCookieCheck();
  console.log(preflightOk ? '✅ 预检通过' : '⚠️ 预检发现问题');

  process.exit(0);
}

main();
