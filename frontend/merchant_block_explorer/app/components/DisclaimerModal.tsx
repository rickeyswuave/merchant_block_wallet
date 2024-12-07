import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DisclaimerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl"> {/* Adjust the width here */}
        <DialogHeader>
          <DialogTitle>DeFi Fall 2024 Project Information:</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <p>For this class and development & correction reasons, this app is using the following hardcoded public and private keys for development reasons:</p>
          <p>Public Key: 28gKfgTw6xkZiYcJ7vA5KBqKzew3kscYW7UwM5vgRNLb</p>
          <p>Private Key: 5tNS93EPvaCNDsYUeBAiDWArT1eR15iDjtoQLQnv3Szz7E1o7VsVd8NKYYrXkdHLPmTi2TurmjMvRWic7E5WZ34o</p>
          <p>In the real application, these would be exchanged for a wallet adapter connection with the preferred wallet a user uses.</p>
          <p> </p>
          <p>Furthermore: Due to the free rpc node connection used, only Solana transactions from within the last 5 days show up on the transaction list.</p>
          <p>Should the merchant transaction overview be empty, please send a new transaction to the above specified devnet wallet or alternatively change the used rpc connection.</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}