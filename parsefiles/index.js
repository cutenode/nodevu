// file should be a string
function parseFiles(file, version) {
    const fileInformation = {
      id: file,
      files: [file]
    }
  
    if(fileInformation.files[0].includes('-pkg')) {   // macOS filenames
      fileInformation.files[0] = `node-v${version}.pkg`
    } else if(fileInformation.files[0].includes('osx-')) {
      const basemacOSString = `node-v${version}-darwin-`
      if(fileInformation.files[0].includes('arm64')) {
        fileInformation.files[0] = basemacOSString.concat('arm64.tar.gz')
      }
      if(fileInformation.files[0].includes('x64')) {
        fileInformation.files[0] = basemacOSString.concat('x64.tar.gz')
      }
    } else if(fileInformation.files[0].includes('-7z')) { // windows filenames
      fileInformation.files[0] = `node-v${version}-${fileInformation.files[0].replace('-7z', '.7z')}`
    } else if(fileInformation.files[0].includes('-zip')) {
      fileInformation.files[0] = `node-v${version}-${fileInformation.files[0].replace('-zip', '.zip')}`
    } else if(fileInformation.files[0].includes('-msi')) {
      fileInformation.files[0] = `node-v${version}-${fileInformation.files[0].replace('-msi', '.msi').replace('win-', '')}`
    } else if(fileInformation.files[0].includes('-exe')) {
      fileInformation.files[0] = `win-x64/node.exe`
      fileInformation.files.push(`win-x64/node.lib`)
      fileInformation.files.push(`win-x64/node_pdb.7z`)
      fileInformation.files.push(`win-x64/node_pdb.zip`)
      fileInformation.files.push(`win-x86/node.exe`)
      fileInformation.files.push(`win-x86/node.lib`)
      fileInformation.files.push(`win-x86/node_pdb.7z`)
      fileInformation.files.push(`win-x86/node_pdb.zip`)
    } else if(fileInformation.files[0] === ('src')) {
        fileInformation.files[0] = `node-v${version}.tar.gz`
        fileInformation.files[0] = `node-v${version}.tar.xz`
    } else if(fileInformation.files[0].includes('linux-') || fileInformation.files[0] === ('headers') || fileInformation.files[0] === ('aix-ppc64')) {
      fileInformation.files[0] = `node-v${version}-${fileInformation.files[0]}.tar.gz`
      fileInformation.files.push(fileInformation.files[0].replace('.tar.gz', '.tar.xz'))
    } else {
      fileInformation.files[0] = fileInformation.files[0].concat('.tar.gz')
    }
  
    if(file.includes('osx-')) {
      fileInformation.type = 'macos'
    } else if(file.includes('linux-')) {
      fileInformation.type = 'linux'
    } else if(file.includes('win-')) {
      fileInformation.type = 'windows'
    } else if(file.includes('headers')) {
      fileInformation.type = 'headers'
    } else if(file.includes('src')) {
      fileInformation.type = 'source'
    } else if(file.includes('aix-ppc64')) {
      fileInformation.type = 'aix'
    } else if(file.includes('sunos-x64') || file.includes('sunos-x86')) {
      fileInformation.type = 'sunos'
    }
  
    return fileInformation
  }
  
  module.exports = parseFiles