import { MainAction, Modal, SheetKeys } from "../../parts";
import { firstName, type Manager } from "./feed";
import { blockTitle, WORDS } from "./words";

/** Block asks first (spec/14): `Block Minji?`, what it does, then Back or Block. Remove asks nothing. */
export function BlockSheet({ follower, onBlock, onClose }: { follower: Manager; onBlock: () => void; onClose: () => void }) {
  return (
    <Modal kind="sheet" title={blockTitle(firstName(follower))} onClose={onClose}>
      <p>{WORDS.blockLine}</p>
      <SheetKeys onBack={onClose}>
        <MainAction onClick={onBlock}>{WORDS.block}</MainAction>
      </SheetKeys>
    </Modal>
  );
}
