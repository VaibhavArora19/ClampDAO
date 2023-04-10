import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar/Navbar";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygonMumbai, optimism, arbitrum } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [mainnet, polygonMumbai, optimism, arbitrum],
  [
    alchemyProvider({ apiKey: "KM1Kv-cqY7LlaPsoximQwOASxTzExuR5" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Clamp DAO",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="mt-6">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
