import { useState } from "react";
import { ActionIcon, Button, Card, CardSection, Group, NumberInput, Select, Table, TextInput, Title } from "@mantine/core";
import AppLayout from "../../Layouts/AppLayout";
import { DatePickerInput } from "@mantine/dates";
import { IconCheck, IconDeviceFloppy, IconFileExcel, IconTrash, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import * as XLSX from "xlsx";
export default function Create() {
    // State untuk menyimpan baris tabel
    const [rows, setRows] = useState([
        { id: 1, date: null, factory: "", assemblyLine: "", po: "", size: null, totalPrs: null },
    ]);

    // Fungsi untuk menambah baris baru
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            date: null,
            factory: "",
            assemblyLine: "",
            po: "",
            size: null,
            totalPrs: null,
        };
        setRows([...rows, newRow]);
    };

    // Fungsi untuk menghapus baris berdasarkan ID
    const deleteRow = (id) => {
        const updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
    };

    // Fungsi untuk menyimpan data ke backend
    const saveData = async () => {
        const hasEmptyFields = rows.some(
            (row) => !row.date || !row.factory || !row.assemblyLine || !row.po || !row.size || !row.totalPrs
        );

        if (hasEmptyFields) {
            alert("Please fill in all fields before saving.");
            return;
        }

        // Format data yang akan dikirim ke API
        const payload = {
            items: rows.map((row) => ({
                date: row.date,
                factory: row.factory,
                assembly_line: row.assemblyLine,
                po: row.po,
                size: row.size,
                total_prs: row.totalPrs,
            })),
        };


        try {
            const id = notifications.show({
                loading: true,
                title: "Loading Saving Data",
                autoClose: false,
                withCloseButton: false,
                message: "Please Wait",
                position: "top-right",
            })
            const response = await fetch("http://localhost:8000/api/daily-plans", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                notifications.update({
                    id,
                    title: "Success",
                    message: "Data saved successfully!",
                    color: "green",
                    icon: <IconCheck />,
                    loading: false,
                    onClose: () => {
                        window.location.href = "/daily-plan";
                    },
                    autoClose: 3000,
                    position: "top-right",
                    withCloseButton: true
                })
            } else {
                const error = await response.json();
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
 // Fungsi untuk membaca file Excel
 const handleImportExcel = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Konversi sheet menjadi JSON
        const data = XLSX.utils.sheet_to_json(sheet);
        console.log(data);

        // Konversi data ke dalam format state rows
        const importedRows = data.map((row, index) => ({
            id: index + 1,
            date: row["Date (YYYY-MM-DD)"] ? new Date(row["Date (YYYY-MM-DD)"]) : null,
            factory: row["Factory (e.g., MPI, UNI)"] || "",
            assemblyLine: row["Assembly Line (e.g., A01, A02)"] || "",
            po: row["PO (e.g., PO12345)"] || "",
            size: row["Size (Mix)"] || null,
            totalPrs: row["Total PRs"] || null,
        }));

        setRows(importedRows);
    };

    reader.readAsBinaryString(file);
};
    return (
        <AppLayout>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <CardSection withBorder inheritPadding py="md">
                    <Title order={2}>Create Daily Plan</Title>
                </CardSection>
                <CardSection withBorder inheritPadding py="md">
                    <Group mb={20} mt={20}>
                        <Button onClick={addRow} leftSection={<IconDeviceFloppy size={16} />} radius="md" color="Blue">
                            Add New Item
                        </Button>
                    </Group>
                    <Group mb={20} mt={20}>
                        <Button
                            leftSection={<IconFileExcel size={16} />}
                            radius="md"
                            color="lime"
                            onClick={() => {
                                window.location.href = "http://localhost:8000/api/daily-plan/template";
                            }}
                        >
                            Download Template
                        </Button>
                        <Button component="label" leftSection={<IconFileExcel size={16} />} radius="md" color="green">
                            Import Data Excel
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleImportExcel}
                                hidden
                            />
                        </Button>
                    </Group>
                    <Table striped withTableBorder withColumnBorders mt={10}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>No</Table.Th>
                                <Table.Th>Date</Table.Th>
                                <Table.Th>Factory</Table.Th>
                                <Table.Th>Assembly Line</Table.Th>
                                <Table.Th>PO</Table.Th>
                                <Table.Th>Size (Mix)</Table.Th>
                                <Table.Th>Total PRs</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {rows.map((row, index) => (
                                <Table.Tr key={row.id}>
                                    <Table.Th>{index + 1}</Table.Th>
                                    <Table.Th>
                                        <DatePickerInput
                                            clearable
                                            value={row.date}
                                            placeholder="Pick date"
                                            onChange={(value) => {
                                                const updatedRows = [...rows];
                                                updatedRows[index].date = value;
                                                setRows(updatedRows);
                                            }}
                                            radius="md"
                                        />
                                    </Table.Th>
                                    <Table.Th>
                                        <Select searchable
                                            data={['MPI', 'UNI']}
                                            value={row.factory}
                                            onChange={(select) => {
                                                const updatedRows = [...rows];
                                                updatedRows[index].factory = select;
                                                setRows(updatedRows);
                                            }}
                                            clearable
                                            radius="md"
                                        />
                                    </Table.Th>
                                    <Table.Th>
                                        <Select searchable
                                            data={['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 'A19', 'A20', 'A21', 'A22']}
                                            value={row.assemblyLine}
                                            onChange={(select) => {
                                                const updatedRows = [...rows];
                                                updatedRows[index].assemblyLine = select;
                                                setRows(updatedRows);
                                            }}
                                            clearable
                                            radius="md"
                                        />
                                    </Table.Th>
                                    <Table.Th>
                                        <TextInput
                                            value={row.po}
                                            onChange={(event) => {
                                                const updatedRows = [...rows];
                                                updatedRows[index].po = event.target.value;
                                                setRows(updatedRows);
                                            }}
                                            radius="md"
                                        />
                                    </Table.Th>
                                    <Table.Th>
                                        <NumberInput
                                            value={row.size}
                                            onChange={(value) => {
                                                const updatedRows = [...rows];
                                                updatedRows[index].size = value;
                                                setRows(updatedRows);
                                            }}
                                            radius="md"
                                        />
                                    </Table.Th>
                                    <Table.Th>
                                        <NumberInput
                                            value={row.totalPrs}
                                            onChange={(value) => {
                                                const updatedRows = [...rows];
                                                updatedRows[index].totalPrs = value;
                                                setRows(updatedRows);
                                            }}
                                            radius="md"
                                        />
                                    </Table.Th>
                                    <Table.Th>
                                        <ActionIcon color="red" onClick={() => deleteRow(row.id)}>
                                            <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
                                        </ActionIcon>
                                    </Table.Th>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                    <Group justify="flex-end" mt="md">
                        <Button onClick={saveData} leftSection={<IconDeviceFloppy size={16} />} radius={"md"}>
                            Save
                        </Button>
                    </Group>
                </CardSection>
            </Card>
        </AppLayout>
    );
}
