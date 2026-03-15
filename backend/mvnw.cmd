@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup script for Windows, version 3.3.0
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to enable pausing after the execution
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM ----------------------------------------------------------------------------

@echo off
@setlocal

set "WRAPPER_JAR=.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROPERTIES=.mvn\wrapper\maven-wrapper.properties"
set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

set "DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.0/maven-wrapper-3.3.0.jar"

if not "%JAVA_HOME%" == "" goto checkJava

set "JAVA_EXE=java.exe"
%JAVA_EXE% -version >nul 2>&1
if "%ERRORLEVEL%" == "0" goto init

echo ERROR: JAVA_HOME not found and java.exe is not in PATH.
goto error

:checkJava
set "JAVA_HOME=%JAVA_HOME:"=%"
set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"

if exist "%JAVA_EXE%" goto init
echo ERROR: JAVA_HOME is set to an invalid directory.
goto error

:init
if exist "%WRAPPER_JAR%" goto run

echo Downloading Maven Wrapper...
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $webClient = New-Object System.Net.WebClient; $webClient.DownloadFile('%DOWNLOAD_URL%', '%WRAPPER_JAR%')}"
if not exist "%WRAPPER_JAR%" (
    echo ERROR: Failed to download maven-wrapper.jar
    goto error
)

:run
set "MAVEN_PROJECTBASEDIR=%~dp0"
@REM Remove trailing backslash to prevent Java from interpreting it as an escape character
set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"

"%JAVA_EXE%" %MAVEN_OPTS% -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" -classpath "%WRAPPER_JAR%" %WRAPPER_LAUNCHER% %*

if "%ERRORLEVEL%" neq 0 goto error
goto end

:error
exit /b 1

:end
@endlocal
exit /b 0
