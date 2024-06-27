import { http, createConfig } from 'wagmi';
import { mainnet, sepolia , baseSepolia} from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets  } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Suggested',
      wallets: [
        rainbowWallet,
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
  ],
  { appName: 'RainbowKit App', projectId: 'YOUR_PROJECT_ID' },
);

export const config = createConfig({
  connectors,
  chains: [mainnet, sepolia, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]:http(),

  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
