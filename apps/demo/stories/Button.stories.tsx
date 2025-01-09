import {Box, Button, ButtonProps, Heading} from "ferns-ui";
import React from "react";

export const ButtonDemo = (props: Partial<ButtonProps>) => {
  return (
    <Box alignItems="center" justifyContent="center">
      <Button iconName="plus" text="Button" onClick={() => console.info("clicked")} {...props} />
    </Box>
  );
};

export const ButtonVariants = (props: Partial<ButtonProps>) => {
  return (
    <>
      <Box direction="row" wrap>
        <Box padding={1}>
          <Button text="Default/Primary" onClick={() => console.info("clicked")} {...props} />
        </Box>
        <Box padding={1}>
          <Button
            text="Secondary"
            variant="secondary"
            onClick={() => console.info("clicked")}
            {...props}
          />
        </Box>
        <Box padding={1}>
          <Button
            text="Outline"
            variant="outline"
            onClick={() => console.info("clicked")}
            {...props}
          />
        </Box>
        <Box padding={1}>
          <Button
            text="Destructive"
            variant="destructive"
            onClick={() => console.info("clicked")}
            {...props}
          />
        </Box>
        <Box padding={1}>
          <Button text="Muted" variant="muted" onClick={() => console.info("clicked")} {...props} />
        </Box>
        <Box padding={1}>
          <Button disabled text="Disabled" onClick={() => console.info("clicked")} {...props} />
        </Box>
      </Box>
      <Box direction="column" paddingX={1} paddingY={4}>
        <Heading>Disabled Variants</Heading>
      </Box>
      <Box direction="row" wrap>
        <Box padding={1}>
          <Button
            disabled
            text="Default/Primary"
            onClick={() => console.info("clicked")}
            {...props}
          />
        </Box>
        <Box padding={1}>
          <Button
            disabled
            text="Secondary"
            variant="secondary"
            onClick={() => console.info("clicked")}
            {...props}
          />
        </Box>
        <Box padding={1}>
          <Button
            disabled
            text="Outline"
            variant="outline"
            onClick={() => console.info("clicked")}
            {...props}
          />
        </Box>
        <Box padding={1}>
          <Button
            disabled
            text="Destructive"
            variant="destructive"
            onClick={() => console.info("clicked")}
            {...props}
          />
        </Box>
        <Box padding={1}>
          <Button
            disabled
            text="Muted"
            variant="muted"
            onClick={() => console.info("clicked")}
            {...props}
          />
        </Box>
        <Box padding={1}>
          <Button
            disabled
            text="Custom"
            customBackgroundColor="#00FF00"
            customTextColor="#000000"
            onClick={() => console.info("clicked")}
            {...props}
          />
        </Box>
      </Box>
    </>
  );
};

export const ButtonIconPosition = () => {
  return (
    <Box direction="row" wrap>
      <Box padding={1}>
        <Button iconName="check" text="Icon default" onClick={() => console.info("clicked")} />
      </Box>
      <Box padding={1}>
        <Button
          iconName="check"
          iconPosition="right"
          text="Icon Right"
          onClick={() => console.info("clicked")}
        />
      </Box>
    </Box>
  );
};

export const ButtonLoading = () => {
  return (
    <Box direction="row" wrap>
      <Box padding={1}>
        <Button
          text="Async Loading Button"
          onClick={async () => {
            return new Promise((resolve) => {
              setTimeout(resolve, 2 * 1000);
            });
          }}
        />
      </Box>
      <Box padding={1}>
        <Button loading text="Is Loading" onClick={() => console.info("clicked")} />
      </Box>
    </Box>
  );
};

export const ConfirmationButton = () => {
  return (
    <Box>
      <Box paddingX={3} paddingY={3}>
        <Button
          text="Default Confirmation Modal"
          withConfirmation
          onClick={() => console.info("clicked")}
        />
      </Box>
      <Box paddingX={3} paddingY={1}>
        <Button
          confirmationText="And some custom text body!"
          modalTitle="A Custom Title"
          text="With Custom Modal Props"
          withConfirmation
          onClick={() => console.info("clicked")}
        />
      </Box>
    </Box>
  );
};

export const FullWidthButtons = (props: Partial<ButtonProps>) => {
  return (
    <>
      <Box paddingY={1}>
        <Button
          text="Default/Primary Full Width"
          onClick={() => console.info("clicked")}
          {...props}
          fullWidth
        />
      </Box>
      <Box paddingY={1}>
        <Button
          text="Full Width with tooltip"
          tooltipText="This is a tooltip"
          onClick={() => console.info("clicked")}
          {...props}
          fullWidth
        />
      </Box>
    </>
  );
};

export const MultilineButtons = () => (
  <Box direction="row" wrap>
    <Box maxWidth={400} padding={1}>
      <Button text={"Here is some text\nAnd a second line"} onClick={() => {}} />
    </Box>
    <Box maxWidth={400} padding={1}>
      <Button
        iconName="plus"
        text={"Here is some text and \nA second line with an icon"}
        onClick={() => {}}
      />
    </Box>
  </Box>
);
