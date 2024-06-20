const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
let evault;

const init = async () => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Evault.networks[networkId];
    evault = new web3.eth.Contract(
        Evault.abi,
        deployedNetwork && deployedNetwork.address,
    );

    document.getElementById("addDocumentForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const accounts = await web3.eth.getAccounts();
        const docName = document.getElementById("docName").value;
        const docHash = document.getElementById("docHash").value;
        await evault.methods.addDocument(docName, docHash).send({ from: accounts[0] });
        loadDocuments();
    });

    loadDocuments();
};

const loadDocuments = async () => {
    const documentCount = await evault.methods.documentCount().call();
    const documentsDiv = document.getElementById("documents");
    documentsDiv.innerHTML = "";

    for (let i = 1; i <= documentCount; i++) {
        const doc = await evault.methods.getDocument(i).call();
        documentsDiv.innerHTML += <p>Document ${doc.id}: ${doc.name} - ${doc.dataHash}</p>;
    }
};

window.addEventListener('load', () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        init();
    } else {
        console.warn('No web3 detected. Please install MetaMask.');
    }
});