import React, { useState } from 'react';
import { Button, Text, Container, Table, Title, Box, Group, Collapse, TextInput, Select, Pagination, Card ,ActionIcon} from '@mantine/core';
import AppLayout from '../Layouts/AppLayout';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { IconCheck, IconDeviceFloppy, IconTrash, IconX } from "@tabler/icons-react";
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
            <Table.Td>
            <ActionIcon color="red" onClick={() => handleDelete(element.id)}>
                    <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
        </Table.Td>
        </Table.Tr>
    ));

 const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    // Show loading notification
    const loadingId = notifications.show({
        title: "Deleting...",
        message: "Please wait while we delete the data.",
        color: "blue",
        loading: true,
        position: "top-right",
        autoClose: false,
        withCloseButton: false,
    });

    try {
        const response = await fetch(`http://localhost:8000/api/daily-plans/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            // Update notification to show success
            notifications.update({
                id: loadingId,
                title: "Success",
                message: "Data deleted successfully!",
                color: "green",
                icon: <IconCheck />,
                loading: false,
                autoClose: 3000,
                position: "top-right",
                withCloseButton: true,
                onClose: () => {
                    window.location.href = "/daily-plan"; // Redirect after success
                },
            });
        } else {
            const error = await response.json();
            // Update notification to show failure
            notifications.update({
                id: loadingId,
                title: "Failed",
                message: `Failed to delete data`,
                color: "red",
                icon: <IconX />,
                loading: false,
                autoClose: 3000,
                position: "top-right",
                withCloseButton: true,
            });
        }
    } catch (error) {
        // Show error notification in case of network failure
        notifications.update({
            id: loadingId,
            title: "Failed",
            message: `Error deleting data`,
            color: "red",
            icon: <IconX />,
            loading: false,
            autoClose: 3000,
            position: "top-right",
            withCloseButton: true,
        });
    }
};
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
                                <Table.Th>Delete</Table.Th>
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
