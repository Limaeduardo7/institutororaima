const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

function checkVersions(deps) {
    if (!deps) return;
    for (const [name, version] of Object.entries(deps)) {
        try {
            if (version.startsWith('^') || version.startsWith('~')) {
                const v = version.substring(1);
                // Simple regex check for semver
                if (!/^\d+\.\d+\.\d+/.test(v)) {
                    console.log(`Potential invalid version for ${name}: ${version}`);
                }
            }
        } catch (e) {
            console.log(`Error checking ${name}: ${version}`);
        }
    }
}

console.log('Checking dependencies...');
checkVersions(pkg.dependencies);
console.log('Checking devDependencies...');
checkVersions(pkg.devDependencies);
