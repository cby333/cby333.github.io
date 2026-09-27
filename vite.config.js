import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /* 公网部署必需：Vite 5+ 默认会校验 Host 头，反代域名不在白名单里会直接
     返回 "Blocked request. This host is not allowed."，页面打不开。
     host: 0.0.0.0 让容器监听所有网卡；allowedHosts: true 放行反代域名。
     server 管 dev、preview 管 vite preview，两边都配上，免得换命令就挂。
     仅影响开发/预览服务器，不进生产产物、不改页面任何内容。 */
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
})
