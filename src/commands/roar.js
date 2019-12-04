import { RandomDataCommand } from "../lib/command";

export class RoarCommand extends RandomDataCommand {
  command = "roar";
  aliases = ["druid", "bear"];
  help = "Displays a random meme about Druids.";
  example = "!roar";

  data = [
    "https://i.imgur.com/tvP21e7.jpg",
    "https://i.imgur.com/Yp14Scw.jpg",
    "https://i.imgur.com/F2Zhnpa.jpg",
    "https://i.imgur.com/tNCSu0h.png",
    "https://i.imgur.com/KBRHjaU.jpg",
    "https://i.imgur.com/LXkdBM2.jpg",
    "https://i.imgur.com/vnkhgpm.png",
    "https://i.imgur.com/j7b0oz1.png",
    "https://i.redd.it/sqff8dgya5501.jpg",
    "https://i.imgur.com/T9G0uUi.jpg",
    "https://i.imgur.com/8mYQP8B.jpg",
    "https://i.imgur.com/lJ5nEDA.jpg",
    "https://i.imgur.com/otIsJDP.gif",
    "https://i.imgur.com/AWx1r4Q.png",
    "https://i.imgur.com/xN7FUUF.jpg",
    "https://i.imgur.com/8bmaDKY.jpg",
    "https://i.imgur.com/Dns5hNA.jpg",
    "https://i.imgur.com/xbnUvMW.jpg",
    "https://i.imgur.com/kdPPN8O.jpg",
    "https://i.imgur.com/l6waM7p.jpg",
    "https://i.imgur.com/CWLJScD.jpg",
    "https://i.imgur.com/cyDdmGh.gif",
    "https://i.imgur.com/tNxnxFY.jpg",
    "https://i.imgur.com/JjDYGQ1.jpg",
    "https://i.redd.it/zu1b45llxdo01.jpg",
    "https://i.redd.it/5a3xm64ofio01.png",
    "https://i.redd.it/d6g2ce6a0jr01.jpg",
    "https://i.imgur.com/k0ujksb.png",
    "https://i.imgur.com/XkM1yF7.png"
  ];

  constructor() {
    super();
  }
}

export const roarCommand = new RoarCommand();
