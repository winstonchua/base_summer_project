export const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "contractAddress",
				"type": "address"
			}
		],
		"name": "ContractDeployed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "bytecode",
				"type": "bytes"
			}
		],
		"name": "deploy",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]