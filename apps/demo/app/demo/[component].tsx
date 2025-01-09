import {ErrorBoundary} from "@components";
import {DemoConfig, DemoConfigStatus, DemoConfiguration, DemoConfigurationProp} from "@config";
import {router, useLocalSearchParams, useNavigation} from "expo-router";
import {
  Badge,
  Box,
  Field,
  Heading,
  Icon,
  IconName,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableText,
  Text,
  TextColor,
} from "ferns-ui";
import cloneDeep from "lodash/cloneDeep";
import startCase from "lodash/startCase";
import React, {useEffect, useState} from "react";
// @ts-ignore
import MarkdownView from "react-native-markdown-display";

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
          <TableHeaderCell index={0} title="Name" />
          <TableHeaderCell index={1} title="Type" />
          <TableHeaderCell index={2} title="Default" />
        </TableHeader>
        {/* eslint-disable-next-line react/prop-types */}
        {sortedProps.map((p) => (
          <TableRow key={p.name}>
            <Box direction="row">
              <TableText value={p.name} />
              {Boolean(p.flags?.isOptional !== true) && (
                <Box marginLeft={1}>
                  <Badge status="warning" value="Required" />
                </Box>
              )}
            </Box>
            <Box direction="column" width={160} wrap>
              <TableText value={p.type.name} />
              {Boolean(p.comment?.summary?.[0]?.text) && (
                <Box marginTop={2}>
                  <TableText value={p.comment?.summary?.[0]?.text} />
                </Box>
              )}
            </Box>
            <TableText value="-" />
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
          <Box key={i} marginBottom={8} rounding="lg">
            <Box marginBottom={2}>
              <Heading size="sm">{s}</Heading>
            </Box>
            {Boolean(config.stories[s]?.description) && (
              <MarkdownView>{config.stories[s]?.description}</MarkdownView>
            )}
            <Box border="dark" padding={4} rounding="lg">
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
        border="dark"
        direction="column"
        flex="grow"
        justifyContent="center"
        marginBottom={4}
        marginLeft={2}
        marginRight={2}
        padding={4}
        rounding="lg"
      >
        <ErrorBoundary>{config.demo?.(propValues)}</ErrorBoundary>
      </Box>
      {Boolean(hasControls) && (
        <Box
          border="dark"
          direction="column"
          flex="grow"
          marginBottom={4}
          marginLeft={2}
          marginRight={2}
          padding={4}
          rounding="lg"
        >
          {Object.keys(propValues).map((prop) => (
            <Field
              key={prop}
              title={config.demoOptions?.controls?.[prop]?.title ?? startCase(prop)}
              {...(config.demoOptions?.controls?.[prop] as any)}
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
  title,
}: {
  status: DemoConfigStatus;
  title: string;
}): React.ReactElement => {
  let iconName: IconName = "circle";
  let color: TextColor = "secondaryLight";
  switch (status) {
    case "inProgress":
      iconName = "circle";
      break;
    case "ready":
      iconName = "circle-check";
      color = "success";
      break;
    case "notSupported":
      iconName = "circle-xmark";
      color = "error";
      break;
    case "planned":
      iconName = "calendar";
      break;
  }
  return (
    <Box alignItems="center" direction="row" marginBottom={2} marginRight={4}>
      <Box marginRight={1}>
        <Text>{title}:</Text>
      </Box>
      <Icon color={color} iconName={iconName} size="md" />
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
        <ComponentStatusSection status={config.status.documentation} title="Documentation" />
        <ComponentStatusSection status={config.status.figma} title="Figma" />
        <ComponentStatusSection status={config.status.web} title="Web" />
        <ComponentStatusSection status={config.status.ios} title="iOS" />
        <ComponentStatusSection status={config.status.android} title="Android" />
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

  const navigation = useNavigation();
  // Set the title
  useEffect(() => {
    navigation.setOptions({title: component});
  }, [navigation, component]);

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
