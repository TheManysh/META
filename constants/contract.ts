import { sepolia } from 'thirdweb/chains';
import { getContract } from 'thirdweb';
import { client } from '@/services/thirdweb';

const CONTRACT_ADDRESS = '0x2367aB95F70f9B46C28Db5b50Ba28E75A7c533e5';
export const contract = getContract({
  client: client,
  chain: sepolia,
  address: CONTRACT_ADDRESS,
});
