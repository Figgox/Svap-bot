export const token = process.env.DISCORD_TOKEN?.trim();
export const clientId = process.env.CLIENT_ID?.trim();
export const devGuildId = process.env.DEV_GUILD_ID?.trim() || null;

export function requireEnv(name, value) {
  if (!value) {
    console.error(`${name} is not set. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
  return value;
}
