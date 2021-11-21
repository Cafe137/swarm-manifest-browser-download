import { Bee } from '@ethersphere/bee-js'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { useRef, useState } from 'react'
import { SwarmManifestList } from 'swarm-manifest-list'

function App() {
    const beeApiUrlInput = useRef(null)
    const hashInput = useRef(null)

    const [files, setFiles] = useState({})

    function onSearch() {
        const beeApiUrl = beeApiUrlInput.current.value
        const hash = hashInput.current.value
        new SwarmManifestList(new Bee(beeApiUrl)).getHashes(hash).then(x => setFiles(x))
    }

    async function onDownload() {
        const beeApiUrl = beeApiUrlInput.current.value
        const bee = new Bee(beeApiUrl)
        const zip = new JSZip()
        for (const [path, hash] of Object.entries(files)) {
            zip.file(path, await bee.downloadData(hash))
        }
        const content = await zip.generateAsync({ type: 'blob' })
        saveAs(content, hashInput.current.value + '.zip')
    }

    return (
        <>
            <div>
                <label>Bee API URL</label>
                <input ref={beeApiUrlInput} defaultValue="http://localhost:1633" />
            </div>
            <div>
                <label>Swarm Hash</label>
                <input ref={hashInput} />
                <button onClick={onSearch}>Search</button>
            </div>
            <div>
                <label>Files</label>
                <pre>{JSON.stringify(files, null, 4)}</pre>
            </div>
            <div>
                <label>Download ZIP</label>
                <button onClick={onDownload}>Download</button>
            </div>
        </>
    )
}

export default App
