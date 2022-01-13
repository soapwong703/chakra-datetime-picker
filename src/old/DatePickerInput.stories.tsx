import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DatePickerInput } from "./DatePicker";
import { Box } from "@chakra-ui/react";

export default {
  title: "Chakra DatePicker / Old / DatePickerInput",
  component: DatePickerInput,
} as ComponentMeta<typeof DatePickerInput>;

const Template: ComponentStory<typeof DatePickerInput> = (args) => (
  <Box w={200}>
    <DatePickerInput {...args} />
  </Box>
);

export const Basic = Template.bind({});
