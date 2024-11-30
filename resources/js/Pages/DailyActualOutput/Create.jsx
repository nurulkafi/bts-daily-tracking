import { useState } from "react";
import {
    ActionIcon,
    Badge,
    Button,
    Card,
    CardSection,
    Group,
    Notification,
    NumberInput,
    Table,
    TextInput,
    Title,
} from "@mantine/core";
import AppLayout from "../../Layouts/AppLayout";
import { DatePickerInput } from "@mantine/dates";
import { IconCheck, IconDeviceFloppy, IconTrash, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { Head } from "@inertiajs/react";
import { useDisclosure } from '@mantine/hooks';
import { MonthPickerInput } from '@mantine/dates';

export default function Create(props) {

    const [dateFilter, setDateFilter] = useState(null);
    const [monthFilter, setMonthFilter] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [assemblyLineFilter, setAssemblyLineFilter] = useState('');
    const [poFilter, setPoFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;  // Adjust the number of items per page here

    const dailyPlanData = props.data;
    const [data, setData] = useState(
        dailyPlanData.map((element) => ({
            ...element,
            total_prs_output: element.total_prs_output || 0, // Initialize total_prs_output if not set
        }))
    );

        // Filter data based on MONTH
    const filteredData = dailyPlanData.filter((element) => {
        const isDateMatch = dateFilter ? new Date(element.date).toDateString() === new Date(dateFilter).toDateString() : true;
        const isMonthMatch = monthFilter
            ? new Date(element.date).getMonth() === new Date(monthFilter).getMonth() &&
            new Date(element.date).getFullYear() === new Date(monthFilter).getFullYear()
            : true;
        return isDateMatch && isMonthMatch;
    });

    const handleTotalPrsOutputChange = (index, value) => {
        const updatedData = [...data];
        updatedData[index].total_prs_output = value;
        setData(updatedData);
    };

    const calculateMixMatching = (totalPrsDaily, totalPrsOutput) => {
        return Math.min(totalPrsDaily, totalPrsOutput);
    };

    const calculateTotalMixPrs = () => {
        return data.reduce(
            (acc, curr) =>
                acc +
                calculateMixMatching(curr.total_prs, curr.total_prs_output),
            0
        );
    };

    const calculateTotalMixPercentage = (totalMixPrs) => {
        const totalPrsOutput = data.reduce(
            (acc, curr) => acc + curr.total_prs_output,
            0
        );
        return totalMixPrs && totalPrsOutput
            ? (totalPrsOutput / totalMixPrs) * 100
            : 0;
    };

    const calculateVolume = () => {
        const totalPrs = data.reduce((acc, curr) => acc + curr.total_prs, 0);
        const totalPrsOutput = data.reduce(
            (acc, curr) => acc + curr.total_prs_output,
            0
        );
        return totalPrsOutput ? totalPrsOutput / totalPrs : 0;
    };

    const calculateBts = (mixPercenteg, volume) => {
        return mixPercenteg * volume * 100;
    };

    const saveData = async () => {
        const hasEmptyFields = data.some(
            (row) => row.total_prs_output === null
        );

        if (hasEmptyFields) {
            alert("Please fill in all fields before saving.");
            return;
        }

        const payload = {
            items: data.map((row) => ({
                total_prs: row.total_prs_output,
                daily_plan_id: row.id,
            })),
        };

        try {
            const id = notifications.show({
                loading : true,
                title: "Loading Saving Data",
                autoClose: false,
                withCloseButton: false,
                message: "Please Wait",
                position: "top-right",
            })
            const response = await fetch(
                "http://localhost:8000/api/daily-actual-outputs",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                notifications.update({
                    id,
                    title: "Success",
                    message: "Data saved successfully!",
                    color: "green",
                    icon: <IconCheck />,
                    loading: false,
                    onClose: () => {
                        window.location.href = "/daily-actual-output";
                    },
                    autoClose: 3000,
                    position: "top-right",
                    withCloseButton: true
                })
                // window.location.href = "/daily-actual-output";
            } else {
                // const error = await response.json();
                // alert(`Failed to save data: ${error.message}`);
                notifications.update({
                    id,
                    title: "Failed",
                    message: `Failed to save data`,
                    color: "red",
                    icon: <IconX />,
                    loading: false,
                    autoClose: 3000,
                    position: "top-right",
                })
            }
        } catch (error) {
            // console.error("Error saving data:", error);
            notifications.show({
                title: "Failed",
                message: `Error saving data`,
                color: "red",
                icon: <IconX />,
                autoClose: 3000,
                position: "top-right",
            })
        }
    };

    

    const totalMixPrs = calculateTotalMixPrs();
    const totalMixPercentage = calculateTotalMixPercentage(totalMixPrs);
    const volume = calculateVolume();

    const rows =  filteredData.map((element, index) => {
        const mixMatching = calculateMixMatching(
            element.total_prs,
            element.total_prs_output
        );
        const bts = calculateBts(totalMixPercentage / 100, volume);

        return (
            <Table.Tr key={element.id}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{element.date}</Table.Td>
                <Table.Td>{element.factory}</Table.Td>
                <Table.Td>{element.assembly_line}</Table.Td>
                <Table.Td>{element.po}</Table.Td>
                <Table.Td>{element.size}</Table.Td>
                <Table.Td>
                    <Badge color="blue">{element.total_prs}</Badge>
                </Table.Td>
                <Table.Td>
                    <NumberInput
                        value={element.total_prs_output}
                        size="xs"
                        placeholder="Total PRS Output"
                        onChange={(value) =>
                            handleTotalPrsOutputChange(index, value)
                        }
                    />
                </Table.Td>
                <Table.Td>
                    <Badge color="green">{mixMatching}</Badge>
                </Table.Td>
                <Table.Td>
                    <Badge color="green">{totalMixPrs}</Badge>
                </Table.Td>
                <Table.Td>
                    <Badge color="green">{totalMixPercentage}%</Badge>
                </Table.Td>
                <Table.Td>
                    <Badge color="green">{(volume * 100).toFixed(2)}%</Badge>
                </Table.Td>
                <Table.Td>
                    <Badge color="green">{bts.toFixed(2)}%</Badge>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <AppLayout>
            <Title order={1} mb={20}>Insert Daily Actual Output</Title>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <CardSection withBorder inheritPadding py="md">
                    <Title order={5}>Data Daily Actual Output</Title>
                </CardSection>
                <Card withBorder shadow="sm" radius="md" mb={20}>
                <Card.Section withBorder inheritPadding py="md">
                    <Title order={3}>Filters Data</Title>
                    <Group mt={10} mb={10} justify='flex-start'>
                        {/* <DatePickerInput
                            value={dateFilter}
                            onChange={setDateFilter}
                            label="Filter by Date"
                            placeholder="Pick a date"
                            clearable
                            radius={"md"}
                        /> */}
                        <MonthPickerInput
                            label="Filter by Month"
                            placeholder="Select Month"
                            value={monthFilter}
                            onChange={(value) => setMonthFilter(value)}
                            clearable
                            w={200}
                            radius={'md'}
                            onc
                        />
                    </Group>
                </Card.Section>
            </Card>
                <CardSection withBorder inheritPadding py="md">
                    <Table mt={10}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th></Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th style={{ textAlign: "center" }}>
                                    <Badge color="blue" size="lg">
                                        Daily Plan
                                    </Badge>
                                </Table.Th>
                                <Table.Th
                                    colSpan={5}
                                    style={{ textAlign: "center" }}
                                >
                                    <Badge color="green" size="lg">
                                        Daily Actual Output
                                    </Badge>
                                </Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>No</Table.Th>
                                <Table.Th>Date</Table.Th>
                                <Table.Th>Factory</Table.Th>
                                <Table.Th>Assembly Line</Table.Th>
                                <Table.Th>PO</Table.Th>
                                <Table.Th>Size (Volume)</Table.Th>
                                <Table.Th>
                                    <Badge color="blue">
                                        Total PRS (Volume)
                                    </Badge>
                                </Table.Th>
                                <Table.Th>
                                    <Badge color="green">
                                        Total PRS (Volume)
                                    </Badge>
                                </Table.Th>
                                <Table.Th>
                                    <Badge color="green">Mix Matching</Badge>
                                </Table.Th>
                                <Table.Th>
                                    <Badge color="green">Total Mix PRS</Badge>
                                </Table.Th>
                                <Table.Th>
                                    <Badge color="green">Mix %</Badge>
                                </Table.Th>
                                <Table.Th>
                                    <Badge color="green">Volume %</Badge>
                                </Table.Th>
                                <Table.Th>
                                    <Badge color="green">BTS %</Badge>
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filteredData.length > 0 ? (
                                rows
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={13} style={{ textAlign: 'center', color: 'gray' }}>
                                        Data Not Found
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                    <Group justify="flex-end" mt="md">
                        <Button
                            onClick={saveData}
                            leftSection={<IconDeviceFloppy size={16} />}
                            radius={"md"}
                        >
                            Save
                        </Button>
                    </Group>
                </CardSection>
            </Card>
        </AppLayout>
    );
}
