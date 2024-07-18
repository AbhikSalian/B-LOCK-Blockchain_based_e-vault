import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

// Ensure global Buffer is available
window.Buffer = window.Buffer || Buffer;

const ipfs = create({
  host: 'gateway.pinata.cloud', // Pinata gateway host
  port: 443, // Pinata gateway port
  protocol: 'https', // Pinata gateway protocol
  headers: {
    authorization: 'Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwOGVkZWQzMy1lMDBjLTQwZTktOTE0MS0yYzc5Y2E0NjdjMWIiLCJlbWFpbCI6ImthcnRoaWtuYXlhazIwMDNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjIwN2I2NGM4NTg1ZGIzMWMwMjNmIiwic2NvcGVkS2V5U2VjcmV0IjoiNjI5YmI5YjgyMTExMjE2ZTRiZWE2ZTFhZGI4OTUxMTBkMDIxNzgzODdmNTJkYzg5OGI4YjM3NWQ1MDY2MjEyNSIsImlhdCI6MTcyMTE1MDY3MX0.EThokopf_1rezh3lL4lWDbI8V-hVjG9SYuuRqHfQhf0>', // Replace with your Pinata API key
  }
});

export const uploadFileToIPFS = async (file) => {
  try {
    const added = await ipfs.add(file);
    return added.path; // Return the IPFS CID of the uploaded file
  } catch (error) {
    console.error("Error uploading file to IPFS", error);
    throw error;
  }
};

export default ipfs;
