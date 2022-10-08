export const hug = {
  links: [
    "https://cdn.discordapp.com/attachments/1028199671396569098/1028200536794742794/trinity_hug1.gif",
    "https://cdn.discordapp.com/attachments/1028199671396569098/1028200537163833444/trinity_hug2.gif",
    "https://cdn.discordapp.com/attachments/1028199671396569098/1028200537516163102/trinity_hug3.gif",
    "https://cdn.discordapp.com/attachments/1028199671396569098/1028200537881067541/trinity_hug4.gif",
    "https://cdn.discordapp.com/attachments/1028199671396569098/1028200538292097034/trinity_hug5.gif",
    "https://cdn.discordapp.com/attachments/1028199671396569098/1028200539512643627/trinity_hug8.gif",
    "https://cdn.discordapp.com/attachments/1028199671396569098/1028201199490576414/trinity_hug9.gif",
    "https://cdn.discordapp.com/attachments/1028199671396569098/1028200539957239818/trinity_hug10.gif",
  ],
  get random(): string {
    return this.links[Math.floor(Math.random() * this.links.length)];
  },
};
