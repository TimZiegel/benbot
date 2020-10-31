import { RandomDataCommand } from '../lib/command';

export class ShaqCommand extends RandomDataCommand {
	command = 'shaq';
	help = `The !shaq command displays a random image of Shaq. For some reason.`;
	example = '!shaq';
	
	data = [
		"https://i.imgur.com/DnT50xh.gifv",
		"https://i.imgur.com/LI7Yfea.gifv",
		"https://i.imgur.com/BBNR7Co.gif",
		"https://i.imgur.com/FQ4tzRM.gifv",
		"https://i.imgur.com/EDK4cq4.gif",
		"https://i.imgur.com/HSYSPTT.gif",
		"https://i.imgur.com/HOyZg2P.gif",
		"https://i.imgur.com/HAbzdyU.gif",
		"https://i.imgur.com/64yEMWd.gif",
		"https://i.imgur.com/0rGu7zo.gif",
		"https://i.imgur.com/Er7m1Nk.gifv",
		"https://i.imgur.com/LaqD4is.gif",
		"https://i.imgur.com/IHSQAs4.gif",
		"https://i.imgur.com/XiB9e3n.gifv",
		"https://i.imgur.com/YHMGluX.gif",
		"https://i.imgur.com/RgrSZZ7.gifv",
		"https://i.imgur.com/g835l8x.gif",
		"https://i.imgur.com/2KAvtOP.gifv",
		"https://i.imgur.com/EioD0rA.gif",
		"https://i.imgur.com/y13e2HY.gif",
		"https://i.imgur.com/nkMrq7L.gif",
		"https://i.imgur.com/bV2XtoT.gifv",
		"https://i.imgur.com/5yOgNrw.gif",
		"https://i.imgur.com/8Q90m40.gif",
		"https://i.imgur.com/SVHehWc.gif",
		"https://i.imgur.com/60oSngP.gif",
		"https://i.imgur.com/rFkXUZo.gif",
		"https://i.imgur.com/gOXRRHd.gifv",
		"https://i.imgur.com/pR7ljS8.gifv",
		"https://i.imgur.com/w1CYEh4.gif",
		"https://i.imgur.com/7xqGhzr.gif",
		"https://i.imgur.com/N4MCXQ5.gif",
		"https://i.imgur.com/Et1FScm.gif",
		"https://i.imgur.com/XFwJ6Sj.gif",
		"https://i.imgur.com/n2XG6st.gifv",
		"https://i.imgur.com/JTru4JA.jpg",
		"https://i.imgur.com/Lvgey6O.gif",
		"https://i.imgur.com/H7vljHu.gif",
		"https://i.imgur.com/PKIy7.gif",
		"https://i.imgur.com/Ky2WTYk.jpg",
		"https://i.imgur.com/AcqOF7u.jpg",
		"https://i.imgur.com/Bh6akRq.jpg",
		"https://i.imgur.com/UQSSNio.gif",
		"https://i.imgur.com/cp2Fj9E.png",
		"https://i.imgur.com/tl8HhB5.gifv",
		"https://i.imgur.com/Bm3VXVQ.gif",
		"https://i.imgur.com/FvUADdx.gif",
		"https://i.imgur.com/4nxUXLm.jpg",
		"https://i.imgur.com/Es6dow0.jpg",
		"https://i.imgur.com/SPj1lZJ.gif",
		"https://i.imgur.com/aYl8Qpa.gif",
		"https://i.imgur.com/KgeMI9q.jpg",
		"https://i.imgur.com/AWki9BT.png",
		"https://i.imgur.com/BTNOvGQ.gif",
		"https://i.imgur.com/feQdquF.gif",
		"https://i.imgur.com/qzCKC1E.gif",
		"https://i.imgur.com/rVIQMJM.gif",
		"https://i.imgur.com/Xyc17fz.jpg",
		"https://i.imgur.com/3sYsNG6.gif",
		"https://i.imgur.com/kOAm9gr.jpg",
		"https://i.imgur.com/c2Mh0Y5.jpg",
		"https://i.imgur.com/xYpLcDf.jpg",
		"https://i.imgur.com/GQ6SwQ9.jpg",
		"https://i.imgur.com/Skk5eEh.gif",
		"https://i.imgur.com/wIjC8nP.jpg",
		"https://i.imgur.com/gCz9mxD.jpg",
		"https://i.imgur.com/Mj8chHv.gif",
		"https://i.imgur.com/VHh6i3M.gif",
		"https://i.imgur.com/dKtrWW1.jpg",
		"https://i.imgur.com/i1V9Rha.jpg",
		"https://i.imgur.com/u8T6GuH.png",
		"https://i.imgur.com/gZ9Gt8v.gif"
	];

	constructor() {
		super();
	}
}

export const shaqCommand = new ShaqCommand();
