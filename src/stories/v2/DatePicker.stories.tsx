import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import DatePicker from "../../v2/DatePicker";

export default {
  title: "chakra-datepicker / v2 / DatePicker",
  component: DatePicker,
} as ComponentMeta<typeof DatePicker>;

const Template: ComponentStory<typeof DatePicker> = (args) => (
  <DatePicker {...args} />
);

export const Basic = Template.bind({});
