@REM ----------------------------------------------------------------------------
@REM Maven Wrapper script for Windows (AdaptiveWeb)
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF

setlocal

set "WRAPPER_DIR=%~dp0"
set "LOCAL_MAVEN=%WRAPPER_DIR%..\maven\apache-maven-3.9.6\bin\mvn.cmd"

if exist "%LOCAL_MAVEN%" (
    call "%LOCAL_MAVEN%" %*
    goto end
)

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    mvn %*
    goto end
)

echo [ERROR] Apache Maven was not found in PATH or at %LOCAL_MAVEN%.
echo [INFO] Please install Apache Maven or run using an IDE with Maven integration.
exit /b 1

:end
endlocal
