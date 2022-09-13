import React, { useRef } from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DatePickerInput } from "../../DatePicker";
import { Box, Button, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import dayjs from "dayjs";

import { Controller, useForm } from "react-hook-form";

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

  const onBlur = useCallback((date) => {
    console.log("onBlur", date);
    setValue(date);
  }, []);

  const onChange = useCallback((date) => {
    console.log("onChange", date);
    setValue(date);
  }, []);

  const onClickClear = () => {
    setValue(null);
  };

  return (
    <Box w={200}>
      <DatePickerInput
        {...args}
        value={dayjs(value)}
        onChange={onChange}
        onBlur={onBlur}
      />
      <Button onClick={onClickClear}>Clear</Button>
    </Box>
  );
};

export const ControlledInput = ControlledTemplate.bind({});

const RefTemplate: ComponentStory<typeof DatePickerInput> = (args) => {
  const ref = useRef(null);

  const onLogRef = () => {
    console.log(ref);
  };

  return (
    <Box w={200}>
      <DatePickerInput {...args} ref={ref} />

      <Button onClick={onLogRef}>Log Ref</Button>
    </Box>
  );
};

export const RefInput = RefTemplate.bind({});

const ReactHookFormTemplate: ComponentStory<typeof DatePickerInput> = (
  args
) => {
  const {
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  console.log(watch());

  return (
    <Box w={200}>
      <Controller
        name="datepicker"
        control={control}
        rules={{
          required: { value: true, message: "please input datepicker" },
        }}
        render={({ field }) => <DatePickerInput {...args} {...field} />}
      />
      <Text>{errors?.datepicker?.message}</Text>
      <Button onClick={() => reset()}>Clear</Button>
      <Button onClick={() => setValue("datepicker", "")}>Set ""</Button>
    </Box>
  );
};

export const ReactHookFormInput = ReactHookFormTemplate.bind({});
