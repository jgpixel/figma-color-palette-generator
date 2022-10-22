figma.showUI(__html__, { themeColors: true, width: 900, height: 500, title: "Color Palette Generator" });

figma.ui.onmessage = msg => {
	generatePalette(msg.exportedColors, msg.RGBVals);
}

async function generatePalette(exportedColors: string[], RGBVals: number[][]): Promise<void> {
	await loadFont();

	const parentFrame: FrameNode = createNode(false);

	const colorBlocks: BaseNode[] = [];

	exportedColors.forEach((color: string, index: number) => {
		const colorBlock = createNode(true, color);

		const colorCircle: EllipseNode = figma.createEllipse();
		colorCircle.name = color;

		colorCircle.resize(80, 80);

		colorCircle.fills = [{ type: "SOLID", color: { r: RGBVals[index][0], g: RGBVals[index][1], b: RGBVals[index][2] } }];
		colorCircle.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];

		const colorCodeText: TextNode = figma.createText();
		colorCodeText.characters = color;
		colorCodeText.fontSize = 16;

		colorBlock.locked = true;
		colorCircle.locked = true;
		colorCodeText.locked = true;

		colorBlocks.push(colorBlock);

		colorBlock.appendChild(colorCircle);
		colorBlock.appendChild(colorCodeText);
		parentFrame.appendChild(colorBlock);
	});

	figma.viewport.scrollAndZoomIntoView(colorBlocks);

	figma.closePlugin(exportedColors.length + " colors successfully exported.");
}

function createNode(isVerticalLayout: boolean, color?: string): FrameNode {
	const node: FrameNode = figma.createFrame();
	
	node.name = color ? color : "Color Palette";

	node.layoutMode = isVerticalLayout ? "VERTICAL" : "HORIZONTAL";

	node.paddingTop = 20;
	node.paddingRight = 20;
	node.paddingBottom = 20;
	node.paddingLeft = 20;

	node.itemSpacing = 20;

	node.primaryAxisSizingMode = "AUTO";
	node.counterAxisSizingMode = "AUTO";
	node.primaryAxisAlignItems = "CENTER";
	node.counterAxisAlignItems = "CENTER";

	return node;
}

async function loadFont(): Promise<void> {
	await figma.loadFontAsync({
		family: "Inter",
		style: "Regular",
	});
};