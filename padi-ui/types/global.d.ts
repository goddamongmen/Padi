interface Window {
  keplr?: {
    enable: (chainId: string) => Promise<void>
    getOfflineSigner: (chainId: string) => {
      getAccounts: () => Promise<{ address: string; pubkey: Uint8Array }[]>
    }
  }
}

