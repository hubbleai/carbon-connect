import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
// import { HiPlus, HiX } from 'react-icons/hi';
import './index.css';

const CounterComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p className="text-4xl text-center font-bold text-red-800">
        Currently, the count is {count}
      </p>
      <button onClick={() => setCount(count - 1)}>Subtract</button>
      <button onClick={() => setCount(count + 1)}>Add</button>
    </div>
  );
};

const IntegrationsModal = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <p className="trigger">Click</p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="content">
          <Dialog.Close asChild>
            <button className="close-button" aria-label="Close">
              <button className="icon">X</button>
            </button>
          </Dialog.Close>
          {/* {activeStep === 0 && (

            <CarbonAnnouncement setActiveStep={setActiveStep} />
          )}
          {activeStep === 1 && <ThirdPartyList setActiveStep={setActiveStep} />} */}

          <h1>Testing radix UI elements</h1>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export { CounterComponent, IntegrationsModal };
