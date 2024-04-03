import React from 'react';

import {getStepOptions, getTourOptions, scrollToStepTarget} from '../helpers';
import {useTourControls, useTourState} from '../hooks';
import {StepProps} from '../types';
import {isInView} from '../utils';
import Popover from './core/Popover';
import StepContent from './StepContent';
import StepFooter from './StepFooter';

const Step = React.memo(({step}: StepProps) => {
  const {closeTour, nextStep, prevStep} = useTourControls();
  const {isTourOpen, activeTour} = useTourState();

  const {showOverlay, preventCloseOnClickOutside} = getTourOptions(activeTour);

  const {placement, backOnClickTarget, closeOnClickTarget, nextOnClickTarget} =
    getStepOptions(step);

  const [popoverTarget, setPopoverTarget] = React.useState<HTMLElement | null>(
    null,
  );

  React.useEffect(() => {
    setPopoverTarget(null);

    if (!step) {
      return;
    }

    const {target: targetSelector} = step;

    if (!targetSelector) {
      return;
    }

    const trySetTarget = () => {
      const targetElement = document.querySelector<HTMLElement>(targetSelector);
      if (!targetElement) return false;

      // Check if the target is in view, if not, scroll to it.
      if (isInView(targetElement)) {
        setPopoverTarget(targetElement);
        return true;
      } else {
        // Scroll to the target and then set it as popover target.
        scrollToStepTarget(targetElement, () =>
          setPopoverTarget(targetElement),
        );
        return true;
      }
    };

    // Attempt to set the target. If unsuccessful, observe the DOM for changes.
    if (trySetTarget()) return;

    const observer = new MutationObserver(() => {
      if (trySetTarget()) observer.disconnect();
    });

    observer.observe(document.body, {childList: true, subtree: true});

    return () => {
      observer.disconnect();
      setPopoverTarget(null);
    };
  }, [step]);

  if (!step) return null;

  return (
    <Popover
      open={isTourOpen}
      target={popoverTarget}
      preferredPosition={placement}
      shouldShowOverlay={showOverlay}
      onClickOutside={() => {
        if (!preventCloseOnClickOutside) closeTour();
      }}
      onClickTarget={() => {
        if (nextOnClickTarget) nextStep();
        if (backOnClickTarget) prevStep();
        if (closeOnClickTarget) closeTour();
      }}>
      <Popover.Content
        className="nt-step-container"
        data-show-overlay={showOverlay}>
        <StepContent>
          <StepContent.Title>{step.title}</StepContent.Title>
          {step.content}
        </StepContent>
        <StepFooter />
      </Popover.Content>
    </Popover>
  );
});

Step.displayName = 'Next Tour Step';

export default Step;
