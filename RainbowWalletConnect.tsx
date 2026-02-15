"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit';

export const RainbowWalletConnect = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
      }) => {
        // Not connected
        if (!account || !chain) {
          return (
            <button
              onClick={openConnectModal}
              type="button"
              className="h-10 rounded-sm border-2 border-[#00ffbd] bg-transparent px-6 text-xs font-black uppercase tracking-widest text-[#00ffbd] transition-all hover:bg-[#00ffbd]/10"
            >
              Connect Wallet
            </button>
          );
        }

        // Wrong network
        if (chain.unsupported) {
          return (
            <button
              onClick={openChainModal}
              type="button"
              className="h-10 rounded-sm border-2 border-red-500 bg-red-500/10 px-6 text-xs font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-500/20"
            >
              Wrong network
            </button>
          );
        }

        // Connected
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={openChainModal}
              type="button"
              className="flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition-all hover:border-[#8247e5]/50 hover:bg-white/10"
            >
              {chain.hasIcon && (
                <div
                  className="h-3 w-3 rounded-full overflow-hidden"
                  style={{ background: chain.iconBackground }}
                >
                  {chain.iconUrl && (
                    <img
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl}
                      className="h-3 w-3"
                    />
                  )}
                </div>
              )}
              {chain.name}
            </button>
            <button
              onClick={openAccountModal}
              type="button"
              className="h-10 rounded-sm border border-[#00ffbd]/30 bg-[#00ffbd]/5 px-4 text-xs font-bold text-white transition-all hover:border-[#00ffbd]/50 hover:bg-[#00ffbd]/10"
            >
              {account.displayName}
              {account.displayBalance ? ` (${account.displayBalance})` : ''}
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
