import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// 独立 H5 提供运行时配置。旧内置外壳仍使用构建时的 HTTP 默认值。
export function runtimeHttpSetup(h5Root) {
  if (!existsSync(resolve(h5Root, 'src/utils/appConfig.ts'))) return '';
  return `const { configReady, resolveApiBaseUrl } = await import('/src/utils/appConfig.ts');
    await configReady;
    options.http = { baseUrl: resolveApiBaseUrl() };`;
}
