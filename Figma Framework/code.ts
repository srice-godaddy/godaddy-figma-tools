// console.log(figma.currentPage.selection[0].mainComponent.key);
// figma.closePlugin();

async function doImport() {
  const pages = {
    ref: '—— REFERENCE ———————',
    readme: '📖 Readme',
    documents: '📝 Documents',
    presentations: '🎥 Presentations',
    futureStateDesign: '🏆 Future State Design',
    competitorExamples: '🔎 Competitor Examples',
    components: '🧩 Components',
    finalDesign: '—— FINAL DESIGN ——————',
    jan2021: '✅ Jan 2021 Test: Project Name',
    projectName2: '✅ Project Name',
    WIPDesign: '—— WIP DESIGN ———————',
    projectName1: '🚧 Project Name',
    exploration: '—— EXPLORATION ——————',
    playground: '🏖 Playground',
    archive: '⏳ Archive',
  };

  const background = {
    readme: { r: 0, g: 0, b: 0 }
  };

  const pageReferences = {};

  const pageList = [
    ...figma.root.children
  ];

  const existingPageMap = {};

  for (const page of pageList) {
    existingPageMap[page.name] = page;
  }

  for (const key of Object.keys(pages)) {
    if (existingPageMap[pages[key]]) {
      pageReferences[key] = existingPageMap[pages[key]];
      continue;
    }

    const page = figma.createPage();
    page.name = pages[key];

    if (background[key]) {
      page.backgrounds = [
        <SolidPaint>({
          type: 'SOLID',
          color: <RGB>(background[key]),
          opacity: 1
        })
      ];
    }

    pageReferences[key] = page;
  }

  const component = await figma.importComponentByKeyAsync('c16864eed305a49f64195148cddcad1e5582caf9')

  figma.currentPage = pageReferences['readme'];

  const elements = figma.currentPage.children;
  for (const element of elements) {
    element.remove();
  }

  const nodes = [];

  for (const element of component.children) {
    nodes.push(element.clone());
  }

  figma.viewport.scrollAndZoomIntoView(nodes);

  figma.closePlugin();
}

doImport();
