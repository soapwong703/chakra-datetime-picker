import React, { useRef } from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DatePickerInput } from "../../DatePicker";
import { Box, Button } from "@chakra-ui/react";
import { useCallback } from "react";
import dayjs from "dayjs";

export default {
  title: "chakra-datetime-picker / DatePickerInput",
  component: DatePickerInput,
} as ComponentMeta<typeof DatePickerInput>;

const Template: ComponentStory<typeof DatePickerInput> = (args) => (
  <Box w={200}>
    <DatePickerInput {...args} />
  </Box>
);

export const Basic = Template.bind({});

const ControlledTemplate: ComponentStory<typeof DatePickerInput> = (args) => {
  const [value, setValue] = React.useState(null);

  const onChange = useCallback((date) => {
    console.log("onChange", date);
    setValue(date);
  }, []);

  const onClickClear = () => {
    setValue(null);
  };

  return (
    <Box w={200}>
      <DatePickerInput {...args} value={dayjs(value)} onChange={onChange} />
      <Button onClick={onClickClear}>Clear</Button>
    </Box>
  );
};

export const ControlledInput = ControlledTemplate.bind({});

const RefTemplate: ComponentStory<typeof DatePickerInput> = (args) => {
  const ref = useRef(null);

  return (
    <Box w={200}>
      <DatePickerInput {...args} ref={ref} />

      <Button onClick={() => console.log(ref)}>Log Ref</Button>
    </Box>
  );
};

export const RefInput = RefTemplate.bind({});
