const fs = __non_webpack_require__('fs');
const lockfile = require('@yarnpkg/lockfile');

// Take lockfiles as arguments
const lockFiles = process.argv.slice(2);

const dedupeLockfile = (packageSet, itr) => {
  const unique = {};
  const dupes = new Set();

  for (const pkg of packageSet) {
    const deconstructed = pkg.match(/(.*)@(.*)$/);
    if (deconstructed[1] in unique) {
      dupes.add(pkg);
      // dupes.push(pkg);
    } else {
      unique[deconstructed[1]] = deconstructed[2];
    }
  }

  fs.writeFileSync(`./package-${itr}.json`, JSON.stringify({dependencies: unique}, null, 2));

  // The rest
  if (dupes.size > 0) {
    dedupeLockfile(dupes, itr+1);
  }
};

const deduped = new Set();
// Loop through all yarn.lock files
for (const lockFile of lockFiles) {
  const file = fs.readFileSync(lockFile, 'utf8');
  const json = lockfile.parse(file);
  const {object} = json;

  const keys = Object.keys(object);
  const result = keys.map(pkg => {
    const deconstructed = pkg.match(/(.*)@(.*)$/);
    deduped.add(`${deconstructed[1]}@${object[pkg].version}`);
  });
}

dedupeLockfile(deduped, 1);
