import {ErrorBoundary} from "@components";
import {DemoConfig, DemoConfigStatus, DemoConfiguration, DemoConfigurationProp} from "@config";
import {router, useLocalSearchParams} from "expo-router";
import {
  AllColors,
  Badge,
  Box,
  Field,
  FontAwesome5IconName,
  Heading,
  Icon,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
} from "ferns-ui";
import cloneDeep from "lodash/cloneDeep";
import startCase from "lodash/startCase";
import React, {useState} from "react";
// @ts-ignore
import {MarkdownView} from "react-native-markdown-view";

const ComponentProps = ({props}: {props: DemoConfigurationProp[]}) => {
  // TODO: setup these widths for mobile too.

  // sort props into all the ones that are required first, then the rest
  const sortProps = (p: DemoConfigurationProp[]): DemoConfigurationProp[] => {
    if (!p) return [];
    return p.sort((a, b) => {
      // First, sort by optionality (non-optional first)
      if (a.flags.isOptional !== b.flags.isOptional) {
        return a.flags.isOptional ? 1 : -1;
      }

      // Then, sort alphabetically by name
      return a.name.localeCompare(b.name);
    });
  };

  const sortedProps = sortProps(props);

  return (
    <Box marginBottom={4}>
      <Box marginBottom={2}>
        <Heading>Props</Heading>
      </Box>
      <Table columns={[160, 600, 160]}>
        <TableHeader>
          <TableHeaderCell index={0}>
            <Text>Name</Text>
          </TableHeaderCell>
          <TableHeaderCell index={1}>
            <Text>Type</Text>
          </TableHeaderCell>
          <TableHeaderCell index={2}>
            <Text>Default</Text>
          </TableHeaderCell>
        </TableHeader>
        {/* eslint-disable-next-line react/prop-types */}
        {sortedProps.map((p) => (
          <TableRow key={p.name}>
            <Box direction="row">
              <Text>{p.name}</Text>
              {Boolean(p.flags?.isOptional !== true) && <Badge color="orange" title="Required" />}
            </Box>
            <Box direction="column" width={160} wrap>
              <Text italic overflow="breakWord">
                {p.type.name}
              </Text>
              {Boolean(p.comment?.summary?.[0]?.text) && (
                <Box marginTop={2}>
                  <Text>{p.comment?.summary?.[0]?.text}</Text>
                </Box>
              )}
            </Box>
            <Text>-</Text>
          </TableRow>
        ))}
      </Table>
    </Box>
  );
};

const ComponentStories = ({config}: {config: DemoConfiguration}): React.ReactElement | null => {
  if (!Object.keys(config.stories).length) {
    return null;
  }
  return (
    <Box>
      {Object.keys(config.stories ?? {}).map(
        (s, i): React.ReactElement => (
          <Box key={i} marginBottom={8} rounding={4}>
            <Box marginBottom={2}>
              <Heading size="sm">{s}</Heading>
            </Box>
            {Boolean(config.stories[s]?.description) && (
              <MarkdownView>{config.stories[s]?.description}</MarkdownView>
            )}
            <Box border="darkGray" padding={4} rounding={4}>
              <ErrorBoundary>{config.stories[s]?.render()}</ErrorBoundary>
            </Box>
          </Box>
        )
      )}
    </Box>
  );
};

// const ComponentTestMatrix = ({config}: {config: DemoConfiguration}): React.ReactElement | null => {
//   // TODO: accordion this whole thing, default folded up, just for testing.
//   function generateCombinations(testMatrix: {[prop: string]: any[]}): any[] {
//     const keys = Object.keys(testMatrix);
//     const generate = (objIndex: number, prevCombination: any): any[] => {
//       if (objIndex === keys.length) {
//         return [prevCombination];
//       }
//
//       const key = keys[objIndex];
//       const values = testMatrix[key];
//       const allCombinations: any[] = [];
//
//       for (const value of values) {
//         const combination = {...prevCombination, [key]: value};
//         const combinationsFromHere = generate(objIndex + 1, combination);
//         allCombinations.push(...combinationsFromHere);
//       }
//
//       return allCombinations;
//     };
//
//     return generate(0, {});
//   }
//
//   const combinations: any[] = [];
//
//   const generateTitleForCombination = (combination: {[prop: string]: any}): string =>
//     Object.entries(combination)
//       .map(([key, value]) => `${key}: ${value}`)
//       .join(" - ");
//
//   const Component = config.component;
//
//   return (
//     <Box>
//       <Box marginBottom={4}>
//         <Heading>Testing Matrix</Heading>
//       </Box>
//       {combinations.map((combo) => (
//         <Box key={generateTitleForCombination(combo)} marginBottom={2}>
//           <Box marginBottom={1}>
//             <Heading size="sm">{generateTitleForCombination(combo)}</Heading>
//           </Box>
//           <Component {...combo} />
//         </Box>
//       ))}
//     </Box>
//   );
// };

