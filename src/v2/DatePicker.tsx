import merge from "lodash/merge";
import React, { FC, useState } from "react";

import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Flex,
  IconButton,
  IconButtonProps,
} from "@chakra-ui/react";

type DatePickerBaseTheme = {
  header?: BoxProps;
  headerArrow?: IconButtonProps;
  body?: BoxProps;
  dateButton?: ButtonProps;
  selectableDayButton?: ButtonProps;
};

type DatePickerSizes = "lg" | "md" | "sm";

type DatePickerBaseThemeOverride = Record<DatePickerSizes, DatePickerBaseTheme>;

const baseTheme: DatePickerBaseTheme = {
  body: {
    w: 300,
    padding: 3,
  },
};

const baseThemeOverride: DatePickerBaseThemeOverride = {
  lg: {},
  md: {},
  sm: {},
};

type DatePickerProps = {
  size: DatePickerSizes;
  picker: "date" | "anniversary";
};

const DatePicker: FC<DatePickerProps> = ({ size, picker = "date" }) => {
  const theme = merge(baseTheme, baseThemeOverride[size]);

  const [currentView, setCurrentView] = useState<"month" | "year" | "datetime">(
    "datetime"
  );

  return (
    <Box
      zIndex={300}
      p={4}
      w="fit-content"
      h="100%"
      boxShadow="none"
      _hover={{ boxShadow: "none" }}
      display="flex"
      padding="0"
      userSelect="none"
    >
      <Box h="100%" {...theme.body}>
        <Flex alignItems="center">
          {/* {!(picker === "anniversary" && view === "month") && (
            <IconButton
              aria-label="previous"
              isDisabled={
                picker === "anniversary" &&
                curr.subtract(1, "month").isBefore(now.startOf("year"))
              }
              icon={
                view === "month" ? (
                  <FaAngleLeft />
                ) : view === "year" ? (
                  <FaAngleDoubleLeft />
                ) : (
                  <FaArrowLeft />
                )
              }
              w={componentSize[size].iconButton.w}
              h={componentSize[size].iconButton.h}
              variant="ghost"
              colorScheme={colorScheme}
              onClick={() => {
                if (view === "year")
                  return setCurr((curr) => curr.subtract(10, "year"));
                if (view === "month")
                  return setCurr((curr) => curr.subtract(1, "year"));
                return setCurr((curr) => curr.subtract(1, "month"));
              }}
            />
          )} */}
        </Flex>
      </Box>
    </Box>
  );
};

export default DatePicker;
