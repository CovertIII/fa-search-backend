const fs = require('fs');
const path = require('path');


const svgPath = path.join(__dirname, 'public', 'svgs');

const list = [];

const readFiles = async (pathToDir) => {
  const files = await fs.promises.readdir(pathToDir);
  for(const file of files) {
    const fullFile = path.join(pathToDir, file);
    const stat = await fs.promises.stat(fullFile);
    if(stat.isDirectory()) {
      await readFiles(fullFile);
    } else {
      if(path.extname(fullFile) === '.svg') {
        list.push({
          uri: path.join('svgs', fullFile.replace(svgPath, '')),
          name: path.basename(fullFile, '.svg')
        });
      }
    }
  }
}

const searchList = async term => {
  if(list.length === 0 ) {
    // Cache list of files
    await readFiles(svgPath);
  }

  return list.filter(({name}) => {
    return name.includes(term);
  });
};

module.exports = {
  searchList
}