const ComponentDemo = ({config}: {config: DemoConfiguration}) => {
  const convertControls = (controls: any): {[key: string]: any} => {
    const result: {[key: string]: any} = {};
    Object.keys(controls).forEach((key) => {
      // TODO: use type to figure out a better default (e.g. true for boolean, etc)
      result[key] = controls[key].defaultValue ?? "";
    });
    return result;
  };

  const [propValues, setPropValues] = useState(convertControls(config.demoOptions?.controls ?? {}));

  const hasControls = Object.keys(config.demoOptions?.controls ?? {}).length > 0;

  return (
    <Box direction="column" marginBottom={2} mdDirection="row" width="100%">
      <Box
        alignItems="center"
        border="darkGray"
        direction="column"
        flex="grow"
        justifyContent="center"
        marginBottom={4}
        marginLeft={2}
        marginRight={2}
        padding={4}
        rounding={4}
      >
        <ErrorBoundary>{config.demo?.(propValues)}</ErrorBoundary>
      </Box>
      {Boolean(hasControls) && (
        <Box
          border="darkGray"
          direction="column"
          flex="grow"
          marginBottom={4}
          marginLeft={2}
          marginRight={2}
          padding={4}
          rounding={4}
        >
          {Object.keys(propValues).map((prop) => (
            <Field
              key={prop}
              label={config.demoOptions?.controls?.[prop]?.label ?? startCase(prop)}
              {...config.demoOptions?.controls?.[prop]}
              value={propValues[prop]}
              onChange={(value: any) => {
                setPropValues({...cloneDeep(propValues), [prop]: value});
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const ComponentStatusSection = ({
  status,
  label,
}: {
  status: DemoConfigStatus;
  label: string;
}): React.ReactElement => {
  let iconName: FontAwesome5IconName;
  let color: AllColors = "gray";
  switch (status) {
    case "inProgress":
      iconName = "circle";
      break;
    case "ready":
      iconName = "check-circle";
      color = "green";
      break;
    case "notSupported":
      iconName = "times-circle";
      color = "red";
      break;
    case "planned":
      iconName = "calendar";
      break;
  }
  return (
    <Box alignItems="center" direction="row" marginBottom={2} marginRight={4}>
      <Box marginRight={1}>
        <Text>{label}:</Text>
      </Box>
      <Icon color={color} name={iconName} size="md" />
    </Box>
  );
};

const ComponentStatus = ({config}: {config: DemoConfiguration}): React.ReactElement | null => {
  return (
    <Box marginBottom={4} marginTop={4}>
      <Box marginBottom={2}>
        <Heading size="sm">Status</Heading>
      </Box>
      <Box direction="column" mdDirection="row">
        <ComponentStatusSection label="Documentation" status={config.status.documentation} />
        <ComponentStatusSection label="Figma" status={config.status.figma} />
        <ComponentStatusSection label="Web" status={config.status.web} />
        <ComponentStatusSection label="iOS" status={config.status.ios} />
        <ComponentStatusSection label="Android" status={config.status.android} />
      </Box>
    </Box>
  );
};

export default function ComponentPage(): React.ReactElement {
  const {component} = useLocalSearchParams<{component: string}>();

  const config = DemoConfig.find((c) => c.name === component);

  if (!component || !config) {
    router.replace("/demo");
  }

  return (
    <Box padding={4} scroll>
      <Box marginBottom={4}>
        <Heading size="lg">{config?.name}</Heading>
      </Box>
      <Box marginBottom={4}>
        <Box marginBottom={2}>
          <Heading size="sm">Description</Heading>
        </Box>
        <MarkdownView>{config?.description}</MarkdownView>
      </Box>
      <ComponentDemo config={config!} />
      <ComponentProps props={config?.props?.children} />
      <ComponentStatus config={config!} />
      {Boolean(config?.related.length) && (
        <Box marginBottom={4}>
          <Box marginBottom={2}>
            <Heading size="sm">Related</Heading>
          </Box>
          <Text>{config?.related.join(", ")}</Text>
        </Box>
      )}
      <Box marginBottom={2}>
        <Heading size="sm">Examples</Heading>
      </Box>
      <ComponentStories config={config!} />
      {/* <ComponentTestMatrix config={config} /> */}
    </Box>
  );
}
