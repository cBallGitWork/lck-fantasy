import "./ProviderMark.css";

/** The sign-in provider's mark: `G`, `D` (Settings' account, the sign-up sheet). */
export const ProviderMark = ({ provider }: { provider: string }) => (
  <span className="provider-mark" aria-hidden="true">
    {provider[0]}
  </span>
);
