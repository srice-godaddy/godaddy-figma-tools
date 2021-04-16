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

  let undeletedPage = null;
  const pageReferences = {};

  const pageList = [
    ...figma.root.children
  ];

  for (const page of pageList) {
    try {
      page.remove();
    } catch (e) {
      undeletedPage = page;
    }
  }

  for (const key of Object.keys(pages)) {
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
  const instance = component.createInstance();
  figma.viewport.scrollAndZoomIntoView([instance]);

  undeletedPage.remove();
  figma.closePlugin();
}

doImport();
