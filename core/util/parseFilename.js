// file should be a string
function parseFilename (file, version) {
  const fileInformation = {
    id: file,
    files: [file]
  }

  // to whoever reads this in the future: I'm sorry
  //
  // this code is basically a bunch of if statements that parse certain
  // parts of the `files` property on each release in
  // nodejs.org/dist/index.json and then builds out an object from that
  // so we can have more useful information about each release. It's a bit
  // messy, but it _seemingly_ works, at least at time of writing.
  //
  // Over time, there's historically been additions, so this will likely
  // drift apart from the reality of what's in there. Feel free to either
  // ping me or submit a PR to update it when that happens.

  if (fileInformation.files[0].includes('-pkg')) { // macOS filenames.
    fileInformation.files[0] = `node-v${version}.pkg`
  } else if (fileInformation.files[0].includes('osx-')) { // macOS filenames, but with architectures. Different than the above.
    const basemacOSString = `node-v${version}-darwin-`
    if (fileInformation.files[0].includes('arm64')) {
      fileInformation.files[0] = basemacOSString.concat('arm64.tar.gz')
    }
    if (fileInformation.files[0].includes('x64')) {
      fileInformation.files[0] = basemacOSString.concat('x64.tar.gz')
    }
  } else if (fileInformation.files[0].includes('-7z')) { // windows filenames
    fileInformation.files[0] = `node-v${version}-${fileInformation.files[0].replace('-7z', '.7z')}`
  } else if (fileInformation.files[0].includes('-zip')) {
    fileInformation.files[0] = `node-v${version}-${fileInformation.files[0].replace('-zip', '.zip')}`
  } else if (fileInformation.files[0].includes('-msi')) {
    fileInformation.files[0] = `node-v${version}-${fileInformation.files[0].replace('-msi', '.msi').replace('win-', '')}`
  } else if (fileInformation.files[0].includes('-exe')) {
    fileInformation.files[0] = 'win-x64/node.exe'
    fileInformation.files.push('win-x64/node.lib')
    fileInformation.files.push('win-x64/node_pdb.7z')
    fileInformation.files.push('win-x64/node_pdb.zip')
    fileInformation.files.push('win-x86/node.exe')
    fileInformation.files.push('win-x86/node.lib')
    fileInformation.files.push('win-x86/node_pdb.7z')
    fileInformation.files.push('win-x86/node_pdb.zip')
  } else if (fileInformation.files[0] === ('src')) { // source filenames.
    fileInformation.files[0] = `node-v${version}.tar.gz`
    fileInformation.files[0] = `node-v${version}.tar.xz`
  } else if (fileInformation.files[0].includes('linux-') || fileInformation.files[0] === ('headers') || fileInformation.files[0] === ('aix-ppc64')) { // linux, headers, and aix
    fileInformation.files[0] = `node-v${version}-${fileInformation.files[0]}.tar.gz`
    fileInformation.files.push(fileInformation.files[0].replace('.tar.gz', '.tar.xz'))
  } else {
    fileInformation.files[0] = fileInformation.files[0].concat('.tar.gz')
  }

  // handle the types appropriately.
  if (file.includes('osx-')) {
    fileInformation.type = 'macos'
  } else if (file.includes('linux-')) {
    fileInformation.type = 'linux'
  } else if (file.includes('win-')) {
    fileInformation.type = 'windows'
  } else if (file.includes('headers')) {
    fileInformation.type = 'headers'
  } else if (file.includes('src')) {
    fileInformation.type = 'source'
  } else if (file.includes('aix-ppc64')) {
    fileInformation.type = 'aix'
  } else if (file.includes('sunos-x64') || file.includes('sunos-x86')) {
    fileInformation.type = 'sunos'
  }

  return fileInformation
}

module.exports = parseFilename
