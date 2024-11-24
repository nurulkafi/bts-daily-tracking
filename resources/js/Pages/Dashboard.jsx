import React, { useEffect, useState } from 'react';
import { Button, Text, Container, Grid, Card, Table, Title, Group, Flex } from '@mantine/core';
import AppLayout from '../Layouts/AppLayout';
import { Bar } from 'recharts';
import { BarChart } from '@mantine/charts';
import { MonthPickerInput } from '@mantine/dates';
import dayjs from 'dayjs';

export default function Home(props) {
    const data = props.data;
    const defaultMonthYear = props.monthYear
        ? dayjs(props.monthYear, 'MMMM YYYY').toDate()
        : new Date();
    const month = new Date().toLocaleString('default', { month: 'long' });
    // monthYear is default monthFilter
    const [monthFilter, setMonthFilter] = useState(defaultMonthYear);
    const chartData = data.map((element) => ({
        item: element.assembly_line, // Assembly line sebagai label
        'BTS %': element.bts ?? 0, // BTS % sebagai nilai
        color: 'blue', // Warna bar
    }));
    const rows = data.map((element, index) => (
        <Table.Tr key={element.id}>
            <Table.Td>{element.assembly_line}</Table.Td>
            <Table.Td>{element.total_prs_plan}</Table.Td>
            <Table.Td>{element.total_prs_output ?? 0}</Table.Td>
            <Table.Td>{element.total_mix_prs ?? 0}</Table.Td>
            <Table.Td>{element.mix_percentage ?? 0} %</Table.Td>
            <Table.Td>{element.volume ?? 0} %</Table.Td>
            <Table.Td>{element.bts ?? 0} %</Table.Td>
        </Table.Tr>
    ))
    const handleMonthChange = (value) => {
        setMonthFilter(value);
        if (value instanceof Date && !isNaN(value)) {
            const formattedMonthYear = value.toLocaleString('default', { month: 'long' }) + ' ' + value.getFullYear();
            // Redirect to dashboard with the selected month_year
            window.location.href = `/dashboard?month_year=${formattedMonthYear}`;
        }
    };
    return (
        <AppLayout>
            <h1>Dashboard</h1>
            <h1 align="center">BTS {monthFilter?.toLocaleString('default', { month: 'long' })} {monthFilter?.getFullYear()}</h1>

            <Card withBorder shadow="sm" radius="md" mb={20}>
                <Card.Section withBorder inheritPadding py="md">
                    <Flex gap="md" align={'center'}>
                        <MonthPickerInput
                            label="Select Month"
                            placeholder="Select Month"
                            value={monthFilter}
                            onChange={handleMonthChange}
                            clearable
                            w={400}
                            radius={'md'}
                            onc
                        />
                    </Flex>
                </Card.Section>
            </Card>
            <Grid>
                <Grid.Col span={6}>
                    <Card withBorder shadow="sm" radius="md" mb={20}>
                        <Title m={5} order={3}>Data Summary</Title>
                        <Card.Section withBorder inheritPadding py="md">
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>LINE</Table.Th>
                                        <Table.Th>Total prs(Plan)</Table.Th>
                                        <Table.Th>Total prs(Actual)</Table.Th>
                                        <Table.Th>Total Mix prs</Table.Th>
                                        <Table.Th>Mix %</Table.Th>
                                        <Table.Th>Volume %</Table.Th>
                                        <Table.Th>BTS %</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>{rows}</Table.Tbody>
                            </Table>
                        </Card.Section>
                    </Card>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Card withBorder shadow="sm" radius="md" mb={20}>
                        <Title m={5} order={3} align="center">Charts</Title>
                        <Card.Section withBorder inheritPadding py="md">
                            <BarChart
                                h={300} // Tinggi chart
                                data={chartData} // Data chart
                                dataKey="item" // Field untuk label sumbu X
                                series={[{ name: 'BTS %', color: 'blue' }]} // Nama dan warna bar
                                xAxisLabel="Assembly Line"
                                yAxisLabel="BTS %"
                                size={300}
                                withTooltip={false}
                                withBarValueLabel
                                valueFormatter={(value) => `${value}%`}
                            />
                        </Card.Section>
                    </Card>
                </Grid.Col>
            </Grid>
        </AppLayout>
    );
}
