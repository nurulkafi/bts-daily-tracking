import React, { useState } from 'react';
import { Button, Text, Container, Table, Title, Box, Group, Collapse, TextInput, Select, Pagination, Card } from '@mantine/core';
import AppLayout from '../Layouts/AppLayout';
import { useDisclosure } from '@mantine/hooks';
import { DatePickerInput, MonthPickerInput } from '@mantine/dates';

export default function DailyPlan(props) {

    const [dateFilter, setDateFilter] = useState(null);
    const [assemblyLineFilter, setAssemblyLineFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState(null);
    const [poFilter, setPoFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;  // Adjust the number of items per page here

    const dailyPlanData = props.dailyPlanData;

    // Filter data based on selected date and assembly line
    const filteredData = dailyPlanData.filter((element) => {
        const isDateMatch = dateFilter ? new Date(element.date).toDateString() === new Date(dateFilter).toDateString() : true;
        const isAssemblyLineMatch = assemblyLineFilter ? element.assembly_line === assemblyLineFilter : true;
        const isPoMatch = poFilter ? element.po === poFilter : true;
        const isMonthMatch = monthFilter
            ? new Date(element.date).getMonth() === new Date(monthFilter).getMonth() &&
            new Date(element.date).getFullYear() === new Date(monthFilter).getFullYear()
            : true;
        return isDateMatch && isMonthMatch && isAssemblyLineMatch && isPoMatch;
    });

    // Calculate the slice of data to be shown on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const rows = currentItems.map((element, index) => (
        <Table.Tr key={element.id}>
            <Table.Td>{indexOfFirstItem + index + 1}</Table.Td>
            <Table.Td>{element.date}</Table.Td>
            <Table.Td>{element.factory}</Table.Td>
            <Table.Td>{element.assembly_line}</Table.Td>
            <Table.Td>{element.po}</Table.Td>
            <Table.Td>{element.size}</Table.Td>
            <Table.Td>{element.total_prs}</Table.Td>
        </Table.Tr>
    ));

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
            <Group mb={20} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title order={2}>Daily Plan</Title>
                <Button
                    onClick={() => window.location.href = '/daily-plan/create'}
                    radius="md"
                    leftSection="+"
                    color='teal'
                >
                    Create
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
                            <Table.Tr>
                                <Table.Th>No</Table.Th>
                                <Table.Th>Date</Table.Th>
                                <Table.Th>Factory</Table.Th>
                                <Table.Th>Assembly Line</Table.Th>
                                <Table.Th>PO</Table.Th>
                                <Table.Th>Size</Table.Th>
                                <Table.Th>Total PRS</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filteredData.length > 0 ? (
                                rows
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={7} style={{ textAlign: 'center', color: 'gray' }}>
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
