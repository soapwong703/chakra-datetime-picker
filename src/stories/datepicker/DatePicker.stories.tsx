import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DatePicker } from "../../DatePicker";

export default {
  title: "chakra-datepicker / DatePicker",
  component: DatePicker,
} as ComponentMeta<typeof DatePicker>;

const Template: ComponentStory<typeof DatePicker> = (args) => (
  <DatePicker {...args} />
);

export const Basic = Template.bind({});
