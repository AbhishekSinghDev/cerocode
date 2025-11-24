import type { AuthService } from "@core/auth/auth.service";
import boxen from "boxen";
import chalk from "chalk";
import ora from "ora";
import readline from "readline";

function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      `${chalk.cyan("?")} ${chalk.bold(question)} ${chalk.dim("(Y/n)")} `,
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() !== "n");
      }
    );
  });
}

export async function loginPrompt(authService: AuthService): Promise<void> {
  console.log(chalk.cyan.bold("\n🔐 Authentication\n"));

  const isAuthenticated = await authService.isAuthenticated();
  if (isAuthenticated) {
    console.log(chalk.green("✓ Already authenticated"));
    console.log(chalk.dim("You're all set!\n"));
    return;
  }

  let deviceAuth;
  const spinner = ora(chalk.dim("Requesting device authorization...")).start();

  try {
    deviceAuth = await authService.requestDeviceCode();
    spinner.succeed(chalk.green("Authorization code received"));
  } catch (error) {
    spinner.fail(chalk.red("Authorization request failed"));
    console.error(
      chalk.red(`Failed to request authorization: ${(error as Error).message}`)
    );
    process.exit(1);
  }

  const url =
    deviceAuth.verification_uri_complete || deviceAuth.verification_uri;

  console.log(
    boxen(
      `${chalk.bold("Visit:")} ${chalk.cyan.underline(url)}\n` +
        `${chalk.bold("Code: ")} ${chalk.yellow.bold(
          deviceAuth.user_code
        )}\n\n` +
        chalk.dim(
          `Expires in ${Math.floor(deviceAuth.expires_in / 60)} minutes`
        ),
      {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
        title: "Authorization Required",
        titleAlignment: "center",
      }
    )
  );

  const shouldOpen = await askConfirmation(
    "Open authorization URL in your browser?"
  );

  const pollSpinner = ora(chalk.dim("Waiting for authorization...")).start();

  if (shouldOpen) {
    await authService.openAuthorizationUrl(url);
    pollSpinner.text = chalk.dim(
      "Browser opened, waiting for authorization..."
    );
  }

  try {
    await authService.pollForToken(deviceAuth.device_code);
    pollSpinner.succeed(chalk.green("Successfully authenticated!"));
    console.log(chalk.dim("\nYou're all set!\n"));
  } catch (error) {
    pollSpinner.fail(chalk.red("Authentication failed"));
    throw error;
  }
}

export async function logoutPrompt(authService: AuthService): Promise<void> {
  console.log(chalk.cyan.bold("\n👋 Logout\n"));

  const confirmed = await askConfirmation("Are you sure you want to logout?");

  if (!confirmed) {
    console.log(chalk.dim("Logout cancelled.\n"));
    return;
  }

  const spinner = ora(chalk.dim("Logging out...")).start();
  try {
    await authService.logout();
    spinner.succeed(chalk.green("Logged out successfully"));
    console.log(chalk.dim("See you next time!\n"));
  } catch (error) {
    spinner.fail(chalk.red("Logout failed"));
    console.error(chalk.red((error as Error).message));
    process.exit(1);
  }
}
