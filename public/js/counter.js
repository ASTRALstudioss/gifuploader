let counter = 0;

function getNextFilename() {
  return (counter++).toString();
}

module.exports = {
  getNextFilename: getNextFilename
};