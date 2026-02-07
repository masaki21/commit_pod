@echo off
setlocal
cd /d %~dp0\supabase-mcp-server
call .venv\Scripts\activate
supabase-mcp-server
endlocal
