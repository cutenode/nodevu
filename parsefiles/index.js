// file should be a string
function parseFilename (file, version) {
  const info = {
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

  if (info.files[0].includes('-pkg')) { // macOS filenames.
    info.files[0] = `node-v${version}.pkg`
  } else if (info.files[0].includes('osx-')) { // macOS filenames, but with architectures. Different than the above.
    const basemacOSString = `node-v${version}-darwin-`
    if (info.files[0].includes('arm64')) {
      info.files[0] = basemacOSString.concat('arm64.tar.gz')
    }
    if (info.files[0].includes('x64')) {
      info.files[0] = basemacOSString.concat('x64.tar.gz')
    }
  } else if (info.files[0].includes('-7z')) { // windows filenames
    info.files[0] = `node-v${version}-${info.files[0].replace('-7z', '.7z')}`
  } else if (info.files[0].includes('-zip')) {
    info.files[0] = `node-v${version}-${info.files[0].replace('-zip', '.zip')}`
  } else if (info.files[0].includes('-msi')) {
    info.files[0] = `node-v${version}-${info.files[0].replace('-msi', '.msi').replace('win-', '')}`
  } else if (info.files[0].includes('-exe')) {
    info.files[0] = 'win-x64/node.exe'
    info.files.push('win-x64/node.lib')
    info.files.push('win-x64/node_pdb.7z')
    info.files.push('win-x64/node_pdb.zip')
    info.files.push('win-x86/node.exe')
    info.files.push('win-x86/node.lib')
    info.files.push('win-x86/node_pdb.7z')
    info.files.push('win-x86/node_pdb.zip')
  } else if (info.files[0] === ('src')) { // source filenames.
    info.files[0] = `node-v${version}.tar.gz`
    info.files[0] = `node-v${version}.tar.xz`
  } else if (info.files[0].includes('linux-') || info.files[0] === ('headers') || info.files[0] === ('aix-ppc64')) { // linux, headers, and aix
    info.files[0] = `node-v${version}-${info.files[0]}.tar.gz`
    info.files.push(info.files[0].replace('.tar.gz', '.tar.xz'))
  } else {
    info.files[0] = info.files[0].concat('.tar.gz')
  }

  // handle the types appropriately.
  if (file.includes('osx-')) {
    info.type = 'macos'
  } else if (file.includes('linux-')) {
    info.type = 'linux'
  } else if (file.includes('win-')) {
    info.type = 'windows'
  } else if (file.includes('headers')) {
    info.type = 'headers'
  } else if (file.includes('src')) {
    info.type = 'source'
  } else if (file.includes('aix-ppc64')) {
    info.type = 'aix'
  } else if (file.includes('sunos-x64') || file.includes('sunos-x86')) {
    info.type = 'sunos'
  }

  return info
}

module.exports = parseFilename
