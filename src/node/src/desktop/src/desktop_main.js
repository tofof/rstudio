/*
 * desktop_main.js
 *
 * Copyright (C) 2020 by RStudio, PBC
 *
 * Unless you have received this program directly from RStudio pursuant
 * to the terms of a commercial license agreement with RStudio, then
 * this program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */

const { app, BrowserWindow } = require('electron');
const os = require('os');

function createWindow() {
  // Create the browser window
  new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
    },
  });
}

function resolveTilde(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return '';
  }
  if (filePath[0] === '~' && (filePath[1] === '/' || filePath.length === 1)) {
    return filePath.replace('~', os.homedir());
  }
  return filePath;
}

function main() {
  // TODO
  // core::system::initHook();

  if ('RSTUDIO_DEV' in process.env) {
    // find the build directory root
    let target = process.env.RSTUDIO_DEV;
    try {
      target = resolveTilde(target);
      process.chdir(target);
    } catch (err) {
      console.error(`chdir: ${err}`);
      app.exit(1);
      return;
    }
  }

  // look for a version check request; if we have one, just do that and exit
  if (process.argv.includes('--version', 1)) {
    // TODO
    console.log('RSTUDIO_VERSION');
    app.exit(0);
    return;
  }

  // TODO
  // initializeLang();
  // initializeRenderingEngine(&arguments);

  // TODO
  // // initialize log
  // core::system::initializeLog("rdesktop",
  // core::log::LogLevel::WARN,
  // desktop::userLogPath());

  // ignore SIGPIPE
  process.on('SIGPIPE', () => {});

  // TODO
  // // catch unhandled exceptions
  // error = core::crash_handler::initialize(core::crash_handler::ProgramMode::Desktop);
  // if (error)
  //   LOG_ERROR(error);

  // TODO
  // // attempt to remove stale lockfiles, as they can impede
  // // application startup
  // error = removeStaleOptionsLockfile();
  // if (error)
  //   LOG_ERROR(error);

  // TODO
  // // set application attributes
  // QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

  // TODO
  // // don't synthesize mouse events for unhandled tablet events,
  // // as this causes tablet clicks to be duplicated (effectively
  // // leading to single clicks registering as double clicks)
  // //
  // // https://bugreports.qt.io/browse/QTBUG-76347
  // QCoreApplication::setAttribute(Qt::AA_SynthesizeMouseForUnhandledTabletEvents, false);

  // TODO
  // // enable viewport meta (allows us to control / restrict
  // // certain touch gestures)
  // static char enableViewport[] = "--enable-viewport";
  // arguments.push_back(enableViewport);

  // TODO
  // // disable chromium renderer accessibility by default (it can cause
  // // slowdown when used in conjunction with some applications; see e.g.
  // // https://github.com/rstudio/rstudio/issues/1990)
  // bool accessibility = desktop::options().enableAccessibility();
  //
  // if (!accessibility)
  // {
  //   static char disableRendererAccessibility[] = "--disable-renderer-accessibility";
  //   arguments.push_back(disableRendererAccessibility);
  // }

  // TODO
  // #ifdef Q_OS_MAC
  // // don't prefer compositing to LCD text rendering. when enabled, this causes the compositor to
  // // be used too aggressively on Retina displays on macOS, with the side effect that the
  // // scrollbar doesn't auto-hide because a compositor layer is present.
  // // https://github.com/rstudio/rstudio/issues/1953
  // static char disableCompositorPref[] = "--disable-prefer-compositing-to-lcd-text";
  // arguments.push_back(disableCompositorPref);

  // TODO
  // // disable GPU features for certain machine configurations. see e.g.
  // //
  // // https://bugs.chromium.org/p/chromium/issues/detail?id=773705
  // // https://github.com/rstudio/rstudio/issues/2093
  // // https://github.com/rstudio/rstudio/issues/3148
  // //
  // // because the issue seems to only affect certain video cards on macOS
  // // High Sierra, we scope that change to that particular configuration
  // // for now (we can expand this list if more users report issues)
  // {
  //   core::system::ProcessResult processResult;
  //   core::system::runCommand(
  //     "/usr/sbin/system_profiler SPDisplaysDataType",
  //     core::system::ProcessOptions(),
  //   &processResult);
  //
  //   std::string stdOut = processResult.stdOut;
  //   if (!stdOut.empty())
  //   {
  //       // NOTE: temporarily backed out as it appears the rasterization
  //       // issues do not occur anymore with Qt 5.12.1; re-enable if we
  //       // receive more reports in the wild.
  //       //
  //       // https://github.com/rstudio/rstudio/issues/2176
  //
  //       /*
  //       std::vector<std::string> rasterBlacklist = {
  //          "NVIDIA GeForce GT 650M",
  //          "NVIDIA GeForce GT 750M",
  //          "Intel Iris Graphics 6100"
  //       };
  //
  //       for (const std::string& entry : rasterBlacklist)
  //       {
  //          if (stdOut.find(entry) != std::string::npos)
  //          {
  //             static char disableGpuRasterization[] = "--disable-gpu-rasterization";
  //             arguments.push_back(disableGpuRasterization);
  //             break;
  //          }
  //       }
  //       */
  //
  //       std::vector<std::string> gpuBlacklist = {};
  //
  //       for (const std::string& entry : gpuBlacklist)
  //       {
  //         if (stdOut.find(entry) != std::string::npos)
  //         {
  //           static char disableGpu[] = "--disable-gpu";
  //           arguments.push_back(disableGpu);
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   #endif

    #if defined(Q_OS_LINUX)

    static char noSandbox[] = "--no-sandbox";

    // is this root? if so, we need --no-sandbox on Linux.
    // see https://crbug.com/638180.
    if (core::system::effectiveUserIsRoot())
    {
      arguments.push_back(noSandbox);
    }

    #endif

    #ifdef Q_OS_WIN32
    # if QT_VERSION > QT_VERSION_CHECK(5, 12, 0)
    // allow AltGr key to be recognized separately on Windows
    arguments.push_back("-platform");
    arguments.push_back("windows:altgr");
    # endif
    #endif

    // allow users to supply extra command-line arguments
    augmentCommandLineArguments(&arguments);

    // re-assign command line arguments
    argc = (int) arguments.size();
    argv = &arguments[0];

    // prepare application for launch
    boost::scoped_ptr<QApplication> pApp;
    boost::scoped_ptr<ApplicationLaunch> pAppLaunch;
    ApplicationLaunch::init(QString::fromUtf8("RStudio"),
      argc,
      argv,
    &pApp,
  &pAppLaunch);

    // determine the filename that was passed to us
    QString filename;

    #ifdef __APPLE__
    // run an event loop for a short period of time just to ensure
    // that the OpenFile startup event (if any) gets pumped
    QEventLoop loop;
    QTimer::singleShot(100, &loop, &QEventLoop::quit);
    loop.exec();

    // grab the startup file request (if any)
    filename = verifyAndNormalizeFilename(pAppLaunch->startupOpenFileRequest());
    #endif
    // allow all platforms (including OSX) to check the command line.
    // we include OSX because the way Qt handles apple events is to
    // re-route them to the first instance to register for events. in
    // this case (for projects) we use this to initiate a launch
    // of the application with the project filename on the command line
    if (filename.isEmpty())
    {
      // get filename from command line arguments
      if (pApp->arguments().size() > 1)
      {
        QString arg = pApp->arguments().at(1);
        if (arg != QString::fromUtf8(kRunDiagnosticsOption))
          filename = verifyAndNormalizeFilename(arg);
      }
    }

    // if we have a filename and it is NOT a project file then see
    // if we can open it within an existing instance - we do not attempt
    // to do this if opening an rdprsp file since that should start a remote session
    bool forceLocalStart = false;
    FilePath openFile(filename.toUtf8().constData());
    std::string sessionUrl, serverUrl;
    if (isNonProjectFilename(filename))
    {
      if (openFile.getExtensionLowerCase() == ".rdprsp")
      {
        std::string contents;
        Error error = readStringFromFile(openFile, &contents);
        if (error)
        {
          LOG_ERROR(error);
        }
        else
        {
          json::Value val;
          error = val.parse(contents);
          if (error)
          {
            log::logError(error, ERROR_LOCATION);
          }
          else
          {
            if (!val.isObject())
            {
              LOG_ERROR_MESSAGE("Invalid .rdprsp file");
            }
            else
            {
              error = json::readObject(val.getObject(),
                "sessionUrl", sessionUrl,
                "serverUrl", serverUrl);
              if (error)
              {
                LOG_ERROR(error);
              }
            }
          }
        }
      }
      else
      {
        if (pAppLaunch->sendMessage(filename))
          return 0;
      }
    }
    else
    {
      forceLocalStart = !filename.isEmpty();

      // try to register ourselves as a peer for others
      pAppLaunch->attemptToRegisterPeer();
    }

    // init options from command line
    desktop::options().initFromCommandLine(pApp->arguments());
    ProgramStatus status = initializeOptions(pApp->arguments());
    if (status.exit())
      return status.exitCode();

    // reset log if we are in run-diagnostics mode
    if (desktop::options().runDiagnostics())
    {
      desktop::reattachConsoleIfNecessary();
      core::system::initializeStderrLog("rdesktop", core::log::LogLevel::WARN);
    }

    initializeSharedSecret();
    initializeWorkingDirectory(argc, argv, filename);
    initializeStartupEnvironment(&filename);

    // get install path
    FilePath installPath;
    error = core::system::installPath("..", argv[0], &installPath);
    if (error)
    {
      LOG_ERROR(error);
      return EXIT_FAILURE;
    }

    // calculate paths to config file, rsession, and desktop scripts
    FilePath confPath, sessionPath, scriptsPath;
    bool devMode = false;

    // check for debug configuration
    FilePath currentPath = FilePath::safeCurrentPath(installPath);
    if (currentPath.completePath("conf/rdesktop-dev.conf").exists())
    {
      confPath = currentPath.completePath("conf/rdesktop-dev.conf");
      sessionPath = currentPath.completePath("session/rsession");
      scriptsPath = currentPath.completePath("desktop");
      devMode = true;
    }

    // if there is no conf path then release mode
    if (confPath.isEmpty())
    {
      // default paths (then tweak)
      sessionPath = installPath.completePath("bin/rsession");
      scriptsPath = installPath.completePath("bin");

      // check for running in a bundle on OSX
      #ifdef __APPLE__
      if (installPath.completePath("Info.plist").exists())
      {
        sessionPath = installPath.completePath("MacOS/rsession");
        scriptsPath = installPath.completePath("MacOS");
      }
      #endif
    }

    // set the scripts path in options
    desktop::options().setScriptsPath(scriptsPath);

    Options& options = desktop::options();
    if (!prepareEnvironment(options))
      return 1;

    #ifdef _WIN32
    RVersion version = detectRVersion(false);
    if (devMode)
    {
      if (version.architecture() == ArchX86 &&
        installPath.completePath("session/x86").exists())
      {
        sessionPath = installPath.completePath("session/x86/rsession");
      }
    }
    else
    {
      // check for win32 binary on windows
      if (version.architecture() == ArchX86 &&
        installPath.completePath("bin/x86").exists())
      {
        sessionPath = installPath.completePath("bin/x86/rsession");
      }
    }
    #endif

    core::system::fixupExecutablePath(&sessionPath);

    auto* pProxyFactory = new NetworkProxyFactory();
    QNetworkProxyFactory::setApplicationProxyFactory(pProxyFactory);

    // determine where the session should be launched
    boost::optional<SessionServer> launchServer;
    bool forceSessionServerLaunch = false;
    std::string sessionServer = getSessionServer();
    if (!sessionServer.empty())
    {
      forceSessionServerLaunch = true;

      // launched with a specific session server selected
      // such as opening a new session in another window
      launchServer = getLaunchServerFromUrl(sessionServer);
      if (!launchServer)
      {
        // if we don't have an entry for the server URL, something is horribly wrong
        // just show an error and exit
        showError(nullptr,
          QString::fromUtf8("Invalid session server"),
          QString::fromStdString("Session server " + sessionServer + " does not exist"),
          QString());
        return EXIT_FAILURE;
      }
    }

    if (!serverUrl.empty())
    {
      forceSessionServerLaunch = true;

      launchServer = getLaunchServerFromUrl(serverUrl);
      if (!launchServer)
      {
        // it's possible we were told to open an rdprsp file but we don't have the
        // server defined locally - that's okay - just create one for now
        launchServer = SessionServer(std::string(), serverUrl);
      }
    }

    if (forceLocalStart)
      forceSessionServerLaunch = true;

    bool forceShowSessionLocationDialog = (qApp->queryKeyboardModifiers() & Qt::AltModifier);
    bool forceReuseSession = false;

    while (true)
    {
      SessionLocation location = forceShowSessionLocationDialog ?
      SessionLocation::Ask :
      sessionServerSettings().sessionLocation();

      if (!forceSessionServerLaunch)
      {
        switch (location)
        {
          case SessionLocation::Server:
            if (sessionServerSettings().servers().size() != 0)
            {
              // remote launch on default server
              auto iter = std::find_if(sessionServerSettings().servers().begin(),
              sessionServerSettings().servers().end(),
              [](const SessionServer& server) { return server.isDefault(); });

              if (iter == sessionServerSettings().servers().end())
              {
                // somehow, no default was specified
                // log an error and launch session on the first server in the list
                launchServer = sessionServerSettings().servers().at(0);
                LOG_ERROR_MESSAGE("No default session server specified. Using first server");
              }
              else
                launchServer = *iter;
            }
            break;

          case SessionLocation::Ask:
            if (sessionServerSettings().servers().size() != 0)
            {
              // display session location chooser dialog
              LaunchLocationResult result = sessionServers().showSessionLaunchLocationDialog();
              if (result.dialogResult == QDialog::Rejected)
                return EXIT_SUCCESS;

              launchServer = result.sessionServer;
            }
            break;

          case SessionLocation::Locally:
          default:
            break;
        }
      }

      // keep the launcher object alive for the program's duration
      boost::shared_ptr<void> pSessionLauncher;
      bool remoteLaunch = false;
      if (!launchServer)
      {
        // launch a local session
        SessionLauncher* pLauncher = new SessionLauncher(sessionPath, confPath, filename, pAppLaunch.get());
        pLauncher->launchFirstSession(installPath, devMode, pApp->arguments());
        pSessionLauncher.reset(pLauncher);
      }
      else
      {
        remoteLaunch = true;

        // launch a remote session
        // first, check to make sure the server is reachable/valid
        Error error = launchServer->test();
        if (error)
        {
          LOG_ERROR(error);

          bool continueConnecting =
          showYesNoDialog(QMessageBox::Warning,
            nullptr,
            QString::fromUtf8("Server Error"),
            QString::fromUtf8("There was an error while attempting to run "
          "prelaunch diagnostics for this server. "
          "Do you want to attempt to connect anyway?"),
          QString::fromStdString(error.getProperty("description")),
            false);

          if (!continueConnecting)
          {
            if (forceSessionServerLaunch)
              return EXIT_FAILURE;

            forceShowSessionLocationDialog = true;
            continue;
          }
        }

        RemoteDesktopSessionLauncher* pLauncher;

        if (sessionUrl.empty())
          sessionUrl = getSessionUrl();

        if (sessionUrl.empty())
        {
          pLauncher = new RemoteDesktopSessionLauncher(launchServer.get(),
            pAppLaunch.get(),
            forceSessionServerLaunch && !forceReuseSession);
        }
        else
        {
          pLauncher = new RemoteDesktopSessionLauncher(launchServer.get(),
            pAppLaunch.get(),
            sessionUrl);
        }

        pLauncher->launchFirstSession(installPath, devMode, pApp->arguments());
        pSessionLauncher.reset(pLauncher);
      }

      ProgressActivator progressActivator;

      int result = pApp->exec();

      desktop::activation().releaseLicense();
      options.cleanUpScratchTempDir();

      boost::optional<SessionServer> pendingReconnect = sessionServers().getPendingSessionServerReconnect();
      if (pendingReconnect.has_value())
      {
        // we need to reconnect to the specified session server
        forceSessionServerLaunch = true;
        const SessionServer& server = pendingReconnect.get();
        if (server.label().empty())
        {
          // reconnect to a local session
          launchServer = boost::none;
        }
        else
        {
          // reconnect to the specified session
          launchServer = getLaunchServerFromUrl(server.url());
          sessionUrl.clear();
          forceReuseSession = true;
        }

        // clear activation's cached main window to allow relaunching of sessions
        desktop::activation().setMainWindow(nullptr);
        continue;
      }

      // check to see if we had a remote launch error - if so, show the launch location dialog
      if (remoteLaunch &&
        boost::static_pointer_cast<RemoteDesktopSessionLauncher>(pSessionLauncher)->failedToLaunch())
      {
        forceSessionServerLaunch = false;
        forceShowSessionLocationDialog = true;
        desktop::activation().setMainWindow(nullptr);
        continue;
      }

      return result;
    }
  }
  CATCH_UNEXPECTED_EXCEPTION
}

  createWindow();
}

app.whenReady().then(main);
