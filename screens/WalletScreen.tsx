import React from 'react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { Address } from 'ton-core';

interface WalletScreenProps {
    points: number;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ points }) => {
    const wallet = useTonWallet();

    const formatAddress = (address: string) => {
        try {
            const userFriendlyAddress = Address.parse(address).toString({ bounceable: false });
            return `${userFriendlyAddress.slice(0, 6)}...${userFriendlyAddress.slice(-4)}`;
        } catch (error) {
            console.error("Failed to parse address", error);
            return "Invalid Address";
        }
    }

    return (
        <div className="w-full pb-20 flex flex-col items-center">
             <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,122,255,0.2)] p-6 w-full">
                <h1 className="text-2xl font-bold mb-4 text-center">My Wallet</h1>

                <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-xl">
                        <p className="text-sm text-gray-500">SECCO-Points Balance</p>
                        <p className="text-2xl font-bold">{points.toLocaleString('en-US', { maximumFractionDigits: 1 })} P</p>
                    </div>
                     <div className="bg-gray-100 p-4 rounded-xl">
                        <p className="text-sm text-gray-500">TON Balance</p>
                        <p className="text-2xl font-bold">2.75 TON</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2 text-center">Connect Wallet</h2>
                    <p className="text-center text-gray-500 text-sm mb-4">
                        Connect your TON wallet to purchase boosters and participate in special events.
                    </p>
                     <div className="flex justify-center">
                        <TonConnectButton />
                    </div>
                    {wallet && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                            <h3 className="font-semibold text-md text-blue-800">Wallet Connected!</h3>
                            <p className="text-sm text-blue-700 mt-1 break-all">
                                {formatAddress(wallet.account.address)}
                            </p>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};

export default WalletScreen;