// @ts-nocheck


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  
  const sales = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      amount: "$250.00",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      amount: "$150.00",
    },
    {
      id: "3",
      name: "Alice Johnson",
      email: "alice@example.com",
      amount: "$350.00",
    },
    {
      id: "4",
      name: "Bob Brown",
      email: "bob@example.com",
      amount: "$450.00",
    },
    {
      id: "5",
      name: "Charlie Davis",
      email: "charlie@example.com",
      amount: "$550.00",
    },
  ];
  
  export function RecentSales() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.name}</TableCell>
              <TableCell>{sale.email}</TableCell>
              <TableCell>{sale.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }