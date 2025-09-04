"use client";

import { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";

type User = {
  id: number;
  name: string;
  email: string;
  address: {
    city: string;
  };
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;

  useEffect(() => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data: User[]) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const processedUsers = useMemo(() => {
    const filtered = users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email)
    );

    return filtered;
  }, [users, search, sortOrder]);

  const totalPages = Math.ceil(processedUsers.length / rowsPerPage);
  const paginatedUsers = processedUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const handleNext = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));

  const handlePrev = () =>
    setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>

      <Input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>
                <button
                  onClick={handleSort}
                  className="flex items-center gap-2"
                >
                  Email {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </TableHead>
              <TableHead>City</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address.city}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
