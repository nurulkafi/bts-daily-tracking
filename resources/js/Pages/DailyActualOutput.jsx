import React, { useState } from 'react';
import { Button, Text, Container, Table, Title, Box, Group, Collapse, TextInput, Select, Pagination, Card, Badge, Modal } from '@mantine/core';
import AppLayout from '../Layouts/AppLayout';
import { useDisclosure } from '@mantine/hooks';
import { DatePickerInput, MonthPickerInput } from '@mantine/dates';
import { IconXboxA, IconXboxX } from '@tabler/icons-react';

export default function DailyActualOutput(props) {

    const [dateFilter, setDateFilter] = useState(null);
    const [monthFilter, setMonthFilter] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [assemblyLineFilter, setAssemblyLineFilter] = useState('');
    const [poFilter, setPoFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;  // Adjust the number of items per page here

    const dailyPlanData = props.data;

    // Filter data based on selected date and assembly line
    const filteredData = dailyPlanData.filter((element) => {
        const isDateMatch = dateFilter ? new Date(element.date).toDateString() === new Date(dateFilter).toDateString() : true;
        const isMonthMatch = monthFilter
            ? new Date(element.date).getMonth() === new Date(monthFilter).getMonth() &&
            new Date(element.date).getFullYear() === new Date(monthFilter).getFullYear()
            : true;
        const isAssemblyLineMatch = assemblyLineFilter ? element.assembly_line === assemblyLineFilter : true;
        const isPoMatch = poFilter ? element.po === poFilter : true;
        return isDateMatch && isMonthMatch && isAssemblyLineMatch && isPoMatch;
    });

    const calculateMixMatching = (totalPrsDaily, totalPrsOutput) => {
        return Math.min(totalPrsDaily, totalPrsOutput);
    };

    const calculateAssemblyLineData = (assemblyLine) => {
        const lineData = filteredData.filter((item) => item.assembly_line === assemblyLine);

        const totalMixPrs = lineData.reduce((acc, curr) => acc + calculateMixMatching(curr.total_prs, curr.total_prs_output), 0);
        const totalPrs = lineData.reduce((acc, curr) => acc + curr.total_prs, 0);
        const totalPrsOutput = lineData.reduce((acc, curr) => acc + curr.total_prs_output, 0);

        const mixPercentage = totalMixPrs && totalPrsOutput ? (totalPrsOutput / totalMixPrs) * 100 : 0;
        const volume = totalPrs ? (totalPrsOutput / totalPrs) * 100 : 0;
        const bts = mixPercentage / 100 * volume / 100 * 100;

        return { totalMixPrs, mixPercentage, volume, bts };
    };

    // Calculate the slice of data to be shown on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const rows = currentItems.map((element, index) => {
        const { totalMixPrs, mixPercentage, volume, bts } = calculateAssemblyLineData(element.assembly_line);

        return (
            <Table.Tr key={element.id}>
                <Table.Td>{indexOfFirstItem + index + 1}</Table.Td>
                <Table.Td>{element.date}</Table.Td>
                <Table.Td>{element.factory}</Table.Td>
                <Table.Td>{element.assembly_line}</Table.Td>
                <Table.Td>{element.po}</Table.Td>
                <Table.Td>{element.size}</Table.Td>
                <Table.Td><Badge color='blue'>{element.total_prs}</Badge></Table.Td>
                <Table.Td>
                    <Badge color={element.total_prs_output < element.total_prs ? 'red' : 'green'}>{element.total_prs_output ?? 0}</Badge>
                </Table.Td>
                <Table.Td>
                    <Badge color={element.total_prs_output < element.total_prs ? 'red' : 'green'}>{calculateMixMatching(element.total_prs, element.total_prs_output)}</Badge>
                </Table.Td>
                <Table.Td>
                    <Badge color={element.total_prs_output < element.total_prs ? 'red' : 'green'}>{totalMixPrs}</Badge>
                </Table.Td>
                <Table.Td>
                    <Badge color={element.total_prs_output < element.total_prs ? 'red' : 'green'}>{mixPercentage.toFixed(2)}%</Badge>
                </Table.Td>
                <Table.Td>
                    <Badge color={element.total_prs_output < element.total_prs ? 'red' : 'green'}>{volume.toFixed(2)}%</Badge>
                </Table.Td>
                <Table.Td>
                    <Badge color={element.total_prs_output < element.total_prs ? 'red' : 'green'}>{bts.toFixed(2)}</Badge>
                </Table.Td>
            </Table.Tr>
        );
    });

    // Get unique assembly lines for the Select options
    const assemblyLines = [...new Set(dailyPlanData.map((element) => element.assembly_line))];

    // Get unique po numbers for the Select options
    const poNumbers = [...new Set(dailyPlanData.map((element) => element.po))];

    // Calculate the total number of pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <AppLayout>
            <Modal opened={opened} onClose={close} withCloseButton={true} closeButtonProps={{
                icon: <IconXboxX size={20} />
            }}>
                <Text mt={10} size='sm'>Choose Filter Data If You Want :</Text>
                <Select
                    value={assemblyLineFilter}
                    onChange={(value) => setAssemblyLineFilter(value)}
                    data={assemblyLines}
                    placeholder="Select assembly line"
                    clearable
                    radius={"md"}
                    label="Filter by Assembly Line"
                />
                <MonthPickerInput
                    label="Filter by Month"
                    placeholder="Select month"
                    value={monthFilter}
                    onChange={(value) => setMonthFilter(value)}
                    clearable
                    radius={'md'}
                    onc
                />
                <Select
                    value={poFilter}
                    onChange={(value) => setPoFilter(value)}
                    label="Filter by PO"
                    data={poNumbers}
                    placeholder="Select PO"
                    clearable
                    radius={"md"}
                />
                <Group justify='flex-end' mt={10}>
                    <Button
                        onClick={() => {
                            const params = new URLSearchParams();

                            if (assemblyLineFilter) {
                                params.append('assembly_line', assemblyLineFilter);
                            }
                            if (dateFilter) {
                                params.append('date', dateFilter);
                            }
                            if (poFilter) {
                                params.append('po', poFilter);
                            }
                            if (monthFilter) {
                                params.append('month', monthFilter.toLocaleString('default', { month: 'long' }) + ' ' + monthFilter.getFullYear());
                            }

                            const redirectUrl = '/daily-actual-output/create' + (params.toString() ? `?${params.toString()}` : '');
                            window.location.href = redirectUrl;
                        }}
                        radius="md"
                        leftSection="+"
                        color="teal"
                    >
                        Insert
                    </Button>
                </Group>
            </Modal>

            <Group mb={20} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title order={2}>Daily Actual Output</Title>
                <Button
                    onClick={open}
                    radius="md"
                    leftSection="+"
                    color='teal'
                >
                    Insert Actual Output
                </Button>
            </Group>
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
                        <Select
                            value={assemblyLineFilter}
                            onChange={(value) => setAssemblyLineFilter(value)}
                            label="Filter by Assembly Line"
                            data={assemblyLines}
                            placeholder="Select assembly line"
                            clearable
                            radius={"md"}
                        />
                        <Select
                            value={poFilter}
                            onChange={(value) => setPoFilter(value)}
                            label="Filter by PO"
                            data={poNumbers}
                            placeholder="Select PO"
                            clearable
                            radius={"md"}
                        />
                    </Group>
                </Card.Section>
            </Card>

            <Card withBorder shadow="sm" radius="md">
                <Card.Section withBorder inheritPadding py="md">
                    <Group mt={10} mb={10} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title order={3}>Daily Plan Data</Title>
                        <Pagination
                            page={currentPage}
                            total={totalPages}
                            onChange={handlePageChange}
                            radius={"md"}
                            color='teal'
                        />
                    </Group>
                    <Table>
                        <Table.Thead>
                            {/* Header pertama untuk kategori utama */}
                            <Table.Tr>
                                <Table.Th></Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th></Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>
                                    <Badge color="blue" size="lg">Daily Plan</Badge>
                                </Table.Th>
                                <Table.Th colSpan={5} style={{ textAlign: 'center' }}>
                                    <Badge color="teal" size="lg">Daily Actual Output</Badge>
                                </Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                            {/* Header kedua untuk subkategori */}
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Date</Table.Th>
                                <Table.Th>Factory</Table.Th>
                                <Table.Th>Assembly Line</Table.Th>
                                <Table.Th>PO</Table.Th>
                                <Table.Th>Size</Table.Th>
                                <Table.Th>Total (PRS)</Table.Th>
                                <Table.Th>Total (PRS)</Table.Th>
                                <Table.Th>Mix Matching</Table.Th>
                                <Table.Th>Total Mix (PRS)</Table.Th>
                                <Table.Th>Mix %</Table.Th>
                                <Table.Th>Volume %</Table.Th>
                                <Table.Th>BTS %</Table.Th>
                                <Table.Th>Udate</Table.Th>
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
                </Card.Section>
            </Card>
        </AppLayout>
    );
}
