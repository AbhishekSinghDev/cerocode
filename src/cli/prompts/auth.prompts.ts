import * as clack from "@clack/prompts";
import chalk from "chalk";
import { AuthService } from "../../core/auth/auth.service.js";

export async function loginPrompt(authService: AuthService): Promise<void> {
  clack.intro(chalk.cyan.bold("🔐 Authentication Procedure"));

  const isAuthenticated = await authService.isAuthenticated();
  if (isAuthenticated) {
    clack.log.success("You are already logged in!");
    clack.outro(chalk.green("You're all set!"));
    return;
  }

  let deviceAuth;
  const spinner = clack.spinner();

  try {
    spinner.start("Requesting device authorization");
    deviceAuth = await authService.requestDeviceCode();
    spinner.stop("Authorization request successful");
  } catch (error) {
    spinner.stop("Authorization request failed");
    clack.log.error(
      chalk.red(`Failed to request authorization: ${(error as Error).message}`)
    );
    clack.cancel("Operation cancelled due to error.");
    process.exit(1);
  }

  console.log();

  // Authorization details section
  clack.log.info(chalk.white.bold("Please authorize this device to continue"));
  console.log(
    chalk.gray("  Visit: ") +
      chalk.cyan.underline(
        deviceAuth.verification_uri_complete || deviceAuth.verification_uri
      )
  );
  console.log(
    chalk.gray("  Code:  ") + chalk.yellow.bold(deviceAuth.user_code)
  );
  console.log();

  // User interaction section
  const shouldOpen = await clack.confirm({
    message: "Open authorization URL in your browser?",
    initialValue: true,
  });

  if (clack.isCancel(shouldOpen)) {
    clack.cancel("Operation cancelled.");
    process.exit(0);
  }

  if (shouldOpen) {
    const urlToOpen =
      deviceAuth.verification_uri_complete || deviceAuth.verification_uri;
    await authService.openAuthorizationUrl(urlToOpen);
  }

  console.log();
  clack.log.step(
    chalk.gray(
      `Waiting for authorization (expires in ${Math.floor(
        deviceAuth.expires_in / 60
      )} minutes)`
    )
  );

  await authService.pollForToken(deviceAuth.device_code);
}

export async function logoutPrompt(authService: AuthService): Promise<void> {
  clack.intro(chalk.cyan.bold("Logout from Cero"));

  const confirmed = await clack.confirm({
    message: "Are you sure you want to logout?",
    initialValue: false,
  });

  if (clack.isCancel(confirmed)) {
    clack.cancel("Logout cancelled.");
    process.exit(0);
  }

  if (!confirmed) {
    clack.outro(chalk.yellow("Logout cancelled."));
    return;
  }

  try {
    await authService.logout();
    clack.outro(chalk.green("✓ Logged out successfully"));
  } catch (error) {
    clack.log.error(chalk.red((error as Error).message));
    process.exit(1);
  }
}
