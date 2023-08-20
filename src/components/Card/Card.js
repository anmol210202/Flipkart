import { useMetamask } from "@thirdweb-dev/react";

function connectWithMetamask() {
    const connectWithMetamask = useMetamask();
  
    return (
      <button onClick={() => connectWithMetamask()}>Connect Metamask</button>
    );
  }

export default connectWithMetamask;
